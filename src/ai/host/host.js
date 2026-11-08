import { createAi } from '../client.js';
import { installAiHost } from './protocol.js';
import { createStorage } from '../../core/storage.js';
import { element } from '../../ui/dialog.js';
import { endpoint, sha256 } from '../data.js';
import { jsonResponse } from '../drivers/http.js';
const status = document.getElementById('host-status'), controls = document.getElementById('host-controls');
const noopType = { type: 'ai-host', normalize: value => value };
try {
  const config = await jsonResponse(await fetch(new URL('../../../ai-host.config.json', import.meta.url)), 65536);
  const here = new URL(location.href), app = here.searchParams.get('app');
  const prefixFor = async origin => `${config.storagePrefix}-${(await sha256(origin)).slice(0, 24)}`;
  function credentialForm(onConnect, origin) {
    document.getElementById('host-app').textContent = `Allow AI requests from ${origin}. Prompts go to the selected provider. Each app has its own consent and budget.`;
    const route = element('select', null, { 'aria-label': 'Provider' });
    for (const value of config.routes.filter(r => ['openai', 'openrouter', 'anthropic', 'gemini'].includes(r))) route.append(element('option', value, { value }));
    const key = element('input', null, { type: 'password', autocomplete: 'off', 'aria-label': 'API key' });
    const cap = element('input', null, { type: 'number', min: '0', step: '.01', value: '0', 'aria-label': 'App spending cap (USD)' });
    const approve = element('button', 'Allow this app and connect', { type: 'button' });
    approve.onclick = () => {
      const value = key.value; key.value = '';
      if (!value || !Number.isFinite(Number(cap.value)) || Number(cap.value) < 0) { status.textContent = 'Enter your key and a valid spending cap.'; return; }
      onConnect({ route: route.value, key: value, cap: Number(cap.value) });
    };
    controls.replaceChildren(element('p', 'Keys are kept for this session on this separate origin. Nothing is stored on the app origin.'), route, key, element('label', 'Maximum spend for this app (USD)'), cap, approve);
  }
  if (window.parent === window && app) {
    if (!config.allowedOrigins.includes(app) || !window.opener || endpoint(app).origin !== app) throw new Error('This app is not allowed to use this AI host.');
    // The opener is the host iframe, never the embedding app. Send credentials only over a direct same-origin port.
    const nonce = here.searchParams.get('session');
    credentialForm(credentials => {
      const channel = new MessageChannel();
      channel.port1.onmessage = event => { if (event.data === 'ready') { channel.port1.postMessage(credentials); channel.port1.close(); window.close(); } };
      window.opener.postMessage({ type: 'fragment-kit-ai-host-credentials', nonce }, here.origin, [channel.port2]);
    }, app);
  } else if (window.parent !== window) {
    installAiHost({ allowedOrigins: config.allowedOrigins, createClient: async origin => {
      const prefix = await prefixFor(origin);
      return createAi({ config: { name: config.name, canonicalOrigin: here.origin + '/', storagePrefix: prefix, ai: { deployments: { [here.origin + '/']: { connection: 'direct' } }, routes: config.routes, models: config.models, budget: { total: 0, day: 0, month: 0 } } }, type: noopType, storage: createStorage({ prefix }) });
    }, onConnection: ({ ai, origin }) => {
      let popup, nonce;
      const button = element('button', 'Connect on AI host', { type: 'button' });
      button.onclick = () => {
        nonce = crypto.randomUUID(); const url = new URL(location.href); url.search = new URLSearchParams({ app: origin, session: nonce }).toString();
        popup = window.open(url.href, '_blank', 'popup,width=560,height=720');
        status.textContent = popup ? 'Connect in the host window, then return to the app.' : 'Allow popups and try again.';
      };
      controls.replaceChildren(button); document.getElementById('host-app').textContent = `Connection for ${origin}`;
      window.addEventListener('message', event => {
        if (event.origin !== here.origin || event.source !== popup || event.data?.type !== 'fragment-kit-ai-host-credentials' || event.data.nonce !== nonce || event.ports.length !== 1) return;
        const port = event.ports[0]; nonce = null;
        port.onmessage = async message => {
          try {
            const { route, key, cap } = message.data; ai.connect(route, key); ai.budget.configure({ total: cap, day: cap, month: cap });
            for (const model of await ai.models()) if (model.ref.startsWith(route + ':')) ai.consent(model.destination);
            status.textContent = 'Connected for this app and session. Return to Ask to send your request.';
          } catch { status.textContent = 'Connection failed. Try again.'; } finally { port.close(); }
        }; port.postMessage('ready');
      });
    } });
  } else status.textContent = 'Open AI settings from an allowed app to connect.';
} catch (error) { status.textContent = error.message; }
