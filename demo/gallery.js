import { mountGallery } from './vendor/fragment-kit-v0.3.4/src/index.js';
import { urlState } from './config.js';
import { examples } from './examples.js';
mountGallery({ container: document.getElementById('gallery'), catalog: examples, urlState: { build: doc => urlState.build(doc, { url: new URL('./', location.href).href }) } });
