import { createShell, mountMobileTabs, createStorage, LocalDrafts, RenderScheduler, HashBinStore,
  HashBinPanel, createShareDialog, createQrDialog, OfflineClient, download, element } from './vendor/fragment-kit-v0.1.0/src/index.js';
import { config, type, urlState } from './config.js';
import { examples } from './examples.js';

const source = document.getElementById('source'), theme = document.getElementById('theme');
const preview = document.getElementById('note-preview'), status = document.getElementById('app-status');
const snapshot = () => type.normalize({ src: source.value, notes: { theme: theme.value } });
const fingerprint = () => JSON.stringify(snapshot());
let savedQR = null, pendingQrSave = false;
const shell = createShell({ config, actions: [
  { label: 'Share', id: 'share-open', onClick: () => share.open() },
  { label: 'QR code', id: 'qr-open', onClick: () => qr.open(savedQR?.fingerprint === fingerprint() ? savedQR.href : urlState.build(snapshot()).href) },
  { label: 'Download', extra: true, onClick: () => download(new Blob([urlState.documents.serialize(snapshot())], { type: 'application/json' }), 'notes.json') },
] });
const drafts = new LocalDrafts({ storage: createStorage({ prefix: config.storagePrefix }), key: 'document' });
const scheduler = new RenderScheduler({ delay: 80, render: doc => doc, onResult: doc => {
  preview.textContent = doc.src; preview.dataset.theme = doc.notes.theme;
  document.getElementById('word-count').textContent = `${doc.src.trim() ? doc.src.trim().split(/\s+/).length : 0} words`;
} });
let loadRevision = 0, lastNavigationEvent = location.href;
function apply(doc, cid) {
  const value = type.normalize(doc);
  source.value = value.src; theme.value = value.notes.theme;
  scheduler.schedule(value, {}, true); drafts.opened();
  if (cid) {
    const href = urlState.link(location.href, cid);
    history.replaceState(null, '', href); savedQR = { fingerprint: fingerprint(), href };
  }
}
const store = new HashBinStore({ config, type });
const hashbin = new HashBinPanel({ store, urlState, getSnapshot: snapshot, getFingerprint: fingerprint, container: shell.drawer.body,
  onLoad: (doc, cid) => { ++loadRevision; urlState.cancel(); apply(doc, cid); },
  onSaved: (cid, fingerprint, href) => {
    urlState.cancel();
    history.replaceState(null, '', href); savedQR = { fingerprint, href }; qr.setLink(href);
    if (pendingQrSave) { pendingQrSave = false; hashbin.dialog.close(); qr.open(href); }
  } });
const share = createShareDialog({ urlState, getSnapshot: snapshot, onSave: () => hashbin.openSave() });
const qr = createQrDialog({ config, urlState, onLoad: outcome => outcome.kind === 'cid' ? hashbin.load(outcome.cid) : navigate(outcome.href),
  onSave: () => { pendingQrSave = true; qr.dialog.close(); void hashbin.openSave(); } });
hashbin.dialog.addEventListener('close', () => { pendingQrSave = false; });
drafts.mount(shell.drawer.body, doc => { ++loadRevision; hashbin.cancelLoad(); urlState.cancel(); apply(doc); history.replaceState(null, '', urlState.build(doc).href); status.textContent = 'Saved work restored.'; });
function changed() {
  lastNavigationEvent = null;
  ++loadRevision; hashbin.cancelLoad();
  const doc = snapshot(); scheduler.schedule(doc); urlState.write(doc);
  const saved = drafts.attempt(doc, true); shell.draftStatus.textContent = saved ? 'Draft saved on this device' : 'Draft could not be saved';
}
source.addEventListener('input', changed); theme.addEventListener('change', changed);
async function navigate(href = location.href) {
  const revision = ++loadRevision; urlState.cancel(); hashbin.cancelLoad(); scheduler.cancel();
  status.textContent = '';
  try {
    const intent = urlState.parse(href);
    if (intent.kind === 'publish') {
      const result = await hashbin.published(intent.hash);
      if (result?.snapshot && result.error) history.replaceState(null, '', urlState.build(result.snapshot).href);
      return;
    }
    let doc;
    if (intent.kind === 'cid') doc = await store.load(intent.cid);
    else if (intent.kind === 'example') {
      const example = examples.find(value => value.id === intent.id);
      if (!example) throw new Error('This example could not be found.');
      doc = example.document;
    } else doc = intent.doc ?? examples[0].document;
    if (revision !== loadRevision) return;
    apply(doc, intent.kind === 'cid' ? intent.cid : null);
    if (intent.kind === 'example') history.replaceState(null, '', urlState.build(doc, { run: intent.run }).href);
    else if (href !== location.href) {
      const incoming = new URL(href), here = new URL(location.href);
      // Canonical/recovery QR links load in place even on the other deployment.
      here.search = incoming.search; here.hash = incoming.hash;
      history.replaceState(null, '', here.href);
    }
  } catch (error) { if (revision === loadRevision) status.textContent = error.message; }
}
mountMobileTabs({ panels: [{ label: 'Write', panel: document.getElementById('editor-panel') }, { label: 'Read', panel: document.getElementById('preview-panel') }], container: document.getElementById('workspace') });
const offline = new OfflineClient({ onStatus: result => { shell.offlineStatus.textContent = result.ready ? 'Available offline' : result.unsupported ? 'Offline setup unavailable in this browser' : result.error ?? 'Offline copy incomplete'; }, onUpdate: () => { update.hidden = false; } });
const repair = element('button', 'Repair offline copy', { type: 'button', id: 'offline-repair' });
repair.onclick = () => offline.repair().catch(error => { status.textContent = error.message; });
const update = element('button', 'Update and reload', { type: 'button', id: 'offline-update' }); update.hidden = true;
update.onclick = () => { drafts.attempt(snapshot()); navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true }); offline.activateUpdate(); };
shell.drawer.body.append(repair, update);
function navigateFromEvent(event) {
  // WebKit emits both popstate and hashchange for a fragment navigation. Consume
  // a one-use Publish callback once, and ignore events for URLs already replaced.
  if (event.type === 'hashchange' && event.newURL !== location.href) return;
  if (lastNavigationEvent === location.href) return;
  lastNavigationEvent = location.href;
  void navigate();
}
window.addEventListener('hashchange', navigateFromEvent);
window.addEventListener('popstate', navigateFromEvent);
await navigate();
document.body.dataset.ready = 'true';
void offline.init().catch(error => { shell.offlineStatus.textContent = error.message; });
