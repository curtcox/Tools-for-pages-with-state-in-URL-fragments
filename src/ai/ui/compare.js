import { element, createDialog, download } from '../../ui/dialog.js';
import { runEval } from '../eval/runner.js';
import { createReport } from '../eval/report.js';
import { parseSuite } from '../eval/suite.js';
import { changePrompt } from '../prompts.js';
export function createCompareModels({ ai, type, suite: input, container, storage, onPublish, document = globalThis.document }) {
  const suite = parseSuite(input, type), dialog = createDialog('Compare models', { id: 'ai-compare', document }); dialog.body.classList.add('fk-ai-compare');
  const choices = element('div', null, {}, document), repeats = element('input', null, { type: 'number', min: 1, max: 100, value: 1, 'aria-label': 'Comparison repeats' }, document);
  const budget = element('input', null, { type: 'number', min: 0, step: '.01', value: 0, 'aria-label': 'Comparison spending cap' }, document);
  const explanation = element('p', 'Results stay on this device. Select 2–4 models; review destinations and the estimate before running.', {}, document);
  const consent = element('input', null, { type: 'checkbox', 'aria-label': 'Allow comparison requests' }, document), consentLabel = element('label', ' Allow these requests and destinations', {}, document); consentLabel.prepend(consent);
  const run = element('button', 'Run comparison', { type: 'button' }, document), stop = element('button', 'Stop comparison', { type: 'button' }, document), reveal = element('button', 'Reveal model names', { type: 'button' }, document), save = element('button', 'Export report', { type: 'button' }, document);
  const status = element('p', '', { role: 'status' }, document), results = element('div', null, {}, document);
  let models = [], latest, controller, revealed = false, revision = 0;
  const selected = () => [...choices.querySelectorAll('input:checked')].map(i => i.value);
  async function estimate() {
    const current = ++revision; consent.checked = false; const refs = selected(); let cost = 0;
    try {
      for (const c of suite.cases) {
        const messages = c.kind === 'change' ? (await changePrompt({ type, snapshot: c.base, request: c.request })).messages : [{ role: 'user', content: JSON.stringify({ state: c.state, questions: { answer: c.question } }) }];
        for (const model of refs) cost += ai.estimate({ model, capability: c.kind === 'change' ? 'generate' : 'decide', messages, maxTokens: 2048 }) * Number(repeats.value);
      }
      if (current === revision) explanation.textContent = `${refs.length * suite.cases.length * Number(repeats.value)} calls · estimated maximum $${cost.toFixed(6)} · destinations: ${[...new Set(models.filter(m => refs.includes(m.ref)).map(m => m.destination))].join(', ')}. Results stay on this device.`;
    } catch { if (current === revision) explanation.textContent = 'A selected model has an unknown price. Add a priced model before automated evaluation.'; }
  }
  async function refresh() {
    models = (await ai.models()).filter(m => !m.ref.startsWith('paste:'));
    choices.replaceChildren(); for (const m of models) { const label = element('label', ` ${m.name ?? m.ref} → ${m.destination}`, {}, document), input = element('input', null, { type: 'checkbox', value: m.ref }, document); input.onchange = estimate; label.prepend(input); choices.append(label, element('br', '', {}, document)); }
  }
  function render() {
    results.replaceChildren(); if (!latest) return;
    const table = element('table', null, {}, document), head = element('tr', null, {}, document);
    for (const name of ['Model', 'Success (N)', '95% interval', 'Cost / success', 'Time']) head.append(element('th', name, {}, document)); table.append(head);
    latest.metrics.rows.forEach((r, i) => {
      const row = element('tr', null, {}, document);
      for (const value of [revealed ? r.model : `Model ${String.fromCharCode(65 + i)}`, `${r.successes}/${r.n}`, `${(r.interval.low * 100).toFixed(0)}–${(r.interval.high * 100).toFixed(0)}%`, r.costPerSuccess == null ? 'unknown' : '$' + r.costPerSuccess.toFixed(6), (r.totalMs / 1000).toFixed(2) + 's']) row.append(element('td', value, {}, document));
      table.append(row);
    });
    results.append(table, element('p', latest.metrics.conclusion, {}, document)); save.disabled = false; reveal.disabled = false;
  }
  run.onclick = async () => {
    const refs = selected(); if (refs.length < 2 || refs.length > 4 || !consent.checked) { status.textContent = 'Select 2–4 models and allow the displayed destinations first.'; return; }
    controller?.abort(); controller = new AbortController(); run.disabled = true; revealed = false;
    for (const m of models.filter(m => refs.includes(m.ref))) ai.consent(m.destination);
    try { latest = await runEval({ ai, type, suite, models: refs, repeats: Number(repeats.value), budget: Number(budget.value), storage, signal: controller.signal, onProgress: p => { status.textContent = `${p.completed} results recorded.`; } }); render(); status.textContent = latest.stopped ? `Stopped: ${latest.stopped}. Completed results are kept.` : 'Comparison complete. Models are hidden until you reveal them.'; }
    catch (e) { status.textContent = e.message; } finally { run.disabled = false; }
  };
  stop.onclick = () => controller?.abort(); reveal.onclick = () => { revealed = true; render(); };
  save.disabled = reveal.disabled = true; save.onclick = () => download(new Blob([JSON.stringify(createReport(latest), null, 2)], { type: 'application/json' }), 'ai-evaluation.json');
  dialog.dialog.addEventListener('close', () => controller?.abort()); repeats.oninput = estimate;
  dialog.body.append(explanation, choices, repeats, budget, consentLabel, run, stop, reveal, save, status, results);
  if (onPublish) { const publish = element('button', 'Publish report', { type: 'button' }, document); publish.onclick = () => { if (latest) onPublish(createReport(latest)); }; dialog.body.append(publish); }
  const button = element('button', 'Compare models', { type: 'button', id: 'ai-compare-open' }, document); button.onclick = () => { void refresh(); dialog.open(); }; container?.append(button);
  return { ...dialog, button, refresh };
}
