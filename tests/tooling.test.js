import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { sync, verifyManifest } from '../tools/vendor-sync.mjs';
import { inside, sha256 } from '../tools/lib.mjs';
import { generateOffline } from '../tools/offline-assets.mjs';

test('pinned sync verifies hashes and extras; modified versions are never overwritten', async () => {
  const target = await fs.mkdtemp(path.join(os.tmpdir(), 'fragment-kit-sync-test-'));
  try {
    const folder = await sync({ target }); assert.equal((await verifyManifest(folder)).version, '0.1.0');
    assert.equal(await sync({ target }), folder);
    await fs.appendFile(path.join(folder, 'src/core/cid.js'), '\n// edited\n');
    await assert.rejects(verifyManifest(folder), /changed/); await assert.rejects(sync({ target }), /changed/);
    for (const value of ['../outside', '/absolute', 'src/../outside', 'src\\evil']) assert.throws(() => inside(folder, value), /Unsafe/);
  } finally { await fs.rm(target, { recursive: true, force: true }); }
});
test('offline manifest hashes every shipped file, detects staleness, and requires a prefix', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fragment-kit-offline-test-'));
  try {
    await fs.writeFile(path.join(root, 'index.html'), 'hello');
    const file = path.join(root, 'offline.config.json');
    await fs.writeFile(file, JSON.stringify({ prefix: 'test-app', files: ['index.html'] }));
    const manifest = await generateOffline(file); assert.equal(manifest.hashes['index.html'], sha256('hello')); assert.match(manifest.version, /^test-app-/);
    await generateOffline(file, true); await fs.writeFile(path.join(root, 'index.html'), 'changed'); await assert.rejects(generateOffline(file, true), /stale/);
    await fs.writeFile(file, JSON.stringify({ files: ['index.html'] })); await assert.rejects(generateOffline(file), /prefix/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

async function worker({ bad = false } = {}) {
  const stores = new Map(), events = {}, origin = 'https://test.example/app/';
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map()); const data = stores.get(name);
      return { async put(key, response) { data.set(key, response.clone()); }, async match(key) { return data.get(key)?.clone(); }, async delete(key) { return data.delete(key); } };
    }, async keys() { return [...stores.keys()]; }, async delete(name) { return stores.delete(name); },
  };
  const source = await fs.readFile(new URL('../src/offline/sw-core.js', import.meta.url), 'utf8');
  const manifest = { prefix: 'test', version: 'test-v1', assets: ['index.html', 'asset.js'], hashes: { 'index.html': sha256('index'), 'asset.js': sha256('asset') } };
  const self = { OfflineAssets: manifest, registration: { scope: origin }, location: new URL(origin), clients: { claim: async () => {} }, addEventListener(type, handler) { events[type] = handler; }, skipWaiting() {} };
  vm.runInNewContext(source, { self, crypto, caches, Response, Headers, URL, fetch: async url => new Response(bad ? 'wrong' : url.endsWith('asset.js') ? 'asset' : 'index') });
  async function fire(type, data = {}) { let result; events[type]({ ...data, waitUntil(value) { result = value; }, respondWith(value) { result = value; } }); return result; }
  return { stores, caches, fire, manifest, origin };
}
test('offline install is atomic and activation cleans only its own app prefix', async () => {
  const broken = await worker({ bad: true }); await assert.rejects(broken.fire('install'), /manifest/); assert.deepEqual(await broken.caches.keys(), []);
  const good = await worker(); await good.fire('install'); assert.deepEqual(await good.caches.keys(), ['test-v1']);
  await good.caches.open('test-old'); await good.caches.open('sibling-old'); await good.fire('activate');
  assert.deepEqual((await good.caches.keys()).sort(), ['sibling-old', 'test-v1']);
});
test('offline status verifies every cached byte and repair replaces corruption', async () => {
  const fixture = await worker(); await fixture.fire('install');
  const cache = await fixture.caches.open('test-v1'); await cache.put(fixture.origin + 'asset.js', new Response('tampered'));
  let status; const port = { postMessage(value) { status = value; } };
  await fixture.fire('message', { data: { type: 'offline-status' }, ports: [port] }); assert.equal(status.ready, false);
  await fixture.fire('message', { data: { type: 'repair-offline' }, ports: [port] }); assert.equal(status.ready, true);
  const response = await fixture.fire('fetch', { request: { method: 'GET', url: fixture.origin + 'index.html?compressed=secret', mode: 'navigate' } });
  assert.equal(await response.text(), 'index');
});
