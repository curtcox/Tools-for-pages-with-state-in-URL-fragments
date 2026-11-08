import test from 'node:test';
import assert from 'node:assert/strict';
import { createAi, createChangeRequests } from '../src/ai/index.js';
import { readEvents } from '../src/ai/drivers/http.js';
import { mockAiResponse } from '../testing/fixtures/mock-ai.mjs';
import { stageAiHost } from '../tools/stage-ai-host.mjs';
import { config } from '../testing/fixtures/helpers.js';
const model = { ref: 'openai:mock', capabilities: ['generate', 'decide'], pinned: true, destination: 'OpenAI', prices: { input: 0, output: 0 } };
const type = { type: 'notes', normalize: v => ({ src: v.src }) };
for (const mode of ['direct', 'gateway']) test(`${mode} passes the reviewed change contract and sends authorization only in headers`, async () => {
  let doc = { src: 'Hello' }, calls = [];
  const fetchSource = async (url, opts) => {
    calls.push({ url: String(url), opts }); const body = JSON.parse(opts.body);
    if (mode === 'direct') return mockAiResponse(body);
    const response = JSON.parse(await mockAiResponse({ ...body, stream: false }).text());
    const result = { text: response.choices[0].message.content, model: 'openai:resolved', provider: 'mock', usage: { inputTokens: 100, outputTokens: 30 }, cost: 0 };
    return new Response(`event: text\ndata: ${JSON.stringify({ text: result.text })}\n\nevent: result\ndata: ${JSON.stringify(result)}\n\n`);
  };
  const ai = await createAi({ config: { ...config, ai: { deployments: { [config.canonicalOrigin]: mode === 'gateway' ? { connection: mode, url: 'https://gateway.example/' } : { connection: mode } }, routes: ['openai'], models: [model] } }, type, getAuthorization: () => 'Bearer gateway-probe', fetchSource });
  if (mode === 'direct') ai.connect('openai', 'direct-probe'); ai.consent('OpenAI');
  const change = createChangeRequests({ ai, type, getSnapshot: () => doc, getFingerprint: () => doc.src, onApply: d => { doc = d; } });
  const p = await change.propose({ request: 'uppercase', model: model.ref }); assert.equal(doc.src, 'Hello'); change.apply(p); assert.equal(doc.src, 'HELLO'); change.undo(); assert.equal(doc.src, 'Hello');
  assert.equal(calls[0].opts.redirect, 'error'); assert.ok(!calls[0].url.includes('probe')); assert.ok(!calls[0].opts.body.includes('probe'));
});
test('SSE bounds bytes before callbacks and decodes CRLF split UTF-8', async () => {
  const data = new TextEncoder().encode('data: {"text":"café"}\r\n\r\ndata: [DONE]\r\n\r\n');
  const response = new Response(new ReadableStream({ start(c) { for (const b of data) c.enqueue(Uint8Array.of(b)); c.close(); } }));
  const chunks = []; await readEvents(response, c => chunks.push(c)); assert.deepEqual(chunks, [{ text: 'café' }]);
  await assert.rejects(readEvents(new Response('data: {"too":"large"}\n\n'), () => {}, { maxBytes: 5 }), /byte limit/);
});
test('host staging rejects wildcard/shared origins and embedded credentials before writing', async () => {
  const host = { name: 'AI', storagePrefix: 'test-ai', routes: ['openai'], models: [model] };
  for (const origin of ['https://*.hashbin.page', 'https://curtcox.github.io', 'https://run.hashbin.app', 'https://preview.example']) await assert.rejects(stageAiHost({ config: { ...host, allowedOrigins: [origin] }, output: '/private/tmp/should-not-stage-ai' }));
  await assert.rejects(stageAiHost({ config: { ...host, allowedOrigins: ['https://app.example'], apiKey: 'bad' }, output: '/private/tmp/should-not-stage-ai' }), /Unknown/);
});
