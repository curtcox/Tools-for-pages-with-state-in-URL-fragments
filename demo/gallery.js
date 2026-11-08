import { mountGallery, createStorage } from './vendor/fragment-kit-v0.4.0/src/index.js';
import { createAi, createAiSettings, createSampleChooser, handleAiCallback } from './vendor/fragment-kit-v0.4.0/src/ai/index.js';
import { config, type, urlState } from './config.js';
import { examples } from './examples.js';
const container = document.getElementById('gallery');
let callback=false, callbackError;
try {callback=handleAiCallback();}catch(error){callbackError=error;}
if(callbackError){const status=document.createElement('p');status.setAttribute('role','status');status.textContent=callbackError.message;container.append(status);}
if(!callback && !callbackError) {
const links = { build: doc => urlState.build(doc, { url: new URL('./', location.href).href }) };
const ai = await createAi({ config, type, storage: createStorage({ prefix: config.storagePrefix }) });
if (ai) createAiSettings({ ai, container });
createSampleChooser({ ai, catalog: examples, urlState: links, container });
mountGallery({ container, catalog: examples, urlState: links });

}
