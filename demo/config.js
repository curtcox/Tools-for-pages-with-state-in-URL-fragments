import { createConfig, createUrlState } from './vendor/fragment-kit-v0.2.0/src/index.js';
export const config = createConfig({ slug: 'fragment-notes', name: 'Fragment Notes', storagePrefix: 'fragment-notes',
  canonicalOrigin: 'https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/demo/',
  recoveryOrigin: 'https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/demo/',
  repo: 'curtcox/Tools-for-pages-with-state-in-URL-fragments', docs: '../docs/', gallery: 'gallery.html', hashbinClientId: '', documentType: 'notes' });
export const type = { type: 'notes', settingsKeys: ['theme'], fileName: 'notes.json', contentType: 'application/json',
  normalize(value) {
    if (typeof value.src !== 'string') throw new Error('Source must be text.');
    if (value.notes?.theme && !['paper', 'mint'].includes(value.notes.theme)) throw new Error('Unknown notes theme.');
    return { src: value.src, notes: { theme: value.notes?.theme ?? value.theme ?? 'paper' } };
  },
  isDefault: value => value.notes.theme === 'paper',
};
export const urlState = createUrlState({ config, type });
