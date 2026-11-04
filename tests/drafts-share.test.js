import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalDrafts, ShareClient } from '../src/index.js';
import { memory } from '../testing/fixtures/helpers.js';

test('explicit opens never restore or overwrite drafts; edits keep previous work recoverable', () => {
  const storage = memory(), drafts = new LocalDrafts({ storage, key: 'app:draft' });
  drafts.save({ src: 'old' }, true); drafts.opened(); drafts.save({ src: 'URL' });
  assert.deepEqual(drafts.list(), [{ src: 'old' }]);
  drafts.save({ src: 'new edit' }, true); assert.deepEqual(drafts.list(), [{ src: 'new edit' }, { src: 'old' }]);
  drafts.save({ src: 'another edit' }); assert.deepEqual(drafts.list(), [{ src: 'another edit' }, { src: 'old' }]);
});
test('quota errors preserve previous draft and malformed history is surfaced', () => {
  const storage = memory(); storage.setItem('app:draft', '{"src":"old"}');
  const drafts = new LocalDrafts({ storage: { ...storage, setItem() { throw Error('quota'); } }, key: 'app:draft' });
  assert.equal(drafts.attempt({ src: 'new' }, true), false); assert.equal(storage.getItem('app:draft'), '{"src":"old"}');
  storage.setItem('app:draft:history', '{}'); assert.throws(() => drafts.list(), /history/);
});
const links = { long: 'https://app.example/#source', fallback: 'https://app.example/#source' };
test('shortening accepts is.gd only and keeps exact provider error guidance', async () => {
  const client = contents => new ShareClient({ fetchLink: async () => new Response(JSON.stringify({ contents })) });
  assert.deepEqual(await client('https://is.gd/abc_12').shorten(links), { url: 'https://is.gd/abc_12', shortened: true });
  for (const url of ['https://is.gd.evil/abc', 'javascript:alert(1)', 'https://user@is.gd/abc', 'https://is.gd/abc?x=1']) {
    const result = await client(url).shorten(links); assert.equal(result.url, links.fallback); assert.equal(result.shortened, false);
  }
  const rate = await client('Error: rate limit exceeded').shorten(links); assert.match(rate.error.message, /Wait at least one minute/);
  const offline = await new ShareClient({ isOnline: () => false }).shorten(links); assert.match(offline.error.message, /You are offline/);
  const timeout = await new ShareClient({ timeout: 5, fetchLink: () => new Promise(() => {}) }).shorten(links); assert.equal(timeout.error.code, 'timeout');
});
test('cancelling or superseding shortening suppresses stale responses', async () => {
  let release;
  const client = new ShareClient({ fetchLink: () => new Promise(resolve => { release = resolve; }) });
  const pending = client.shorten(links); client.cancel(); assert.equal(await pending, null);
  release(new Response(JSON.stringify({ contents: 'https://is.gd/late' })));
});
