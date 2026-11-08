import test from 'node:test';
import assert from 'node:assert/strict';
import { createAi, runEval, parseSuite, validateReferences, wilson, probabilityMetrics, createReport, parseReport } from '../src/ai/index.js';
import { validateQuestions, validateAnswers } from '../src/ai/drivers/decisions.js';
import { mockFetch } from '../testing/fixtures/mock-ai.mjs';
import { config, memory } from '../testing/fixtures/helpers.js';
const type = { type: 'notes', normalize: v => { if (typeof v.src !== 'string') throw new Error('Invalid'); return { src: v.src }; } };
const suite = { format: 'fragment-kit-eval-suite', version: 1, app: 'notes', cases: [{ id: 'greet', kind: 'change', base: { src: 'Hello' }, request: 'uppercase', checks: [{ type: 'contains', text: 'HELLO' }], reference: { good: { src: 'HELLO' }, bad: { src: 'hello' } } }] };
const model = { ref: 'openai:mock', capabilities: ['generate', 'decide'], destination: 'OpenAI', pinned: true, prices: { input: 0, output: 0 } };
test('eval runs, resumes without calls, reports resolved refs and excludes private cases', async () => {
  let calls = 0; const storage = memory();
  const ai = await createAi({ config: { ...config, ai: { deployments: { [config.canonicalOrigin]: { connection: 'direct' } }, routes: ['openai'], budget: { total: 0 } } }, type, models: [model], fetchSource: (...args) => { calls++; return mockFetch(...args); } });
  ai.connect('openai', 'probe'); ai.consent('OpenAI');
  const run = await runEval({ ai, type, suite, models: [model.ref], repeats: 2, storage });
  assert.equal(calls, 2); assert.equal(run.metrics.rows[0].successRate, 1); assert.equal(run.metrics.best, null);
  assert.equal(run.results[0].model, 'openai:mock-snapshot');
  await runEval({ ai, type, suite, models: [model.ref], repeats: 2, storage }); assert.equal(calls, 2);
  const report = createReport(run); assert.equal(parseReport(JSON.stringify(report)).results.length, 2);
  run.results[0].private = true; assert.equal(createReport(run).results.length, 1);
  assert.throws(() => parseReport({ ...report, key: 'secret' }), /Unknown/);
});
test('references must discriminate, suite fields are strict and regex cannot backtrack', async () => {
  const parsed = parseSuite(suite, type); await validateReferences(parsed, type);
  parsed.cases[0].reference.bad.src = 'HELLO'; await assert.rejects(validateReferences(parsed, type), /Bad reference passes/);
  assert.throws(() => parseSuite({ ...suite, run: 'code' }, type), /Unknown/);
  const hostile = structuredClone(suite); hostile.cases[0].checks = [{ type: 'regex', pattern: '(a+)+$' }];
  assert.throws(() => parseSuite(hostile, type), /no repetition/);
});
test('Wilson intervals and probability metrics have correct endpoints', () => {
  assert.equal(wilson(0, 0).high, 1); assert.ok(Math.abs(wilson(5, 10).low - .23659) < .0001);
  assert.deepEqual(probabilityMetrics(null, 'a'), { brier: null, logLoss: null });
  assert.equal(probabilityMetrics({ a: 1, b: 0 }, 'a').brier, 0);
});
test('decision schema follows Jev and emulation strips confidence', () => {
  const questions = validateQuestions({ sample: { type: 'choice', instructions: 'Pick', criteria: { a: 'One', b: 'Two' } }, severity: { type: 'score', instructions: 'Rank', criteria: ['low', 'high'] }, yes: { type: 'noul', instructions: 'Yes?', criteria: { true: 'yes', false: 'no' } } });
  const answers = { sample: { type: 'choice', choice: 'a', probabilities: { a: .9, b: .1 }, confidence: .8 }, severity: { type: 'score', score: .5, probabilities: { 0: .5, 1: .5 } }, yes: { type: 'noul', noul: .8 } };
  assert.equal(validateAnswers(answers, questions, 'native').sample.choice, 'a');
  const emulated = validateAnswers(answers, questions, 'emulated'); assert.equal(emulated.sample.probabilities, null); assert.equal(emulated.sample.confidence, undefined);
  answers.sample.choice = 'invented'; assert.throws(() => validateAnswers(answers, questions, 'native'), /unknown option/);
});
test('judge results are hidden unless all good/bad references calibrate correctly', async () => {
  const {calibrateJudge,judgeChange}=await import('../src/ai/index.js'); let count=0;
  const ai={decide:async()=>({answers:{fulfilled:{type:'choice',choice:count++===0?'target':'none',probabilities:null}},source:'emulated'})};
  const calibration=await calibrateJudge({ai,type,suite,model:'openai:judge',decoys:['Change the theme']}); assert.equal(calibration.calibrated,true);
  const hidden=await judgeChange({ai,type,calibration:{...calibration,calibrated:false},model:'openai:judge'}); assert.deepEqual(hidden,{visible:false,score:null});
});
