import { createConfig, createUrlState } from './vendor/fragment-kit-v0.4.3/src/index.js';
export const config = createConfig({ slug: 'fragment-notes', name: 'Fragment Notes', storagePrefix: 'fragment-notes',
  canonicalOrigin: 'https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/demo/',
  recoveryOrigin: 'https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/demo/',
  repo: 'curtcox/Tools-for-pages-with-state-in-URL-fragments', docs: '../docs/', gallery: 'gallery.html', hashbinClientId: '', documentType: 'notes',
  ai: {
    deployments: {
      'https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/demo/': { connection: 'direct' },
      'http://127.0.0.1:8000/demo/': { connection: 'direct' },
      'http://localhost:8000/demo/': { connection: 'direct' },
    },
    routes: ['paste', 'openrouter', 'openai', 'anthropic', 'gemini', 'local', 'browser'],
    budget: { total: 0, day: 0, month: 0 },
    models: [
      { ref: 'openai:gpt-4.1-mini-2025-04-14', name: 'GPT-4.1 mini', capabilities: ['generate', 'decide'], destination: 'OpenAI', pinned: true, prices: { input: 0.4, output: 1.6 } },
      { ref: 'openrouter:typesafe/jev-1.14', name: 'Jev 1.14', capabilities: ['decide'], destination: 'OpenRouter and TypeSafe', pinned: true, prices: null, nativeDecisions: true },
    ],
  } });
export const type = { type: 'notes', settingsKeys: ['theme'], fileName: 'notes.json', contentType: 'application/json',
  normalize(value) {
    if (typeof value.src !== 'string') throw new Error('Source must be text.');
    if (value.notes?.theme && !['paper', 'mint'].includes(value.notes.theme)) throw new Error('Unknown notes theme.');
    return { src: value.src, notes: { theme: value.notes?.theme ?? value.theme ?? 'paper' } };
  },
  ai: { describe: 'Fragment Notes has src (plain text) and notes.theme (paper or mint). Preserve the theme and unrelated words.', paths: ['/src'], output: 'edits' },
  isDefault: value => value.notes.theme === 'paper',
};
export const urlState = createUrlState({ config, type });
