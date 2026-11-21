#!/usr/bin/env node
// Rejects files that are too big for their type, with a ratchet for existing ones.
//
//   node scripts/file-sizes.mjs                 check tracked files in the working tree
//   node scripts/file-sizes.mjs --rev REV       check the files committed at REV
//   node scripts/file-sizes.mjs --update        tighten the baseline (drop or shrink entries only)
//   node scripts/file-sizes.mjs --accept PATH…  deliberately baseline files at their current size
//   node scripts/file-sizes.mjs --limits        print the limits
//   node scripts/file-sizes.mjs --install-hook  point core.hooksPath at .githooks
//   node scripts/file-sizes.mjs --pre-push REMOTE   used by .githooks/pre-push (reads stdin)
//
// This lives outside tools/ and package.json on purpose: those are hashed into the
// release manifest, and this is a repository check, not part of the shipped kit.
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KiB = 1024, MiB = 1024 * KiB;
export const BASELINE = 'scripts/file-sizes.baseline.json';
export const LIMITS = [
  { kind: 'script', pattern: /\.(?:m?js|cjs|mts|cts|ts|jsx|tsx)$/i, bytes: 100 * KiB },
  { kind: 'stylesheet', pattern: /\.css$/i, bytes: 50 * KiB },
  { kind: 'html', pattern: /\.html?$/i, bytes: 100 * KiB },
  { kind: 'text', pattern: /\.(?:md|txt)$/i, bytes: 64 * KiB },
  { kind: 'data', pattern: /\.(?:json|webmanifest|csv)$/i, bytes: 100 * KiB },
  { kind: 'config', pattern: /\.(?:ya?ml|toml)$|(?:^|\/)\.[^/]*(?:ignore|attributes)$/i, bytes: 20 * KiB },
  { kind: 'svg', pattern: /\.svg$/i, bytes: 100 * KiB },
  { kind: 'image', pattern: /\.(?:png|jpe?g|gif|webp|avif|ico)$/i, bytes: 250 * KiB },
  { kind: 'font', pattern: /\.(?:woff2?|ttf|otf)$/i, bytes: 250 * KiB },
  { kind: 'wasm', pattern: /\.wasm$/i, bytes: 2 * MiB },
  { kind: 'pdf', pattern: /\.pdf$/i, bytes: 1 * MiB },
];
// Anything else, including archives and model weights, gets the conservative default.
export const DEFAULT_LIMIT = { kind: 'other', bytes: 100 * KiB };
export const limitFor = file => LIMITS.find(limit => limit.pattern.test(file)) ?? DEFAULT_LIMIT;

export const formatBytes = bytes => bytes >= MiB ? `${(bytes / MiB).toFixed(2)} MiB` : bytes >= KiB ? `${(bytes / KiB).toFixed(1)} KiB` : `${bytes} B`;
const ZERO = /^0+$/;

function git(cwd, argv, input) {
  const result = spawnSync('git', argv, { cwd, input, maxBuffer: 1 << 30 });
  if (result.error) throw result.error;
  if (result.status) throw new Error(`git ${argv.join(' ')} failed: ${result.stderr.toString().trim()}`);
  return result.stdout.toString();
}
const splitZ = text => text.split('\0').filter(Boolean);

// Files committed at a revision: [{ path, bytes, oid }].
export function revisionFiles(root, rev) {
  return splitZ(git(root, ['ls-tree', '-r', '-l', '-z', '--full-tree', `${rev}^{tree}`])).flatMap(line => {
    const [meta, file] = [line.slice(0, line.indexOf('\t')), line.slice(line.indexOf('\t') + 1)];
    const [, type, oid, size] = meta.split(/\s+/);
    return type === 'blob' ? [{ path: file, bytes: Number(size), oid }] : [];
  });
}

// Tracked files as they are on disk. Blob ids are computed only when needed.
export async function worktreeFiles(root) {
  const files = [];
  for (const file of new Set(splitZ(git(root, ['ls-files', '-z', '--cached'])))) {
    const stat = await fs.lstat(path.join(root, file)).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
    if (stat && !stat.isDirectory()) files.push({ path: file, bytes: stat.size });
  }
  return files;
}
function fillOids(root, files) {
  const missing = files.filter(file => !file.oid);
  if (!missing.length) return;
  const oids = git(root, ['hash-object', '--stdin-paths'], missing.map(file => file.path).join('\n') + '\n').trim().split('\n');
  missing.forEach((file, i) => { file.oid = oids[i]; });
}

export async function readBaseline(root, rev) {
  if (rev) {
    const result = spawnSync('git', ['show', `${rev}:${BASELINE}`], { cwd: root, maxBuffer: 1 << 30 });
    return result.status ? { files: {} } : JSON.parse(result.stdout.toString());
  }
  try { return JSON.parse(await fs.readFile(path.join(root, BASELINE), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return { files: {} }; throw error; }
}
async function writeBaseline(root, baseline) {
  const files = Object.fromEntries(Object.entries(baseline.files).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  const about = 'Files allowed to exceed the limits in scripts/file-sizes.mjs. Entries may only shrink or disappear: run node scripts/file-sizes.mjs --update after making a file smaller.';
  await fs.writeFile(path.join(root, BASELINE), JSON.stringify({ about, files }, null, 2) + '\n');
}

// A file over its limit passes when the baseline allows its path at least that size
// (the ratchet), or when its exact bytes are already baselined elsewhere (git stores
// identical content once, so another copy adds nothing to the repository).
export function evaluate(root, files, baseline, { stale = true } = {}) {
  const entries = baseline.files ?? {};
  const allowedOids = new Set(Object.values(entries).map(entry => entry.oid));
  const over = files.filter(file => file.bytes > limitFor(file.path).bytes && !(entries[file.path]?.bytes >= file.bytes));
  fillOids(root, over);
  const violations = over.filter(file => !allowedOids.has(file.oid)).map(file => ({ ...file, limit: limitFor(file.path), allowed: entries[file.path]?.bytes }));
  const staleEntries = [];
  if (stale) {
    const byPath = new Map(files.map(file => [file.path, file]));
    for (const [file, entry] of Object.entries(entries)) {
      const current = byPath.get(file);
      if (!current) staleEntries.push({ path: file, reason: 'is no longer tracked' });
      else if (current.bytes <= limitFor(file).bytes) staleEntries.push({ path: file, reason: `is now within its ${formatBytes(limitFor(file).bytes)} limit` });
      else if (current.bytes < entry.bytes) staleEntries.push({ path: file, reason: `shrank from ${formatBytes(entry.bytes)} to ${formatBytes(current.bytes)}` });
    }
  }
  return { violations, stale: staleEntries };
}

// Ratchet only: removes entries that are gone or within limits, and lowers entries for
// files that shrank. It never adds entries or raises an allowance.
export async function tighten(root, files) {
  const baseline = await readBaseline(root);
  const byPath = new Map(files.map(file => [file.path, file]));
  const changes = [];
  for (const [file, entry] of Object.entries(baseline.files)) {
    const current = byPath.get(file);
    if (!current || current.bytes <= limitFor(file).bytes) { delete baseline.files[file]; changes.push(`removed ${file}`); }
    else if (current.bytes < entry.bytes) {
      fillOids(root, [current]);
      baseline.files[file] = { bytes: current.bytes, limit: limitFor(file).bytes, oid: current.oid };
      changes.push(`lowered ${file} to ${formatBytes(current.bytes)}`);
    }
  }
  if (changes.length) await writeBaseline(root, baseline);
  return changes;
}

// Deliberate loosening, for reviewed additions such as a new pinned vendor engine.
export async function accept(root, files, paths) {
  const baseline = await readBaseline(root);
  const byPath = new Map(files.map(file => [file.path, file]));
  const changes = [];
  for (const file of paths) {
    const current = byPath.get(file);
    if (!current) throw new Error(`${file} is not a tracked file. git add it first.`);
    const limit = limitFor(file).bytes;
    if (current.bytes <= limit) { changes.push(`skipped ${file}: ${formatBytes(current.bytes)} is within its ${formatBytes(limit)} limit`); continue; }
    fillOids(root, [current]);
    baseline.files[file] = { bytes: current.bytes, limit, oid: current.oid };
    changes.push(`accepted ${file} at ${formatBytes(current.bytes)}`);
  }
  await writeBaseline(root, baseline);
  return changes;
}

// Blobs that a push would add to the remote, keyed by blob id.
export function pushedBlobs(root, remote, updates) {
  const blobs = new Map();
  for (const { localSha, remoteSha } of updates) {
    if (ZERO.test(localSha)) continue;
    const exclude = remote ? [`--remotes=${remote}`] : [];
    if (!ZERO.test(remoteSha) && spawnSync('git', ['cat-file', '-e', remoteSha], { cwd: root }).status === 0) exclude.push(remoteSha);
    const objects = git(root, ['rev-list', '--objects', localSha, ...(exclude.length ? ['--not', ...exclude] : [])]).split('\n').filter(Boolean);
    const paths = new Map(objects.map(line => {
      const space = line.indexOf(' ');
      return space < 0 ? [line, ''] : [line.slice(0, space), line.slice(space + 1)];
    }));
    const fresh = [...paths.keys()].filter(oid => !blobs.has(oid));
    if (!fresh.length) continue;
    for (const line of git(root, ['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], fresh.join('\n') + '\n').trim().split('\n')) {
      const [oid, type, size] = line.split(' ');
      if (type === 'blob' && paths.get(oid)) blobs.set(oid, { path: paths.get(oid), bytes: Number(size), oid });
    }
  }
  return [...blobs.values()];
}

export function parseUpdates(input) {
  return input.split('\n').filter(line => line.trim()).map(line => {
    const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
    return { localRef, localSha, remoteRef, remoteSha };
  });
}

export async function prePush(root, remote, input) {
  const updates = parseUpdates(input);
  const problems = [];
  for (const update of updates) {
    if (ZERO.test(update.localSha)) continue;
    const baseline = await readBaseline(root, update.localSha);
    const added = evaluate(root, pushedBlobs(root, remote, [update]), baseline, { stale: false });
    const tip = evaluate(root, revisionFiles(root, update.localSha), baseline);
    const seen = new Set(added.violations.map(file => file.oid));
    problems.push({ ref: update.localRef, violations: [...added.violations, ...tip.violations.filter(file => !seen.has(file.oid))], stale: tip.stale });
  }
  return problems;
}

function report({ violations, stale }, label = '') {
  const where = label ? ` in ${label}` : '';
  for (const file of violations) {
    const allowed = file.allowed ? `; baseline allows ${formatBytes(file.allowed)}` : '';
    console.error(`too big${where}: ${file.path} is ${formatBytes(file.bytes)}, over the ${formatBytes(file.limit.bytes)} ${file.limit.kind} limit${allowed}`);
  }
  for (const entry of stale) console.error(`stale baseline${where}: ${entry.path} ${entry.reason}`);
  return violations.length + stale.length;
}
function advice(problems) {
  if (problems.some(problem => problem.violations.length)) console.error('Shrink or remove the files above. If one is a deliberate, reviewed addition, run\n  node scripts/file-sizes.mjs --accept PATH\nand commit the baseline change with it.');
  if (problems.some(problem => problem.stale.length)) console.error('Files got smaller. Lock in the gain with\n  node scripts/file-sizes.mjs --update\nand commit the baseline.');
}

async function main(argv) {
  const root = git(process.cwd(), ['rev-parse', '--show-toplevel']).trim();
  const [flag, ...rest] = argv;
  if (flag === '--limits') {
    for (const limit of [...LIMITS, DEFAULT_LIMIT]) console.log(`${limit.kind.padEnd(10)} ${formatBytes(limit.bytes).padStart(10)}  ${limit.pattern?.source ?? '(everything else)'}`);
    return 0;
  }
  if (flag === '--install-hook') {
    const current = spawnSync('git', ['config', '--get', 'core.hooksPath'], { cwd: root }).stdout.toString().trim();
    if (current && current !== '.githooks') { console.error(`core.hooksPath is already ${current}. Leaving it alone; call .githooks/pre-push from your own hook.`); return 1; }
    git(root, ['config', 'core.hooksPath', '.githooks']);
    console.log('Installed: git now runs .githooks/pre-push before every push.');
    return 0;
  }
  if (flag === '--update') {
    const changes = await tighten(root, await worktreeFiles(root));
    console.log(changes.length ? changes.join('\n') : 'Baseline is already tight.');
    return 0;
  }
  if (flag === '--accept') {
    if (!rest.length) { console.error('Name the files to accept.'); return 2; }
    console.log((await accept(root, await worktreeFiles(root), rest)).join('\n'));
    return 0;
  }
  if (flag === '--pre-push') {
    const input = await new Promise((resolve, reject) => { let text = ''; process.stdin.setEncoding('utf8').on('data', chunk => { text += chunk; }).on('end', () => resolve(text)).on('error', reject); });
    const problems = await prePush(root, rest[0], input);
    const count = problems.reduce((sum, problem) => sum + report(problem, problem.ref), 0);
    if (!count) return 0;
    advice(problems);
    console.error('Push rejected by the file size check.');
    return 1;
  }
  if (flag && flag !== '--rev') { console.error(`Unknown option ${flag}`); return 2; }
  const files = flag === '--rev' ? revisionFiles(root, rest[0] ?? 'HEAD') : await worktreeFiles(root);
  const baseline = await readBaseline(root, flag === '--rev' ? rest[0] ?? 'HEAD' : undefined);
  const result = evaluate(root, files, baseline);
  if (!report(result)) { console.log(`File sizes OK (${Object.keys(baseline.files).length} baselined files over their limits).`); return 0; }
  advice([result]);
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(code => { process.exitCode = code; }, error => { console.error(error.message); process.exitCode = 2; });
}
