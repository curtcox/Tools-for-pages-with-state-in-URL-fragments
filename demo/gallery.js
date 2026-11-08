import { mountGallery } from './vendor/fragment-kit-v0.3.5/src/index.js';
import { createSampleChooser } from './vendor/fragment-kit-v0.3.5/src/ai/index.js';
import { urlState } from './config.js';
import { examples } from './examples.js';
mountGallery({ container: document.getElementById('gallery'), catalog: examples, urlState: { build: doc => urlState.build(doc, { url: new URL('./', location.href).href }) } });

createSampleChooser({ catalog: examples, urlState, container: document.getElementById('gallery') });
