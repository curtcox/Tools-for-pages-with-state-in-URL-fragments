import test from 'node:test';
import assert from 'node:assert/strict';
import { parseManifest, createWeightStore, modelSuggestion } from '../src/ai/index.js';
import { computeCID } from '../src/core/cid.js';
const a = new TextEncoder().encode('A'.repeat(100)), b = new TextEncoder().encode('B'.repeat(100));
async function fixture() { return { format: 'fragment-kit-model', version: 1, name: 'Test model', license: { id: 'MIT', url: 'https://example.org/LICENSE' }, source: 'https://example.org/model', engine: { id: 'wllama', format: 'gguf' }, capabilities: ['generate'], contextTokens: 2048, requires: { webgpu: false, memoryBytes: 1024 }, files: [{ path: 'model.gguf', bytes: 200, shards: [{ cid: await computeCID(a), offset: 0 }, { cid: await computeCID(b), offset: 100 }] }], mirrors: ['https://bad.example/{cid}', 'https://good.example/{cid}'] }; }
function fakeCaches() { const caches = new Map(); return { async keys() { return [...caches.keys()]; }, async delete(name) { return caches.delete(name); }, async open(name) { if (!caches.has(name)) { const map = new Map(); caches.set(name, { match: async k => map.get(k)?.clone(), put: async (k, r) => map.set(k, r.clone()), delete: async k => map.delete(k), map }); } return caches.get(name); } }; }
test('model manifests reject linked code, gaps, size mismatch and mutable ranges', async () => {
  const m = await fixture(); assert.equal(parseManifest(m).name, 'Test model');
  m.engine.id = 'https://evil/code.js'; assert.throws(() => parseManifest(m), /allowlisted/); m.engine.id = 'wllama';
  m.files[0].shards[1].offset = 101; assert.throws(() => parseManifest(m), /offset/); m.files[0].shards[1].offset = 100;
  m.mirrors = [{ url: 'https://huggingface.co/x/resolve/main/{path}', ranges: true }]; assert.throws(() => parseManifest(m), /commit-pinned/);
  assert.throws(() => modelSuggestion('https://app.example/?model=garbage'), /Invalid/);
});
test('weights require consent, fall back on corruption, resume verified shards, and verify cache reads', async () => {
  const m = await fixture(), caches = fakeCaches(); let requests = 0;
  const store = createWeightStore({ prefix: 'test', caches, fetchSource: async url => { requests++; return new Response(url.startsWith('https://bad') ? b : url.endsWith(m.files[0].shards[0].cid) ? a : b); } });
  await assert.rejects(store.download(m), /Approve/); assert.equal(requests, 0);
  await store.download(m, { consent: true }); assert.equal(requests, 3); // bad mirror's B is correct for shard B
  await store.download(m, { consent: true }); assert.equal(requests, 3);
  const files = await store.files(m); assert.equal(await files[0].text(), 'A'.repeat(100) + 'B'.repeat(100));
  const cache = await caches.open((await store.list())[0]); const key = [...cache.map.keys()][0]; cache.map.set(key, new Response(b));
  await assert.rejects(store.files(m), /missing/); await store.download(m, { consent: true }); assert.equal(requests, 5);
  assert.equal(await store.remove(m), true);
});
test('all corrupt mirrors fail without caching unverified content', async () => {
  const m = await fixture(), caches = fakeCaches();
  const store = createWeightStore({ prefix: 'test', caches, fetchSource: async () => new Response(b) });
  await assert.rejects(store.download(m, { consent: true }), /failed verification/);
  await assert.rejects(store.files(m), /missing/);
});
