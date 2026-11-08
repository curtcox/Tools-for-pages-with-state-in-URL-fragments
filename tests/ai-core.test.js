import test from 'node:test';
import assert from 'node:assert/strict';
import { createAi, createBudget, estimateCost, createChangeRequests, applyOutput } from '../src/ai/index.js';
import { createUrlState } from '../src/core/url-state.js';
import { config, memory, clock } from '../testing/fixtures/helpers.js';
const type = { type: 'notes', normalize(v) { if (typeof v.src !== 'string' || v.src.includes('INVALID')) throw new Error('Invalid source.'); return { src: v.src }; }, ai: { describe: 'Edit notes.' } };
const aiConfig = { ...config, ai: { deployments: { 'https://test.hashbin.page/': { connection: 'direct' } }, routes: ['openai', 'paste'], budget: { total: 1 } } };
const model = { ref: 'openai:test', capabilities: ['generate', 'decide'], destination: 'OpenAI', pinned: true, prices: { input: 1, output: 2 } };
test('AI is absent without config and creation/listing make no calls', async () => {
  assert.equal(await createAi({ config, type }), null); let calls = 0;
  const ai = await createAi({ config: aiConfig, type, models: [model], fetchSource: () => { calls++; } });
  assert.equal((await ai.models()).length, 2); assert.equal(calls, 0);
  await assert.rejects(ai.generate({ model: model.ref, messages: [{ role: 'user', content: 'Hi' }], maxTokens: 2 }), /allow sending/);
});
test('direct credentials are memory-only, usage settles budget, disconnect blocks', async () => {
  const storage = memory(); let observed;
  const ai = await createAi({ config: aiConfig, type, storage, models: [model], fetchSource: async (url, opts) => {
    observed = { url, opts }; return Response.json({ model: 'snapshot', choices: [{ message: { content: '{"ok":true}' }, finish_reason: 'stop' }], usage: { prompt_tokens: 2, completion_tokens: 2 } });
  } });
  ai.connect('openai', 'probe-key'); ai.consent('OpenAI');
  const result = await ai.generate({ model: model.ref, messages: [{ role: 'user', content: 'Hi' }], maxTokens: 10 });
  assert.equal(observed.opts.headers.Authorization, 'Bearer probe-key'); assert.equal(observed.opts.redirect, 'error');
  assert.equal(result.model, 'openai:snapshot'); assert.deepEqual(result.json, { ok: true });
  assert.equal(ai.budget.spent().total, .000006); assert.ok(!JSON.stringify([...storage.values]).includes('probe-key'));
  ai.disconnect(); ai.consent('OpenAI');
  await assert.rejects(ai.generate({ model: model.ref, messages: [{ role: 'user', content: 'Hi' }], maxTokens: 10 }), /Connect/);
});
test('budgets reserve concurrently, persist, fail closed and require unknown-price confirmation', () => {
  assert.throws(() => estimateCost({ messages: [], maxTokens: 1, prices: null }), /unknown/);
  const storage = memory(), b = createBudget({ total: .1, storage });
  const r = b.reserve(.08); assert.throws(() => b.reserve(.03), /budget/); r.settle(.02);
  assert.equal(createBudget({ total: .1, storage }).spent().total, .02);
  assert.throws(() => r.settle(0), /already/);
  assert.throws(() => createBudget({ total: -1 }), /budget/);
});
test('edits reject ambiguity, overlaps, prototype paths, unknown fields and invalid normalized output', () => {
  const apply = output => applyOutput({ type, snapshot: { src: 'hello hello' }, output });
  assert.throws(() => apply({ summary: 'test', edits: [{ find: 'hello', replace: 'x' }] }), /exactly once/);
  assert.throws(() => apply({ summary: 'test', edits: [{ find: '', replace: 'x' }] }), /nonempty/);
  assert.throws(() => apply({ summary: 'test', edits: [], key: 'bad' }), /Unknown/);
  assert.throws(() => apply({ summary: 'test', edits: [{ path: '/__proto__/x', find: 'a', replace: 'b' }] }), /cannot/);
  assert.throws(() => apply({ summary: 'test', edits: [{ find: 'hello hello', replace: 'INVALID' }] }), /Invalid/);
});
test('review never applies; stale edits rebase; undo protects later edits and navigation invalidates sessions', async () => {
  let doc = { src: 'hello' }, applied = 0;
  const change = createChangeRequests({ type, getSnapshot: () => doc, getFingerprint: () => JSON.stringify(doc), onApply: next => { doc = next; applied++; } });
  const session = await change.prepare({ request: 'greet' });
  const proposal = change.review(session, { summary: 'greet', edits: [{ find: 'hello', replace: 'hi' }] });
  assert.equal(applied, 0); doc = { src: 'hello world' }; change.apply(proposal); assert.equal(doc.src, 'hi world');
  change.undo(); assert.equal(doc.src, 'hello world');
  const p2 = change.review(session, { summary: 'greet', edits: [{ find: 'hello', replace: 'hi' }] }); change.apply(p2); doc.src += '!'; assert.throws(() => change.undo(), /changed after/);
  change.cancel(); assert.throws(() => change.review(session, { summary: 'x', edits: [] }), /no longer/);
});
test('late generation is dropped on cancel', async () => {
  let resolve; const ai = { generate: () => new Promise(r => { resolve = r; }) };
  const change = createChangeRequests({ ai, type, getSnapshot: () => ({ src: 'hello' }), getFingerprint: () => 'same', onApply: () => assert.fail() });
  const pending = change.propose({ request: 'greet', model: 'mock' });
  while (!resolve) await new Promise(r => setImmediate(r)); change.cancel(); resolve({ text: '{"summary":"greet","edits":[]}' });
  await assert.rejects(pending, /abort|cancel/i);
});
test('commit captures pending typing in previous history entry and cancels its timer', async () => {
  const timers = clock(), entries = [], history = { state: null, replaceState: (...args) => entries.push(['replace', args[2]]), pushState: (...args) => entries.push(['push', args[2]]) };
  const state = createUrlState({ config, type, timers, history, location: { href: config.canonicalOrigin } });
  state.write({ src: 'typed' }); state.commit({ src: 'accepted' }, { previous: { src: 'typed' } }); await timers.flush();
  assert.deepEqual(entries.map(e => e[0]), ['replace', 'push']); assert.equal(state.parse(entries[0][1]).doc.src, 'typed');
});
test('invalid adapter limits fail closed before parsing model output', () => {
  const output={summary:'No change',edits:[]};
  for(const maxBytes of [NaN,Infinity,-1,0,'100']) assert.throws(()=>applyOutput({type:{...type,ai:{maxBytes}},snapshot:{src:'hello'},output}),/byte limit/);
  assert.throws(()=>estimateCost({messages:[],maxTokens:1,prices:null,confirmedCost:0}),/confirmed cost/);
});
