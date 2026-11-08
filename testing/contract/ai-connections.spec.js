import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
for (const mode of ['direct', 'gateway', 'host']) test(`${mode} supports the same propose/review/apply/undo boundary`, async ({ page, context }) => {
  test.skip(Boolean(process.env.FRAGMENT_KIT_CONTRACT_CONFIG), 'Standalone AI connection contract');
  await context.route('**/testing/fixtures/ai-live.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>AI connections</title>' }));
  const result = { text: JSON.stringify({ summary: 'Greet', edits: [{ find: 'Hello', replace: 'Hi' }] }), model: 'openai:resolved', provider: 'mock', usage: { inputTokens: 10, outputTokens: 10 }, cost: 0, finish: 'stop', timing: { totalMs: 1, firstMs: 1 } };
  await context.route('https://api.openai.com/v1/chat/completions', route => route.fulfill({ json: { model: 'resolved', choices: [{ message: { content: result.text }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 10 } } }));
  await context.route('https://gateway.example/v1/generate', route => route.fulfill({ contentType: 'text/event-stream', body: `event: result\ndata: ${JSON.stringify(result)}\n\n` }));
  await context.route('https://ai.example/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/v1/host.html') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Mock AI host</title><script type="module" src="/mock-host.js"></script>' });
    if (url.pathname === '/mock-host.js') return route.fulfill({ contentType: 'text/javascript', body: `import {installAiHost} from '/src/ai/host/protocol.js'; installAiHost({allowedOrigins:[${JSON.stringify(new URL(test.info().project.use.baseURL ?? 'http://127.0.0.1:8000').origin)}],createClient:async()=>({models:async()=>[],generate:async()=>(${JSON.stringify(result)}),destroy(){}})});` });
    const file = path.resolve('.' + url.pathname); if (!file.startsWith(path.resolve('src') + path.sep)) return route.abort();
    return route.fulfill({ contentType: 'text/javascript', body: await fs.readFile(file, 'utf8') });
  });
  await page.goto('/testing/fixtures/ai-live.html');
  const outcome = await page.evaluate(async ({ mode }) => {
    const { createAi, createChangeRequests } = await import('/src/ai/index.js');
    const type = { type: 'notes', normalize: v => ({ src: v.src }) }, model = { ref: 'openai:mock', capabilities: ['generate'], pinned: true, destination: 'Test provider', prices: { input: 0, output: 0 } };
    const ai = await createAi({ config: { name: 'AI contract', canonicalOrigin: location.origin + '/', storagePrefix: 'fk-ai-contract', ai: { deployments: { [location.origin + '/']: { connection: mode, ...(mode === 'host' ? { host: 'https://ai.example/v1/' } : mode === 'gateway' ? { url: 'https://gateway.example/' } : {}) } }, routes: ['openai'], models: [model] } }, type, getAuthorization: () => 'Bearer test-short-lived' });
    if (mode === 'direct') ai.connect('openai', 'test-memory-only'); ai.consent('Test provider');
    let document = { src: 'Hello' };
    const change = createChangeRequests({ ai, type, getSnapshot: () => document, getFingerprint: () => document.src, onApply: d => { document = d; } });
    const proposal = await change.propose({ request: 'Greet', model: model.ref }), before = document.src;
    change.apply(proposal); const accepted = document.src; change.undo(); ai.destroy(); return { before, accepted, undone: document.src };
  }, { mode }); expect(outcome).toEqual({ before: 'Hello', accepted: 'Hi', undone: 'Hello' });
});
