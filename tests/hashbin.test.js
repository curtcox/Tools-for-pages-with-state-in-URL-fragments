import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HashBinStore, HashBinPanel, computeCID, bytes } from '../src/index.js';
import { config, type, memory } from '../testing/fixtures/helpers.js';
const store = options => new HashBinStore({ config, type, ...options });

test('inline CIDs load without fetching; remote CIDs are verified before parsing', async () => {
  let requests = 0;
  const local = store({ fetchSource: () => { requests++; throw Error('network'); } });
  assert.equal((await local.load(await computeCID('hello'))).src, 'hello'); assert.equal(requests, 0);
  const payload = 'x'.repeat(100), cid = await computeCID(payload);
  assert.equal((await store({ fetchSource: async () => new Response(payload) }).load(cid)).src, payload);
  await assert.rejects(store({ fetchSource: async () => new Response('wrong') }).load(cid), /match/);
  await assert.rejects(store({ fetchSource: async () => new Response('', { status: 404 }) }).load(cid), /expired/);
  await assert.rejects(store({ fetchSource: async () => new Response('', { status: 500 }) }).load(cid), /HTTP 500/);
  await assert.rejects(local.load('not-a-cid'), /valid/);
  const shortLimit = store({ config: { ...config, maxBytes: 3 } });
  await assert.rejects(shortLimit.load(await computeCID('large')), /limit/);
});
test('streaming limits, timeout abort, and invalid UTF-8 fail explicitly', async () => {
  const cid = await computeCID('x'.repeat(100));
  await assert.rejects(store({ fetchSource: async () => new Response('x'.repeat(101)) }).load(cid), /limit/);
  let aborted = false;
  await assert.rejects(store({ timeout: 5, fetchSource: (_, { signal }) => { signal.addEventListener('abort', () => { aborted = true; }); return new Promise(() => {}); } }).load(cid), /timed out/);
  assert.equal(aborted, true);
  await assert.rejects(store().load(await computeCID(Uint8Array.of(255))), /encoded data/);
});
test('init is shared, retriable, and missing ids never get invented', async () => {
  await assert.rejects(store().init(), /registered client ID/);
  let count = 0;
  class HashBinClient { constructor(options) { this.options = options; } }
  const instance = store({ clientId: 'test-id', loadSDK: async () => { count++; return { HashBinClient }; } });
  const [a, b] = await Promise.all([instance.init(), instance.init()]);
  assert.equal(a, b); assert.equal(count, 1); assert.equal(a.options.redirectUri, config.recoveryOrigin);
  assert.throws(() => a.options.storage.setItem('tokens', 'secret'), /credentials/);
  const broken = store({ clientId: 'id', loadSDK: async () => { throw Error('SDK unavailable'); } });
  await assert.rejects(broken.init()); await assert.rejects(broken.init()); assert.equal(broken.initializing, null);
});
test('publish enters SDK synchronously and validates approved content; cancellation and redirect survive', async () => {
  let entered = false, options;
  const instance = store({ clientId: 'id', loadSDK: async () => ({ HashBinClient: class {
    publish(payload, opts) { entered = true; options = opts; return computeCID(payload).then(cid => ({ cid })); }
  } }) });
  await instance.init();
  const snapshot = { src: 'hello' }, payload = instance.documents.serialize(snapshot);
  const pending = instance.publish(payload, snapshot); assert.equal(entered, true);
  assert.equal((await pending).cid, await computeCID(payload)); assert.deepEqual(options.clientState.snapshot, snapshot);
  instance.client.publish = () => Promise.resolve({ redirected: true }); assert.equal((await instance.publish(payload, snapshot)).redirected, true);
  instance.client.publish = () => Promise.reject(Error('access_denied')); await assert.rejects(instance.publish(payload, snapshot), /cancelled/);
  instance.client.publish = () => Promise.resolve({ cid: 'AAAAAAAA' }); await assert.rejects(instance.publish(payload, snapshot), /match/);
});
test('callbacks restore snapshots on approval/cancel and do not handle unrelated hashes', async () => {
  const snapshot = { src: 'saved', test: { width: 800 } };
  const instance = store({ clientId: 'id' });
  instance.client = { handlePublishCallback: async () => ({ cid: await computeCID(instance.documents.serialize(snapshot)), clientState: { snapshot } }) };
  assert.equal(await instance.published('#source'), null);
  assert.deepEqual((await instance.published('#hashbin_publish=s')).snapshot, snapshot);
  instance.client.handlePublishCallback = async () => { const error = Error('access_denied'); error.clientState = { snapshot }; throw error; };
  const result = await instance.published('#hashbin_publish=s'); assert.match(result.error, /cancelled/); assert.deepEqual(result.snapshot, snapshot);
});
test('the real SDK restores pre-kit envelope bytes despite different JSON key order', async () => {
  const snapshot = { src: 'saved before migration', test: { width: 800 } }, transactionStorage = memory();
  const instance = store({ clientId: 'legacy', transactionStorage });
  const payload = JSON.stringify({ format: 'hashbin-diagram', version: 1, type: 'test', ...snapshot });
  assert.notEqual(payload, instance.documents.serialize(snapshot));
  const cid = await computeCID(payload);
  for (const cancelled of [false, true]) {
    transactionStorage.setItem('hashbin:publish:legacy:state', JSON.stringify({ bytes: Buffer.from(payload).toString('base64url'), clientState: { snapshot }, createdAt: Date.now() }));
    const result = await instance.published('#hashbin_publish=state&' + (cancelled ? 'error=access_denied' : 'cid=' + cid));
    assert.deepEqual(result.snapshot, snapshot);
    if (cancelled) assert.match(result.error, /cancelled/); else assert.equal(result.cid, cid);
    assert.equal(transactionStorage.values.size, 0);
  }
});
test('callback verification rejects substituted bytes and a snapshot that differs from the saved document', async () => {
  const snapshot = { src: 'original', test: { width: 800 } }, transactionStorage = memory();
  const instance = store({ clientId: 'id', transactionStorage }), payload = instance.documents.serialize(snapshot), cid = await computeCID(payload);
  transactionStorage.setItem('hashbin:publish:id:state', JSON.stringify({ bytes: Buffer.from(payload).toString('base64url') }));
  instance.client = { handlePublishCallback: async () => ({ cid, clientState: { snapshot: { ...snapshot, src: 'substituted' } } }) };
  const changed = await instance.published('#hashbin_publish=state');
  assert.match(changed.error, /snapshot does not match/); assert.equal(changed.snapshot, null);
  instance.client.handlePublishCallback = async () => ({ cid: await computeCID(payload + 'changed'), clientState: { snapshot } });
  assert.match((await instance.published('#hashbin_publish=state')).error, /does not match/);
});
test('callback transaction bytes are bounded before the SDK decodes them', async () => {
  const transactionStorage = memory(), instance = store({ config: { ...config, maxBytes: 16 }, clientId: 'id', transactionStorage });
  transactionStorage.setItem('hashbin:publish:id:state', JSON.stringify({ bytes: Buffer.alloc(100).toString('base64url') }));
  let entered = false; instance.client = { handlePublishCallback() { entered = true; } };
  assert.match((await instance.published('#hashbin_publish=state')).error, /limit/); assert.equal(entered, false);
});
test('legacy tokens are revoked before removal through an explicit legacy store', async () => {
  const legacy = memory(); legacy.setItem('hashbin:tokens:id', 'old');
  const instance = store({ clientId: 'id', legacyStorage: legacy, loadSDK: async () => ({ HashBinClient: class {
    constructor(options) { this.storage = options.storage; }
    async disconnect() { assert.equal(this.storage.getItem('hashbin:tokens:id'), 'old'); this.storage.removeItem('hashbin:tokens:id'); }
  } }) });
  assert.equal(await instance.retireLegacyTokens(), true); assert.equal(legacy.getItem('hashbin:tokens:id'), null);
});
test('a late redirect callback cannot restore over a newer edit', async () => {
  let release, restored = false;
  const panel = { revision: 0, store: { published: () => new Promise(resolve => { release = resolve; }) },
    onLoad() { restored = true; }, status: { textContent: '' } };
  const pending = HashBinPanel.prototype.published.call(panel, '#hashbin_publish=state');
  panel.revision++; release({ snapshot: { src: 'old' }, error: 'cancelled' }); await pending;
  assert.equal(restored, false);
});
test('detached library and revision publishes need a prepared CID and keep the editor snapshot separate', async () => {
  let entered = false, options;
  const instance = store({ clientId: 'id', loadSDK: async () => ({ HashBinClient: class {
    publish(payload, opts) { entered = true; options = opts; return computeCID(payload).then(cid => ({ cid })); }
  } }) });
  await instance.init();
  const snapshot = { src: 'editor' }, payload = JSON.stringify({ format: 'fragment-kit-library', entries: [] }), cid = await computeCID(payload);
  await assert.rejects(instance.publish(payload, snapshot, { kind: 'library' }), /Prepare this save again/); assert.equal(entered, false);
  await assert.rejects(instance.publish(payload, snapshot, { kind: 'script', cid }), /Unknown/);
  const pending = instance.publish(payload, snapshot, { kind: 'library', cid, fileName: 'test-library.json', contentType: 'application/json' });
  assert.equal(entered, true);
  assert.deepEqual(await pending, { cid, kind: 'library' });
  assert.deepEqual(options.clientState, { kind: 'library', cid, snapshot }); assert.equal(options.fileName, 'test-library.json');
  const other = await computeCID(payload + ' ');
  await assert.rejects(instance.publish(payload, snapshot, { kind: 'revision', cid: other }), /does not match/);
  assert.deepEqual(await instance.publish(payload, null, { kind: 'revision', cid }), { cid, kind: 'revision' });
});
test('detached redirect callbacks verify the prepared CID and bytes, then restore the editor snapshot', async () => {
  const snapshot = { src: 'editor', test: { width: 800 } }, transactionStorage = memory(), instance = store({ clientId: 'id', transactionStorage });
  const payload = JSON.stringify({ format: 'fragment-kit-library', entries: ['x'.repeat(80)] }), cid = await computeCID(payload);
  const transaction = clientState => transactionStorage.setItem('hashbin:publish:id:state', JSON.stringify({ bytes: Buffer.from(payload).toString('base64url'), clientState, createdAt: Date.now() }));
  transaction({ kind: 'library', cid, snapshot });
  const done = await instance.published('#hashbin_publish=state&cid=' + cid);
  assert.deepEqual(done, { kind: 'library', cid, snapshot });
  transaction({ kind: 'library', cid, snapshot });
  const cancelled = await instance.published('#hashbin_publish=state&error=access_denied');
  assert.equal(cancelled.kind, 'library'); assert.match(cancelled.error, /cancelled/); assert.deepEqual(cancelled.snapshot, snapshot);
  instance.client = { handlePublishCallback: async () => ({ cid: await computeCID('other bytes that are long enough to be hashed by the CID function'), clientState: { kind: 'library', cid, snapshot } }) };
  const substituted = await instance.published('#hashbin_publish=state');
  assert.equal(substituted.kind, 'library'); assert.match(substituted.error, /does not match/); assert.deepEqual(substituted.snapshot, snapshot);
});
test('panel callbacks for detached publishes restore the editor URL and never record the CID as the document', async () => {
  const replaced = [], detached = [], loads = []; let saved = false;
  globalThis.history = { replaceState: (_, __, href) => replaced.push(href) }; globalThis.location = { href: 'https://test.hashbin.page/#hashbin_publish=state' };
  try {
    const panel = { revision: 0, status: { textContent: '' }, getFingerprint: () => 'f', onLoad: (doc, cid) => loads.push([doc.src, cid]), onSaved: () => { saved = true; }, onDetached: result => detached.push(result.cid),
      urlState: { build: doc => ({ href: 'https://test.hashbin.page/#v1.' + doc.src }), scrub: () => new URL('https://test.hashbin.page/') },
      store: { published: async () => ({ kind: 'library', cid: 'AAAAAAAA', snapshot: { src: 'editor' } }) } };
    await HashBinPanel.prototype.published.call(panel, '#hashbin_publish=state');
    assert.deepEqual(loads, [['editor', null]]); assert.deepEqual(replaced, ['https://test.hashbin.page/#v1.editor']);
    assert.deepEqual(detached, ['AAAAAAAA']); assert.equal(saved, false); assert.match(panel.status.textContent, /Library exported/);
  } finally { delete globalThis.history; delete globalThis.location; }
});
