import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { installGlobals } from '../src/globals.js';
import { config, type } from '../testing/fixtures/helpers.js';
test('legacy globals keep document identity, run flags and app-scoped store defaults', () => {
  const target = {}; installGlobals({ config, type }, target);
  const links = target.ShareLinks.build({ url: config.recoveryOrigin, code: 'old global caller', run: false });
  const parsed = target.ShareLinks.parse(links.href);
  assert.equal(parsed.src, 'old global caller'); assert.equal(parsed.run, false);
  assert.equal(target.ShareLinks.parse(config.recoveryOrigin), null);
  assert.equal(new target.HashBinStore().config.storagePrefix, config.storagePrefix);
  assert.equal(target.HashBinDocuments.parse(target.HashBinDocuments.serialize({ src: 'hello' })).src, 'hello');
  for (const name of ['encodeQr', 'qrSvg', 'LocalDrafts', 'ShareClient', 'RenderScheduler']) assert.equal(typeof target[name], 'function');
});
test('Node CommonJS consumers can require the synchronous ESM entry point', () => {
  const require = createRequire(import.meta.url);
  assert.equal(typeof require('../src/index.js').createUrlState, 'function');
});
