import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { limitFor, worktreeFiles, revisionFiles, readBaseline, evaluate, tighten, accept, prePush } from '../scripts/file-sizes.mjs';

const env = { ...process.env, GIT_AUTHOR_NAME: 'Test', GIT_AUTHOR_EMAIL: 'test@example.invalid', GIT_COMMITTER_NAME: 'Test', GIT_COMMITTER_EMAIL: 'test@example.invalid', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' };
function git(cwd, ...argv) {
  const result = spawnSync('git', argv, { cwd, env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
async function repo() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fragment-kit-sizes-'));
  git(root, 'init', '-q', '-b', 'main');
  await fs.mkdir(path.join(root, 'scripts'));
  return root;
}
const write = (root, file, bytes) => fs.mkdir(path.dirname(path.join(root, file)), { recursive: true }).then(() => fs.writeFile(path.join(root, file), 'x'.repeat(bytes)));
const commit = (root, message) => { git(root, 'add', '-A'); git(root, 'commit', '-q', '-m', message); return git(root, 'rev-parse', 'HEAD'); };
const check = async root => evaluate(root, await worktreeFiles(root), await readBaseline(root));
const KiB = 1024;

test('limits depend on file type', () => {
  assert.equal(limitFor('src/a.js').kind, 'script');
  assert.equal(limitFor('docs/site.css').kind, 'stylesheet');
  assert.equal(limitFor('vendor/x/compat.wasm').bytes, 2 * 1024 * KiB);
  assert.equal(limitFor('demo/covers/a.PNG').kind, 'image');
  assert.equal(limitFor('model.gguf').kind, 'other');
  assert.ok(limitFor('a.wasm').bytes > limitFor('a.js').bytes);
});

test('the ratchet allows baselined files to shrink but never grow', async () => {
  const root = await repo();
  try {
    await write(root, 'small.js', 10 * KiB);
    await write(root, 'big.js', 150 * KiB);
    commit(root, 'start');
    assert.deepEqual((await check(root)).violations.map(file => file.path), ['big.js']);

    await accept(root, await worktreeFiles(root), ['big.js']);
    assert.deepEqual(await check(root), { violations: [], stale: [] });

    await write(root, 'big.js', 151 * KiB);
    assert.deepEqual((await check(root)).violations.map(file => file.path), ['big.js'], 'growth is rejected');

    await write(root, 'big.js', 120 * KiB);
    assert.match((await check(root)).stale[0].reason, /shrank/);
    assert.deepEqual(await tighten(root, await worktreeFiles(root)), ['lowered big.js to 120.0 KiB']);
    assert.equal((await readBaseline(root)).files['big.js'].bytes, 120 * KiB);
    await write(root, 'big.js', 130 * KiB);
    assert.equal((await check(root)).violations.length, 1, 'the tightened allowance holds');

    await write(root, 'big.js', 50 * KiB);
    assert.match((await check(root)).stale[0].reason, /within/);
    await tighten(root, await worktreeFiles(root));
    assert.deepEqual((await readBaseline(root)).files, {});
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('tightening never adds or raises entries, and removed files go stale', async () => {
  const root = await repo();
  try {
    await write(root, 'a.wasm', 3 * 1024 * KiB);
    await write(root, 'b.json', 200 * KiB);
    commit(root, 'start');
    await accept(root, await worktreeFiles(root), ['a.wasm']);
    await write(root, 'a.wasm', 4 * 1024 * KiB);
    assert.deepEqual(await tighten(root, await worktreeFiles(root)), []);
    assert.equal((await readBaseline(root)).files['a.wasm'].bytes, 3 * 1024 * KiB);
    assert.equal((await readBaseline(root)).files['b.json'], undefined);

    git(root, 'rm', '-q', '-f', 'a.wasm');
    assert.match((await check(root)).stale[0].reason, /no longer tracked/);
    assert.deepEqual(await tighten(root, await worktreeFiles(root)), ['removed a.wasm']);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('identical copies of baselined bytes are allowed at new paths', async () => {
  const root = await repo();
  try {
    await write(root, 'vendor/engine.wasm', 3 * 1024 * KiB);
    commit(root, 'start');
    await accept(root, await worktreeFiles(root), ['vendor/engine.wasm']);
    await fs.mkdir(path.join(root, 'demo/vendor'), { recursive: true });
    await fs.copyFile(path.join(root, 'vendor/engine.wasm'), path.join(root, 'demo/vendor/engine.wasm'));
    git(root, 'add', '-A');
    assert.deepEqual(await check(root), { violations: [], stale: [] });
    await fs.appendFile(path.join(root, 'demo/vendor/engine.wasm'), 'changed');
    assert.deepEqual((await check(root)).violations.map(file => file.path), ['demo/vendor/engine.wasm']);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('pre-push rejects big files in any pushed commit, even ones deleted later', async () => {
  const root = await repo();
  const remote = await fs.mkdtemp(path.join(os.tmpdir(), 'fragment-kit-sizes-remote-'));
  try {
    git(remote, 'init', '-q', '--bare');
    git(root, 'remote', 'add', 'origin', remote);
    await write(root, 'ok.js', 1 * KiB);
    const first = commit(root, 'start');
    const zero = '0'.repeat(first.length);
    assert.deepEqual(await prePush(root, 'origin', `refs/heads/main ${first} refs/heads/main ${zero}\n`), [{ ref: 'refs/heads/main', violations: [], stale: [] }]);
    git(root, 'push', '-q', 'origin', 'main');

    await write(root, 'huge.bin', 500 * KiB);
    commit(root, 'add huge');
    git(root, 'rm', '-q', 'huge.bin');
    const tip = commit(root, 'remove huge');
    const [result] = await prePush(root, 'origin', `refs/heads/main ${tip} refs/heads/main ${first}\n`);
    assert.deepEqual(result.violations.map(file => file.path), ['huge.bin']);
    assert.deepEqual(revisionFiles(root, tip).map(file => file.path), ['ok.js']);

    git(root, 'reset', '-q', '--hard', first);
    await write(root, 'vendor/engine.wasm', 3 * 1024 * KiB);
    git(root, 'add', '-A');
    await accept(root, await worktreeFiles(root), ['vendor/engine.wasm']);
    const accepted = commit(root, 'deliberately add engine');
    assert.deepEqual(await prePush(root, 'origin', `refs/heads/main ${accepted} refs/heads/main ${first}\n`), [{ ref: 'refs/heads/main', violations: [], stale: [] }]);

    await fs.writeFile(path.join(root, 'scripts/file-sizes.baseline.json'), JSON.stringify({ files: {} }));
    assert.equal((await prePush(root, 'origin', `refs/heads/main ${accepted} refs/heads/main ${first}\n`))[0].violations.length, 0, 'uncommitted baseline edits do not change the pushed baseline');
    const deletion = await prePush(root, 'origin', `(delete) ${zero} refs/heads/old ${first}\n`);
    assert.deepEqual(deletion, []);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
    await fs.rm(remote, { recursive: true, force: true });
  }
});
