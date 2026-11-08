import { element } from '../../ui/dialog.js';
import { createChangeRequests } from '../change/propose.js';
import { pasteHandoff } from '../connections/paste.js';
export function createAskPanel({ ai, type, getSnapshot, getFingerprint, onApply, urlState, container, document = globalThis.document }) {
  if (!ai) return null;
  const panel = container ?? element('section', null, { className: 'fk-ai-panel', id: 'ask-panel' }, document); panel.classList.add('fk-ai-panel');
  const change = createChangeRequests({ ai, type, getSnapshot, getFingerprint, onApply, urlState });
  const request = element('textarea', null, { 'aria-label': 'Describe a change', placeholder: 'Describe a change…', rows: '3' }, document);
  const picker = element('select', null, { 'aria-label': 'Change model' }, document);
  const destination = element('p', '', { className: 'fk-ai-destination' }, document);
  const cost = element('input', null, { type: 'number', min: '0', step: '0.01', value: '0', 'aria-label': 'Maximum cost for unknown price (USD)' }, document);
  const consentLabel = element('label', '', {}, document), consent = element('input', null, { type: 'checkbox', 'aria-label': 'Allow sending this document' }, document);
  consentLabel.append(consent, document.createTextNode(' Allow sending this document to the destination above.'));
  const send = element('button', 'Send request', { type: 'button', id: 'ai-send' }, document);
  const cancel = element('button', 'Cancel', { type: 'button' }, document);
  const status = element('p', 'Describe a change, then review it before accepting.', { role: 'status', 'data-fk-primary-status': '' }, document);
  const stream = element('pre', '', { className: 'fk-ai-stream', 'aria-live': 'off' }, document); stream.hidden = true;
  const disclosure = element('details', null, {}, document), promptText = element('pre', '', {}, document);
  disclosure.append(element('summary', 'What will be sent', {}, document), promptText);
  const paste = element('div', null, { className: 'fk-ai-paste' }, document), copy = element('button', 'Copy prompt', { type: 'button' }, document), open = element('button', 'Open chat', { type: 'button' }, document);
  const reply = element('textarea', null, { 'aria-label': 'Paste model reply', placeholder: 'Paste the JSON reply from your chat', rows: '5' }, document), review = element('button', 'Review pasted reply', { type: 'button' }, document);
  paste.append(copy, open, reply, review);
  const summary = element('p', '', {}, document), diff = element('pre', '', { className: 'fk-ai-diff', 'aria-label': 'Proposed changes' }, document);
  const accept = element('button', 'Accept change', { type: 'button', id: 'ai-accept' }, document), reject = element('button', 'Reject', { type: 'button' }, document), refine = element('button', 'Refine', { type: 'button' }, document), undo = element('button', 'Undo AI change', { type: 'button' }, document);
  const reviewArea = element('div', null, {}, document); reviewArea.hidden = true; reviewArea.append(summary, diff, accept, refine, reject);
  let proposal, session, handoff, models = [], busy = false, generation = 0;
  const selected = () => models.find(m => m.ref === picker.value);
  function outcome(error) { status.textContent = error.message; }
  function refreshDestination() {
    consent.checked = false;
    const model = selected();
    let estimate = 'unknown price; confirm the maximum cost below';
    try { estimate = `$${ai.estimate({ model: model.ref, messages: [{ role: 'user', content: JSON.stringify(getSnapshot()) + request.value }], maxTokens: 2048 }).toFixed(6)} estimated maximum`; } catch { /* Unknown-price confirmation remains explicit. */ }
    destination.textContent = model ? `${model.destination} · ${estimate} · ${new TextEncoder().encode(JSON.stringify(getSnapshot())).length} document bytes` : 'Choose a model.';
    cost.hidden = Boolean(model?.prices); paste.hidden = !picker.value.startsWith('paste:'); send.hidden = !paste.hidden;
    promptText.textContent = JSON.stringify({ request: request.value, document: getSnapshot() }, null, 2);
  }
  async function refreshModels() {
    const previous = picker.value; models = await ai.models({ capability: 'generate' }); picker.replaceChildren();
    for (const model of models) picker.append(element('option', `${model.name ?? model.ref}${model.pinned ? '' : ' (unpinned)'}`, { value: model.ref }, document));
    if (models.some(m => m.ref === previous)) picker.value = previous; refreshDestination();
  }
  function show(next) { proposal = next; summary.textContent = next.summary; diff.textContent = next.diff; reviewArea.hidden = false; accept.disabled = false; status.textContent = next.stale ? 'Ready to review. The document has changed; acceptance will check the edits again.' : 'Ready to review. Your document has not changed.'; }
  function reset() { generation++; change.cancel(); session = proposal = handoff = null; reviewArea.hidden = true; stream.hidden = true; busy = false; send.disabled = false; }
  picker.onchange = refreshDestination; request.oninput = () => { session = handoff = null; refreshDestination(); };
  send.onclick = async () => {
    if (busy) return;
    const model = selected(); if (!consent.checked) { outcome(new Error('Review the destination and allow sending first.')); return; }
    const current = ++generation; busy = true; send.disabled = true; reviewArea.hidden = true; stream.textContent = ''; stream.hidden = false; status.textContent = 'Preparing and sending your request…';
    try {
      ai.consent(model.destination);
      const next = await change.propose({ request: request.value, model: model.ref, maxTokens: 2048, ...(model.prices ? {} : { confirmedCost: Number(cost.value) }), onText: delta => { if (current === generation) stream.textContent += delta; } });
      if (current === generation) show(next);
    } catch (e) { if (current === generation) outcome(e); }
    finally { if (current === generation) { busy = false; send.disabled = false; } }
  };
  copy.onclick = async () => {
    // Clipboard permission is requested in this click before asynchronous prompt hashing.
    // A prepared prompt is required; the first click prepares it, the next copies it.
    try {
      if (!session) { session = await change.prepare({ request: request.value }); handoff = pasteHandoff(session); promptText.textContent = session.prompt; status.textContent = `Prompt ready (${handoff.bytes} bytes). Review it, then click Copy prompt again.`; return; }
      await handoff.copy(); status.textContent = 'Prompt copied. Paste it into your chat, then bring the reply back here.';
    } catch (e) { outcome(e); }
  };
  open.onclick = () => { try { if (!handoff) throw new Error('Prepare the prompt first.'); handoff.open(); } catch (e) { outcome(e); } };
  review.onclick = () => { try { if (!session) throw new Error('Prepare a prompt first.'); show(change.review(session, reply.value)); } catch (e) { outcome(e); } };
  accept.onclick = () => { try { change.apply(proposal); reviewArea.hidden = true; proposal = null; undo.disabled = false; status.textContent = 'Change accepted. You can undo it or use Back.'; } catch (e) { outcome(e); } };
  reject.onclick = () => { reset(); status.textContent = 'Proposal rejected. Your document has not changed.'; };
  refine.onclick = () => { if (proposal) { request.value += `\nRefine the previous proposal: ${proposal.summary}. Return a complete set of edits against the original document.`; request.focus(); status.textContent = 'Describe your refinement, then send another request.'; } };
  undo.disabled = true; undo.onclick = () => { try { change.undo(); undo.disabled = true; status.textContent = 'AI change undone.'; } catch (e) { outcome(e); } };
  cancel.onclick = () => { reset(); status.textContent = 'Request cancelled.'; };
  const buttons = element('div', null, { className: 'fk-ai-actions' }, document); buttons.append(send, cancel, undo);
  panel.append(element('h2', 'Ask for a change', {}, document), request, picker, destination, cost, consentLabel, disclosure, buttons, paste, status, stream, reviewArea);
  void refreshModels();
  return { panel, change, refreshModels, cancel: reset, open() { refreshDestination(); request.focus(); }, destroy() { reset(); panel.remove(); } };
}
