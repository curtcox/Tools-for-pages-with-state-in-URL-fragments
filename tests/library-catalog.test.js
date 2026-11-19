import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openLibrary, memoryBackend, createDocuments, computeCID, parseCatalog } from '../src/index.js';

const config = { slug: 'test-app', storagePrefix: 'test-app', maxBytes: 5 * 1024 * 1024 };
const type = { type: 'notes', normalize(value) { if (typeof value.src !== 'string' || value.src.includes('FORBIDDEN')) throw new Error('Invalid notes.'); return { src: value.src, theme: value.theme ?? 'paper' }; } };
let clock = Date.parse('2026-11-19T12:00:00Z');
const open = (options = {}) => openLibrary({ config, type, backend: memoryBackend(), channel: null, now: () => clock++, fetchSource: () => { throw new Error('offline'); }, ...options });
const long = text => `${text}\n${'body '.repeat(20)}`;
async function seeded() {
  const library = await open();
  const plan = await library.saveAs({ doc: { src: long('plan v1') }, name: 'Plan', description: 'Weekly plan' });
  const v2 = await library.save({ entry: plan.entry.id, doc: { src: long('plan v2') } });
  const branch = await library.save({ entry: plan.entry.id, doc: { src: long('plan branch') }, parent: plan.revision.id });
  const untitled = await library.saveAs({ doc: { src: long('Loose idea') } });
  return { library, plan, v2, branch, untitled };
}
const shape = async library => Promise.all((await library.entries()).map(async entry => ({ name: entry.name, description: entry.description, generated: entry.nameGenerated,
  history: await Promise.all((await library.history(entry.id)).map(async row => (await library.load(row.id)).doc.src.split('\n')[0] + (row.head ? ' (head)' : ''))) })));

test('self-contained exports round-trip names, descriptions, history and parent links into another location', async () => {
  const { library } = await seeded(), exported = await library.exportCatalog();
  assert.equal(exported.fileName, 'test-app-library.json');
  assert.equal(exported.inline, 4); assert.equal(exported.revisions, 4);
  const elsewhere = await open(), preview = await elsewhere.previewImport(exported.payload);
  assert.deepEqual(preview.entries.map(item => [item.name, item.status, item.revisions]), [['Plan', 'new', 3], ['Loose idea', 'new', 1]]);
  assert.deepEqual(await elsewhere.commitImport(preview), { entries: 2, revisions: 4, remote: 0 });
  assert.deepEqual(await shape(elsewhere), await shape(library));
  const history = await elsewhere.history((await elsewhere.entries()).find(entry => entry.name === 'Plan').id);
  const first = history.find(row => row.parent === null);
  assert.equal(history.filter(row => row.parent === first.id).length, 2, 'both later revisions descend from v1');
  assert.ok(history.every(row => row.kind === 'import'));
  const again = await library.previewImport(exported.payload);
  assert.deepEqual(again.entries.map(item => item.status), ['same', 'same']);
  assert.deepEqual(await library.commitImport(again), { entries: 0, revisions: 0, remote: 0 });
});

test('compact and references-only exports point at published contents that load on demand with verification', async () => {
  const { library, plan, v2 } = await seeded();
  await library.markPublished(plan.revision.cid); await library.markPublished(v2.revision.cid);
  const compact = await library.exportCatalog({ mode: 'compact' });
  assert.equal(compact.inline, 2);
  await assert.rejects(library.exportCatalog({ mode: 'references' }), error => error.code === 'unpublished' && error.missing.length === 2);
  const references = await library.exportCatalog({ mode: 'references', omitUnpublished: true });
  assert.deepEqual([references.entries, references.revisions, references.omitted.length], [1, 2, 2]);
  const catalog = JSON.parse(references.payload);
  assert.deepEqual(catalog.blobs, {});
  assert.equal(catalog.entries[0].head, v2.revision.id, 'the unpublished head falls back to the newest exported revision');
  const served = new Map([[plan.revision.cid, library.documents.serialize({ src: long('plan v1') })], [v2.revision.cid, library.documents.serialize({ src: long('plan v2') })]]);
  const requests = [];
  const fetchSource = async (url, options) => { requests.push([url, options.credentials]); const cid = url.split('/').pop(); return new Response(cid === v2.revision.cid ? served.get(cid).replace('v2', 'XX') : served.get(cid)); };
  const elsewhere = await open({ fetchSource }), preview = await elsewhere.previewImport(compact.payload);
  assert.equal(preview.entries[0].remote, 2);
  await elsewhere.commitImport(preview);
  const imported = await elsewhere.history((await elsewhere.entries()).find(entry => entry.name === 'Plan').id);
  const remote = imported.filter(row => row.publishedAt);
  assert.equal(remote.length, 2);
  assert.match((await elsewhere.load(remote.find(row => row.cid === plan.revision.cid).id)).doc.src, /^plan v1/);
  assert.deepEqual(requests[0], [`https://256t.us/${plan.revision.cid}`, 'omit']);
  await assert.rejects(elsewhere.load(remote.find(row => row.cid === v2.revision.cid).id), error => error.code === 'missing' && /does not match/.test(error.message));
  assert.equal((await elsewhere.usage()).missing, 1);
  assert.deepEqual((await elsewhere.fetchMissing()).failed.length, 1);
  await assert.rejects(elsewhere.exportCatalog(), error => error.code === 'unavailable');
});

test('conflicting names require a decision; merge, copy and skip never lose local work', async () => {
  const { library } = await seeded(), payload = (await library.exportCatalog()).payload;
  for (const [choice, check] of [
    ['merge-local', async (target, entry) => { assert.match((await target.load(entry.head)).doc.src, /^mine/); assert.equal((await target.history(entry.id)).length, 4); }],
    ['merge-imported', async (target, entry) => { assert.match((await target.load(entry.head)).doc.src, /^plan branch/); assert.equal((await target.history(entry.id)).length, 4); assert.equal(entry.description, 'Weekly plan'); }],
    ['copy', async target => { assert.deepEqual((await target.entries()).map(entry => entry.name).sort(), ['Loose idea', 'Plan (imported)', 'plan']); }],
    ['skip', async target => { assert.equal((await target.entries()).length, 2); }],
  ]) {
    const target = await open();
    const mine = await target.saveAs({ doc: { src: long('mine') }, name: 'plan' });
    const preview = await target.previewImport(payload);
    assert.equal(preview.entries[0].status, 'conflict'); assert.equal(preview.entries[0].local.id, mine.entry.id);
    await assert.rejects(target.commitImport(preview), error => error.code === 'decision');
    await assert.rejects(target.commitImport(preview, { 0: 'import' }), /not available/);
    await target.commitImport(preview, { 0: choice });
    await check(target, await target.entry(mine.entry.id));
    assert.match((await target.load((await target.entry(mine.entry.id)).head)).doc.src, choice === 'merge-imported' ? /^plan branch/ : /^mine/);
  }
});

test('imports are atomic when the library changes after preview', async () => {
  const { library } = await seeded(), target = await open();
  const preview = await target.previewImport((await library.exportCatalog()).payload);
  await target.saveAs({ doc: { src: 'raced' }, name: 'Loose idea' });
  await assert.rejects(target.commitImport(preview), error => error.code === 'exists');
  assert.deepEqual((await target.entries()).map(entry => entry.name), ['Loose idea']);
  await assert.rejects(target.commitImport({ entries: [] }), /Preview the import again/);
});

test('import validation is strict and bounded before any write', async () => {
  const { library } = await seeded(), good = JSON.parse((await library.exportCatalog()).payload), target = await open();
  const attempt = async (change, pattern) => {
    const value = structuredClone(good); change(value);
    await assert.rejects(target.previewImport(typeof value === 'string' ? value : JSON.stringify(value)), pattern);
  };
  const [cid] = Object.keys(good.blobs), revisions = good.entries[0].revisions;
  await attempt(value => { value.type = 'sheets'; }, /for sheets, not notes/);
  await attempt(value => { value.version = 2; }, /unsupported version/);
  await attempt(value => { value.extra = 1; }, /unknown field/);
  await attempt(value => { value.entries[0].revisions[0].script = 'x'; }, /unknown field/);
  await attempt(value => { value.blobs[cid] = value.blobs[cid].replace('plan', 'PLAN'); }, /do not match their CIDs/);
  await attempt(value => { value.entries[0].revisions[0].parent = revisions[2].id; }, /cycle/);
  await attempt(value => { value.entries[0].revisions[1].parent = 'nope'; }, /unknown parent/);
  await attempt(value => { value.entries[0].head = 'nope'; }, /unknown current revision/);
  await attempt(value => { value.entries[1].name = 'PLAN'; }, /repeats/);
  await attempt(value => { value.entries[0].revisions[1].id = revisions[0].id; }, /repeated revision id/);
  await attempt(value => { value.entries[0].created = 'yesterday'; }, /invalid date/);
  await attempt(value => { delete value.blobs[cid]; }, /missing contents/);
  await attempt(value => { value.entries[0].name = 'n'.repeat(500); }, /at most 120/);
  await attempt(value => { value.blobs.__proto__x = 'x'; }, /contents are malformed/);
  const forbidden = createDocuments({ type: 'notes', normalize: value => ({ src: value.src }) }).serialize({ src: 'FORBIDDEN' }), forbiddenCID = await computeCID(forbidden);
  await attempt(value => { value.blobs[forbiddenCID] = forbidden; value.entries[0].revisions[0].cid = forbiddenCID; delete value.blobs[revisions[0].cid]; }, /cannot open: Invalid notes/);
  await assert.rejects(target.previewImport('{"__proto__":{"format":"fragment-kit-library"}}'), /not a Fragment Kit library export/);
  await assert.rejects(target.previewImport('x'.repeat(config.maxBytes + 1)), error => error.code === 'too-large');
  const spoofed = structuredClone(good); spoofed.entries[0].name = 'Pl\u202ean\u200b';
  const preview = await target.previewImport(JSON.stringify(spoofed));
  assert.equal(preview.entries[0].name, 'Plan');
  assert.equal(parseCatalog(JSON.stringify(good), { type, maxBytes: config.maxBytes }).entries.length, 2);
  assert.equal((await target.entries()).length, 0);
});

test('oversized exports fail with a per-document breakdown', async () => {
  const small = await open({ config: { ...config, maxBytes: 1500 } });
  await small.saveAs({ doc: { src: 'a'.repeat(600) }, name: 'Big' });
  await small.saveAs({ doc: { src: 'b'.repeat(600) }, name: 'Bigger' });
  await assert.rejects(small.exportCatalog(), error => error.code === 'too-large' && error.breakdown.length === 2 && error.breakdown.every(row => row.bytes > 600));
});

test('documents never open a library export as source text', () => {
  const documents = createDocuments(type);
  assert.throws(() => documents.parse(JSON.stringify({ format: 'fragment-kit-library', version: 1, type: 'notes', entries: [], blobs: {} })), /library export\. Import it from Library/);
});
