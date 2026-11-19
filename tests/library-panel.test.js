import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openLibrary, memoryBackend, LibraryPanel, computeCID } from '../src/index.js';

const config = { storagePrefix: 'test-app', maxBytes: 5 * 1024 * 1024 };
const type = { type: 'notes', normalize: value => ({ src: String(value.src), theme: value.theme ?? 'paper' }) };
const open = (options = {}) => openLibrary({ config, type, backend: options.backend ?? memoryBackend(), channel: null, now: () => Date.now(), ...options });
const panel = (library, { snapshot = { src: 'x' }, ...rest } = {}) => {
  const ui = new LibraryPanel({ library, urlState: {}, getSnapshot: () => snapshot, onLoad: () => {}, document: undefined, ...rest });
  ui.statusEl = { textContent: '' };
  return ui;
};

test('an explicit URL load is recorded, bound to a matching revision and never blocks', async () => {
  const library = await open();
  const { entry, revision } = await library.saveAs({ doc: { src: 'linked' }, name: 'Doc' });
  const ui = panel(library, { snapshot: { src: 'linked' } });
  await ui.opened({ src: 'linked' }, { kind: 'cid', source: revision.cid });
  assert.equal(ui.bound.id, entry.id); assert.equal(ui.basedOn, revision.id);
  assert.match(ui.statusEl.textContent, /“Doc”/);
  assert.equal((await library.recent()).length, 1);
  await ui.opened({ src: 'other' }, { kind: 'link' });
  assert.equal(ui.bound, null);
});

test('save appends to the bound entry, reports unchanged work and branches on conflict', async () => {
  const library = await open();
  const { entry } = await library.saveAs({ doc: { src: 'v1' }, name: 'Doc' });
  let snapshot = { src: 'v2' };
  const ui = panel(library, { snapshot, getFingerprint: () => JSON.stringify(snapshot) });
  const stale = { id: entry.id, head: entry.head, name: entry.name };
  ui.bound = stale; ui.basedOn = entry.head;
  await ui.save();
  const second = (await library.entry(entry.id)).head;
  assert.notEqual(second, entry.head); assert.equal(ui.bound.head, second);
  assert.match(ui.statusEl.textContent, /Saved to “Doc”/);
  await ui.save();
  assert.equal((await library.history(entry.id)).length, 2);
  assert.match(ui.statusEl.textContent, /Already saved/);
  // Another tab moves the head; the user chooses Save anyway.
  await library.save({ entry: entry.id, doc: { src: 'elsewhere' } });
  ui.choose = async () => 'save';
  await ui.save();
  const rows = await library.history(entry.id);
  assert.equal(rows.length, 4);
  const head = rows.find(row => row.head);
  assert.equal(head.parent, second, 'the moved head stays a sibling branch');
});

test('bound-entry status tracks the editor fingerprint', async () => {
  const library = await open();
  const { entry } = await library.saveAs({ doc: { src: 'v1' }, name: 'Doc' });
  let fingerprint = 'same';
  const ui = panel(library, { getFingerprint: () => fingerprint });
  ui.bound = { id: entry.id, head: entry.head, name: 'Doc' };
  ui.saved = 'same'; ui.refreshStatus();
  assert.match(ui.statusEl.textContent, /Library: “Doc”/);
  fingerprint = 'changed'; ui.changed();
  assert.match(ui.statusEl.textContent, /Unsaved changes to “Doc”/);
  ui.bound = null; ui.refreshStatus();
  assert.equal(ui.statusEl.textContent, '');
});

test('detached publish results mark revisions and report exports', async () => {
  const library = await open();
  const { revision } = await library.saveAs({ doc: { src: 'publish me' } });
  const ui = panel(library);
  await ui.published({ kind: 'revision', cid: revision.cid });
  assert.ok((await library.load(revision.id)).revision.publishedAt);
  assert.match(ui.statusEl.textContent, /Revision saved to HashBin/);
  await ui.published({ kind: 'library', cid: await computeCID('catalog') });
  assert.match(ui.statusEl.textContent, /Library exported to HashBin/);
  await ui.published({ error: 'The save was cancelled on HashBin.' });
  assert.match(ui.statusEl.textContent, /cancelled/);
});

test('loading a revision binds it and passes it through onLoad', async () => {
  const library = await open();
  const { entry, revision: one } = await library.saveAs({ doc: { src: 'old' }, name: 'Doc' });
  await library.save({ entry: entry.id, doc: { src: 'new' } });
  const seen = [];
  const ui = new LibraryPanel({ library, urlState: {}, getSnapshot: () => ({ src: 'old' }),
    getFingerprint: () => 'fp', onLoad: (doc, context) => seen.push([doc.src, context.revision.id]), document: undefined });
  ui.statusEl = { textContent: '' };
  await ui.load(one.id);
  assert.deepEqual(seen, [['old', one.id]]);
  assert.equal(ui.bound.id, entry.id); assert.equal(ui.basedOn, one.id);
  // Saving after loading an old revision branches from it.
  await ui.save();
  const head = (await library.history(entry.id)).find(row => row.head);
  assert.equal(head.parent, one.id);
});
