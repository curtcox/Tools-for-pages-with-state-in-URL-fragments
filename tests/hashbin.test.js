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
