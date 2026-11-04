import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createConfig, redirectUri, isAppURL, bytes, bounded, text, encode64, decode64, readResponse,
  compress, decompress, DocumentRegistry, createDocuments, createUrlState, computeCID, isCID, cidLength,
  cid, verify, createStorage, RenderScheduler } from '../src/index.js';

export const config = createConfig({ slug: 'test', name: 'Test', storagePrefix: 'test', canonicalOrigin: 'https://test.hashbin.page/', recoveryOrigin: 'https://curtcox.github.io/test/', repo: 'curtcox/test', docs: 'docs/', gallery: 'gallery.html', documentType: 'test' });
export const type = { type: 'test', settingsKeys: ['w'], normalize: doc => ({ src: doc.src, test: doc.test ?? { width: 800 }, ...(doc.files ? { files: doc.files } : {}) }), isDefault: doc => doc.test.width === 800 && !doc.files };
export function memory() { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key), values }; }
export function clock() { let count = 0; const pending = new Map(); return { setTimeout(fn) { pending.set(++count, fn); return count; }, clearTimeout(id) { pending.delete(id); }, async flush() { const work = [...pending.values()]; pending.clear(); for (const fn of work) await fn(); }, pending }; }

test('config validates origins, prefixes, and meta fallback without inventing a client id', () => {
  assert.equal(config.hashbinClientId, '');
  assert.equal(redirectUri(config, 'https://test.hashbin.page/'), config.canonicalOrigin);
  assert.equal(redirectUri(config, 'http://localhost:8000/'), config.recoveryOrigin);
  assert.equal(isAppURL('https://curtcox.github.io/other/#x', config), false);
  assert.equal(isAppURL('https://curtcox.github.io/test/index.html#x', config), true);
  for (const change of [{ storagePrefix: '' }, { docs: 'javascript:alert(1)' }, { canonicalOrigin: 'https://x/no-slash' }, { maxBytes: -1 }]) assert.throws(() => createConfig({ ...config, ...change }));
});
test('UTF-8, canonical base64url and byte bounds', () => {
  for (const value of ['', 'hello', '😀 café 日本語', 'x'.repeat(20000)]) assert.equal(text(decode64(encode64(bytes(value)))), value);
  for (const invalid of ['A', '+/==', '_x']) assert.throws(() => decode64(invalid));
  assert.throws(() => bounded('😀😀', 7), /limit/);
  assert.throws(() => text(Uint8Array.of(0xc3, 0x28)), /encoded data/);
});
test('stream bounds reject dishonest responses and cancel downloads', async () => {
  let cancelled = false;
  const response = new Response(new ReadableStream({ start(controller) { controller.enqueue(bytes('abcd')); }, cancel() { cancelled = true; } }));
  await assert.rejects(readResponse(response, 3), /limit/); assert.equal(cancelled, true);
  assert.equal(text(await readResponse(new Response('hello'), 5)), 'hello');
});
test('compression round trips empty, Unicode and large source; bombs, malformed and truncated input fail', () => {
  for (const src of ['', '😀 café 日本語', 'a'.repeat(10000)]) assert.equal(decompress(compress(src)), src);
  for (const input of ['', 'invalid!', compress('hello').slice(0, -1), compress('hello') + 'junk']) assert.throws(() => decompress(input));
  assert.throws(() => decompress(compress('a'.repeat(100000)), 2048), /exceeds/);
  assert.throws(() => decompress(compress('😀'.repeat(100)), 250), /limit/);
  assert.throws(() => decompress(compress('a'), 0), /limit/);
});
test('envelopes preserve complete documents and reject wrong type, versions and sizes', () => {
  const registry = new DocumentRegistry(); registry.register(type); assert.equal(registry.get('test').type, 'test');
  assert.throws(() => registry.register(type)); assert.throws(() => registry.get('missing'));
  const documents = createDocuments(type);
  const doc = { src: 'x', test: { width: 640 }, files: { 'x.txt': 'data' } };
  assert.deepEqual(documents.parse(documents.serialize(doc)), doc);
  assert.equal(documents.parse('plain').src, 'plain');
  for (const patch of [{ version: 2 }, { type: 'other' }]) assert.throws(() => documents.parse(JSON.stringify({ format: 'hashbin-diagram', version: 1, type: 'test', src: 'x', ...patch })));
  assert.throws(() => createDocuments(type, 30).serialize(doc), /limit/);
});
test('CID vectors and parsing reject host tricks, trailing bits, length and digest mismatch', async () => {
  for (const src of ['', 'hello', 'x'.repeat(64), 'x'.repeat(65), '😀'.repeat(50)]) {
    const value = await computeCID(src); assert.ok(isCID(value)); assert.equal(cidLength(value), bytes(src).length);
    assert.ok(await verify(value, bytes(src)));
    assert.equal(cid('https://256t.us/' + value), value);
    assert.equal(cid('https://256t.us.evil/' + value), null);
    assert.equal(cid('https://user@256t.us/' + value), null);
    await assert.rejects(verify(value, bytes(src + '!')), /match/);
  }
  assert.equal(isCID('AAAAAAAB_x'), false); assert.equal(cid('javascript:evil'), null);
});
test('URL precedence, legacy readers, settings, scrubbing, canonical round trips', async () => {
  const kit = createUrlState({ config, type });
  const doc = { src: 'Unicode 😀', test: { width: 640 }, files: { 'a.txt': 'full state' } };
  const built = kit.build(doc, { run: false, view: 'preview', url: config.recoveryOrigin + '?example=old&code=secret&utm=kept#old' });
  assert.ok(new URL(built.href).hash.startsWith('#v1.'));
  assert.equal(new URL(built.href).searchParams.get('utm'), 'kept');
  assert.equal(new URL(built.href).searchParams.has('code'), false);
  assert.deepEqual(kit.parse(built.href).doc, doc); assert.deepEqual(kit.parse(built.plain).doc, doc);
  for (const src of ['{"src":"this is source"}', '"quoted"', '{"format":"hashbin-diagram","version":9,"type":"other","src":"literal"}', 'null', '42']) {
    assert.equal(kit.parse(kit.build({ src }).href).doc.src, src);
  }
  assert.equal(kit.parse(built.href).run, false);
  const cid = await computeCID('inline');
  const saved = new URL(kit.link(built.href, cid));
  assert.equal(saved.searchParams.get('run'), '0'); assert.equal(saved.searchParams.get('view'), 'preview');
  assert.equal(kit.parse(config.recoveryOrigin + '?doc=bad&example=x#' + cid).kind, 'cid');
  assert.equal(kit.parse(config.recoveryOrigin + '?doc=bad#hashbin_publish=x').kind, 'publish');
  assert.equal(kit.parse(config.recoveryOrigin + '?doc=bad#plain').doc.src, 'plain');
  assert.equal(kit.parse(config.recoveryOrigin + '?example=x').id, 'x');
  assert.equal(kit.parse(config.recoveryOrigin).kind, 'none');
  assert.equal(kit.parse(config.recoveryOrigin + '?w=640&compressed=' + compress('x')).settings.w, '640');
  for (const suffix of ['#v2.abc', '#v1.invalid!', '#%FF', '?doc=invalid!']) assert.throws(() => kit.parse(config.recoveryOrigin + suffix));
  const custom = createUrlState({ config, type, legacyReaders: [(url, { decompress }) => url.hash.startsWith('#custom=') ? { src: decompress(url.hash.slice(8)) } : null] });
  assert.equal(custom.parse(config.recoveryOrigin + '#custom=' + compress('yes')).doc.src, 'yes');
});
test('history writes coalesce and cancel before explicit loads; never pushState', async () => {
  const timers = clock(), writes = [];
  const kit = createUrlState({ config, type, timers, history: { replaceState(...args) { writes.push(args); } } });
  kit.write({ src: 'a' }); kit.write({ src: 'b' }); await timers.flush(); assert.equal(writes.length, 1);
  assert.equal(kit.parse(writes[0][2]).doc.src, 'b'); kit.write({ src: 'c' }); kit.cancel(); await timers.flush(); assert.equal(writes.length, 1);
});
test('storage keys are scoped and reads survive denial; quota errors remain visible to draft code', () => {
  const backend = memory(), store = createStorage({ prefix: 'test', storage: backend });
  store.setItem('draft', 'x'); assert.equal(backend.getItem('test:draft'), 'x'); store.removeItem('draft'); assert.equal(store.getItem('draft'), null);
  const blocked = createStorage({ prefix: 'test', storage: { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } } });
  assert.equal(blocked.getItem('x'), null); assert.throws(() => blocked.setItem('x', 'y'), /quota/);
  assert.throws(() => createStorage({ prefix: '' }));
});
test('scheduler aborts superseded work and suppresses stale results', async () => {
  const timers = clock(), pending = [], results = [];
  const scheduler = new RenderScheduler({ timers, render: (src, context) => new Promise(resolve => pending.push({ src, context, resolve })), onResult: result => results.push(result) });
  scheduler.schedule('old'); const first = timers.flush(); await Promise.resolve();
  scheduler.schedule('new'); assert.equal(pending[0].context.signal.aborted, true);
  pending[0].resolve('old'); await first;
  const second = timers.flush(); await Promise.resolve(); pending[1].resolve('new'); await second;
  assert.deepEqual(results, ['new']);
});
