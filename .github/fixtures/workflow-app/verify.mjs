import assert from 'node:assert/strict';
import { access, readFile, realpath, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('.', import.meta.url));
assert.equal(await realpath(process.cwd()), await realpath(directory));
const stage = process.argv[2];
assert.ok(['pre-test', 'unit', 'check', 'gallery', 'browser'].includes(stage));
await access('package-lock.json');
if (stage !== 'pre-test') await access('pre-test.marker');
if (stage === 'check') await access('unit.marker');
if (stage === 'gallery') await access('check.marker');
if (stage === 'browser') {
  await access('contract.marker');
  assert.equal(process.env.FRAGMENT_KIT_CONTRACT_CONFIG, 'contract.config.mjs');
  assert.match(await (await fetch(process.env.FRAGMENT_KIT_BASE_URL)).text(), /Nested workflow fixture/);
}
assert.match(await readFile('index.html', 'utf8'), /Nested workflow fixture/);
await writeFile(`${stage}.marker`, 'ok');
console.log(`Verified ${stage} in nested app`);
