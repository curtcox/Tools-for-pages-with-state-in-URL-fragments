import { bytes } from '../core/bytes.js';
import { computeCID, isCID } from '../core/cid.js';
import { createDocuments } from '../core/envelope.js';
import { LibraryError, indexedDBBackend } from './backends.js';

export { LibraryError };
export const LIBRARY_LIMITS = Object.freeze({ name: 120, description: 4000, generatedName: 60, recent: 50 });
export const LIBRARY_SCHEMA = Object.freeze({ version: 1, stores: {
  entries: { key: 'id', indexes: { nameKey: { path: 'nameKey', unique: true } } },
  revisions: { key: 'id', indexes: { entry: { path: 'entry' }, cid: { path: 'cid' } } },
  blobs: { key: 'cid' },
  recent: { key: 'id', indexes: { cid: { path: 'cid' } } },
} });
const ALL = Object.keys(LIBRARY_SCHEMA.stores);
// Control, zero-width and bidirectional override characters can disguise imported names.
const HIDDEN = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u2064\u2066-\u2069\ufeff]/g;
const length = value => [...value].length;

export function cleanName(value) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new LibraryError('invalid', 'Names must be text.');
  const name = value.normalize('NFC').replace(/[\t\n\r]/g, ' ').replace(HIDDEN, '').replace(/\s+/g, ' ').trim();
  if (length(name) > LIBRARY_LIMITS.name) throw new LibraryError('invalid', `Names can be at most ${LIBRARY_LIMITS.name} characters.`);
  return name;
}
export function cleanDescription(value) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new LibraryError('invalid', 'Descriptions must be text.');
  const description = value.normalize('NFC').replace(/\r\n?/g, '\n').replace(HIDDEN, '').trim();
  if (length(description) > LIBRARY_LIMITS.description) throw new LibraryError('invalid', `Descriptions can be at most ${LIBRARY_LIMITS.description} characters.`);
  return description;
}
export const nameKey = name => name.normalize('NFC').toLowerCase();
export function suggestName(doc, describe = value => value.src) {
  let summary = '';
  try { summary = String(describe(doc) ?? ''); } catch { /* fall back to Untitled */ }
  const line = summary.split('\n').map(text => text.normalize('NFC').replace(HIDDEN, '').replace(/\s+/g, ' ').trim()).find(Boolean) ?? '';
  return [...line].slice(0, LIBRARY_LIMITS.generatedName).join('').trim() || 'Untitled';
}
const publicEntry = entry => { const { nameKey: _, ...rest } = entry; return rest; };
const newest = (a, b) => (b.savedAt ?? b.openedAt).localeCompare(a.savedAt ?? a.openedAt) || b.id.localeCompare(a.id);

function translate(error) {
  if (error instanceof LibraryError) return error;
  if (error?.name === 'QuotaExceededError') return new LibraryError('quota', 'This browser is out of space for the library. Export or delete older revisions, then try again.');
  return new LibraryError('storage', `The local library could not be updated (${error?.name ?? 'Error'}).`);
}

export async function openLibrary({ config, type, backend, describe = doc => doc.src, now = () => Date.now(), id = () => crypto.randomUUID(), channel, storageManager = globalThis.navigator?.storage }) {
  const documents = createDocuments(type, config.maxBytes), prefix = config.storagePrefix;
  const db = await (backend ?? indexedDBBackend({ name: `${prefix}:library` })).open(LIBRARY_SCHEMA);
  const listeners = new Set();
  const broadcast = channel !== undefined ? channel : typeof BroadcastChannel === 'function' ? new BroadcastChannel(`${prefix}:library`) : null;
  const notify = () => { for (const listener of listeners) { try { listener(); } catch { /* listeners own their errors */ } } };
  if (broadcast) broadcast.onmessage = notify;
  let last = 0;
  const clock = () => { last = Math.max(now(), last + 1); return new Date(last).toISOString(); };
  const read = (stores, work) => db.transaction(stores, 'readonly', work).catch(error => { throw translate(error); });
  async function write(stores, work) {
    let result;
    try { result = await db.transaction(stores, 'readwrite', work); } catch (error) { throw translate(error); }
    notify(); try { broadcast?.postMessage('changed'); } catch { /* other tabs refresh on focus */ }
    return result;
  }
  async function prepare(doc) {
    const text = documents.serialize(doc);
    return { text, cid: await computeCID(text), size: bytes(text).length, doc: documents.parse(text) };
  }
  async function storeBlob(ops, item) { if (!await ops.get('blobs', item.cid)) await ops.put('blobs', { cid: item.cid, text: item.text, size: item.size }); }
  async function addRevision(ops, entry, item, parent, kind) {
    await storeBlob(ops, item);
    const revision = { id: id(), entry: entry.id, cid: item.cid, parent: parent ?? null, savedAt: clock(), kind, size: item.size };
    await ops.put('revisions', revision);
    Object.assign(entry, { head: revision.id, updated: revision.savedAt }); await ops.put('entries', entry);
    return revision;
  }
  async function freeName(ops, base, except) {
    for (let n = 1; ; n++) {
      const candidate = n === 1 ? base : `${base} ${n}`, [row] = await ops.index('entries', 'nameKey', nameKey(candidate));
      if (!row || row.id === except) return candidate;
    }
  }
  async function claim(ops, name, except) {
    const [existing] = await ops.index('entries', 'nameKey', nameKey(name));
    if (existing && existing.id !== except) throw new LibraryError('exists', `“${existing.name}” already exists.`, { entry: publicEntry(existing) });
  }
  async function collect(ops, cids) {
    for (const cid of new Set(cids)) {
      if (!(await ops.index('revisions', 'cid', cid)).length && !(await ops.index('recent', 'cid', cid)).length) await ops.delete('blobs', cid);
    }
  }
  async function matches(ops, cid) {
    const revisions = (await ops.index('revisions', 'cid', cid)).sort(newest), result = [];
    for (const revision of revisions) { const entry = await ops.get('entries', revision.entry); if (entry) result.push({ entry: publicEntry(entry), revision }); }
    return result;
  }
  async function contents(cid) {
    const blob = await read(['blobs'], ops => ops.get('blobs', cid));
    if (!blob) throw new LibraryError('missing', 'This revision is not stored in this browser.', { cid });
    if (await computeCID(blob.text) !== cid) throw new LibraryError('damaged', 'This stored revision is damaged and cannot be opened.', { cid });
    return documents.parse(blob.text);
  }

  return Object.freeze({
    documents, describe,
    async entries() {
      return read(['entries', 'revisions'], async ops => {
        const counts = new Map();
        for (const revision of await ops.all('revisions')) counts.set(revision.entry, (counts.get(revision.entry) ?? 0) + 1);
        return (await ops.all('entries')).map(entry => ({ ...publicEntry(entry), count: counts.get(entry.id) ?? 0 }))
          .sort((a, b) => b.updated.localeCompare(a.updated) || a.name.localeCompare(b.name));
      });
    },
    async entry(entryId) { const entry = await read(['entries'], ops => ops.get('entries', entryId)); return entry ? publicEntry(entry) : null; },
    async history(entryId) {
      return read(['entries', 'revisions'], async ops => {
        const entry = await ops.get('entries', entryId);
        if (!entry) throw new LibraryError('missing', 'This saved document no longer exists in this browser.');
        return (await ops.index('revisions', 'entry', entryId)).sort(newest).map(revision => ({ ...revision, head: revision.id === entry.head }));
      });
    },
    async load(revisionId) {
      const found = await read(['entries', 'revisions'], async ops => {
        const revision = await ops.get('revisions', revisionId);
        return revision && { revision, entry: await ops.get('entries', revision.entry) };
      });
      if (!found?.entry) throw new LibraryError('missing', 'This revision no longer exists in this browser.');
      return { doc: await contents(found.revision.cid), revision: found.revision, entry: publicEntry(found.entry) };
    },
    async save({ doc, entry: entryId, parent, expectedHead }) {
      const item = await prepare(doc);
      return write(['entries', 'revisions', 'blobs'], async ops => {
        const entry = await ops.get('entries', entryId);
        if (!entry) throw new LibraryError('missing', 'This saved document no longer exists in this browser.');
        if (expectedHead !== undefined && entry.head !== expectedHead) throw new LibraryError('conflict', `“${entry.name}” was saved again elsewhere since you opened it.`, { entry: publicEntry(entry) });
        const head = await ops.get('revisions', entry.head);
        if (head?.cid === item.cid) return { entry: publicEntry(entry), revision: head, unchanged: true };
        const revision = await addRevision(ops, entry, item, parent === undefined ? entry.head : parent, 'save');
        return { entry: publicEntry(entry), revision, unchanged: false };
      });
    },
    async saveAs({ doc, name, description, parent = null }) {
      const item = await prepare(doc), wanted = cleanName(name), text = cleanDescription(description);
      return write(['entries', 'revisions', 'blobs'], async ops => {
        if (wanted) await claim(ops, wanted);
        const final = wanted || await freeName(ops, suggestName(item.doc, describe)), at = clock();
        const entry = { id: id(), name: final, nameKey: nameKey(final), nameGenerated: !wanted, description: text, created: at, updated: at, head: null };
        const revision = await addRevision(ops, entry, item, parent, 'save');
        return { entry: publicEntry(entry), revision };
      });
    },
    async update(entryId, { name, description } = {}) {
      const wanted = name === undefined ? undefined : cleanName(name), text = description === undefined ? undefined : cleanDescription(description);
      return write(['entries', 'revisions', 'blobs'], async ops => {
        const entry = await ops.get('entries', entryId);
        if (!entry) throw new LibraryError('missing', 'This saved document no longer exists in this browser.');
        if (wanted) { await claim(ops, wanted, entry.id); Object.assign(entry, { name: wanted, nameGenerated: false }); }
        else if (wanted === '') {
          const head = await ops.get('revisions', entry.head), blob = head && await ops.get('blobs', head.cid);
          let doc = null; try { doc = blob && documents.parse(blob.text); } catch { /* name from fallback */ }
          Object.assign(entry, { name: await freeName(ops, doc ? suggestName(doc, describe) : 'Untitled', entry.id), nameGenerated: true });
        }
        entry.nameKey = nameKey(entry.name);
        if (text !== undefined) entry.description = text;
        await ops.put('entries', entry); return publicEntry(entry);
      });
    },
    async remove(entryId) {
      return write(ALL, async ops => {
        const revisions = await ops.index('revisions', 'entry', entryId);
        for (const revision of revisions) await ops.delete('revisions', revision.id);
        await ops.delete('entries', entryId); await collect(ops, revisions.map(revision => revision.cid));
      });
    },
    async removeRevision(revisionId) {
      return write(ALL, async ops => {
        const revision = await ops.get('revisions', revisionId);
        if (!revision) return;
        const entry = await ops.get('entries', revision.entry);
        if (entry?.head === revisionId) throw new LibraryError('invalid', 'The current revision cannot be deleted. Save a newer revision or delete the whole document.');
        for (const child of (await ops.all('revisions')).filter(row => row.parent === revisionId)) await ops.put('revisions', { ...child, parent: revision.parent });
        await ops.delete('revisions', revisionId); await collect(ops, [revision.cid]);
      });
    },
    async record(doc, { kind = 'link', cid: source } = {}) {
      const item = await prepare(doc);
      return write(ALL, async ops => {
        await storeBlob(ops, item);
        for (const old of await ops.index('recent', 'cid', item.cid)) await ops.delete('recent', old.id);
        await ops.put('recent', { id: id(), cid: item.cid, kind, source: isCID(source) ? source : null, openedAt: clock() });
        const expired = (await ops.all('recent')).sort(newest).slice(LIBRARY_LIMITS.recent);
        for (const old of expired) await ops.delete('recent', old.id);
        await collect(ops, expired.map(old => old.cid));
        return { cid: item.cid, matches: await matches(ops, item.cid) };
      });
    },
    async recent() {
      return read(ALL, async ops => {
        const rows = (await ops.all('recent')).sort(newest), result = [];
        for (const row of rows) result.push({ ...row, matches: await matches(ops, row.cid) });
        return result;
      });
    },
    async openRecent(recentId) {
      const row = await read(['recent'], ops => ops.get('recent', recentId));
      if (!row) throw new LibraryError('missing', 'This recently opened document is no longer stored.');
      return { doc: await contents(row.cid), recent: row };
    },
    async clearRecent() {
      return write(ALL, async ops => {
        const rows = await ops.all('recent');
        for (const row of rows) await ops.delete('recent', row.id);
        await collect(ops, rows.map(row => row.cid));
      });
    },
    async match(value) {
      const cid = typeof value === 'string' ? value : (await prepare(value)).cid;
      return read(['entries', 'revisions'], ops => matches(ops, cid));
    },
    async cid(doc) { return (await prepare(doc)).cid; },
    async markPublished(cid) {
      if (!isCID(cid)) throw new LibraryError('invalid', 'HashBin returned an invalid CID.');
      return write(['revisions', 'blobs'], async ops => {
        const at = clock(), blob = await ops.get('blobs', cid);
        if (blob && !blob.publishedAt) await ops.put('blobs', { ...blob, publishedAt: at });
        const revisions = await ops.index('revisions', 'cid', cid);
        for (const revision of revisions) if (!revision.publishedAt) await ops.put('revisions', { ...revision, publishedAt: at });
        return revisions.length;
      });
    },
    async usage() {
      const counts = await read(ALL, async ops => {
        const blobs = await ops.all('blobs');
        return { entries: (await ops.all('entries')).length, revisions: (await ops.all('revisions')).length, recent: (await ops.all('recent')).length,
          blobs: blobs.length, bytes: blobs.reduce((total, blob) => total + blob.size, 0) };
      });
      let quota = null, persisted = null;
      try { quota = (await storageManager?.estimate?.())?.quota ?? null; persisted = (await storageManager?.persisted?.()) ?? null; } catch { /* unsupported */ }
      return { ...counts, quota, persisted };
    },
    async persist() {
      if (typeof storageManager?.persist !== 'function') return false;
      try { return await storageManager.persist(); } catch { return false; }
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    close() { listeners.clear(); if (broadcast) { broadcast.onmessage = null; broadcast.close?.(); } db.close(); },
  });
}
