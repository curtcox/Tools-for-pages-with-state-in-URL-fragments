# AI support plan

Status 2026-11-08: **implementation released through v0.4.3; canonical Python pilot shipped**.
The separate AI host is deployed with the owner-approved Python-only allowlist,
HTTPS enforcement and HSTS. The 75-result synthetic comparison and its 25-case
suite are published and verified. Python's canonical production adoption is deployed and verified. Remaining
manual device/provider coverage is listed below; it is not represented as passed.

### Current rollout receipts

- [v0.4.0 release](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.4.0),
  tag commit `a06cb334eaafc6844e29ba97a09506b020a5ec40`;
  [release verification](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42516278730).
- [v0.4.1 release](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.4.1),
  tag commit `8807ee53f27b0b806d63c4c059875eb308c4ef9a`;
  [CI](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42519936260),
  [release](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42519936232),
  [demo deployment](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42519936370).
  Downloaded archive and manifest matched published SHA256SUMS. Immutable workflow
  tag `v3` adds verification for engine-free pins; older tags and vendor pins remain unchanged.
- [v0.4.3 release](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.4.3),
  tag commit `b9174c417299411ccdeb020e731110436cfe6fcd`;
  [CI](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42525442591),
  [release and independent verification](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42525442689).
  The 0.4.2/0.4.3 follow-ups put the host frame above settings/drawers and keep
  it visible with real shared CSS. The complete styled Python settings → host
  popup → streamed proposal → review → acceptance flow passed in Chromium and
  WebKit using the real deployed host and a mocked provider. No accepted source
  ran automatically; no credential entered app storage. Older releases and pins
  remain unchanged. Downloaded archive and manifest matched published SHA256SUMS.
- Root validation: **301 unit tests**, check and demo generation passed. Local
  browser acceptance passed **128 checks in Chromium, WebKit, Pixel 7 and iPhone 14
  emulation**. Linux CI additionally ran Firefox and passed all three desktop engines.
  Playwright WebKit is not native Safari. No paid calls run in CI.
- [AI host](https://ai.hashbin.page/v0.4.0/host.html):
  [approved deployment](https://github.com/curtcox/hashbin.org/actions/runs/42522697907),
  Cloudflare version `12b0350c-a29e-43bc-ad2d-1ca2175b869a`. All **93 served
  assets** matched the deployment inventory; every previously deployed versioned
  byte remained unchanged. HTTP redirects to HTTPS preserving path/query. HTTPS
  sends HSTS, `frame-ancestors https://python.hashbin.page`, no-referrer and nosniff.
  The owner enabled only the AI-host redirect; deployment verifies it without
  expanding the existing token's permissions.
- The actual deployed host frame, same-origin popup, session-only credential
  handoff and Forget action passed in isolated **Chromium and WebKit**, using a
  synthetic key and mocked provider response (no paid call). No key appeared in
  app storage or URLs; the host did not remember it. Real same-site storage from
  top level to frame shared localStorage/IndexedDB/Cache in Chromium. WebKit shared
  localStorage but partitioned IndexedDB and Cache; the session handoff still passed.
- The owner approved and published the synthetic [75-result report](https://256t.us/AAAAAQ3zzfyajLIrkOkjBPVpgcAmwqAQIJrL-k4eUbIp1gy7y5sNo0kkHu6dMFRPdaoCWrpo4-uuhB6eHZe1IURMGkKdUg)
  (69,107 bytes) and [25-case suite](https://256t.us/AAAAADGcjEwNB4ND-2Sv_IimpglWi1mj9vM9LLnUS3zYCTJxh3V_HeL8DGF3ejhOg8uYdC6qvhuaARaI6MMZeY2O3aUUag)
  (12,700 canonical bytes), **$0.01 each for 12 months**. Both were downloaded
  through CID verification and matched the approved bytes. GPT-4.1 mini passed
  25/25, GPT-4.1 24/25 and GPT-4o mini 22/25 in Chromium opaque Python sandboxes.
  Their Wilson intervals overlap: there is no supported winner. Published
  reports are self-reported evidence, not independently certified results.
- A published 0.4.1 engine-free pin was independently verified against its exact
  full manifest, omitting only declared optional engine files (**25,324,968 bytes**).
  Host browser-model routing remains available; a local browser route without
  its engine fails static validation. Python currently keeps the full pin.
- Python shipped through [PR #5](https://github.com/curtcox/PythonOnline/pull/5)
  and [PR #6](https://github.com/curtcox/PythonOnline/pull/6). Final revision
  `6407c7febef755951ae72638598fd798168122ca` has exactly the source tree that
  passed the [full three-engine review gate](https://github.com/curtcox/PythonOnline/actions/runs/42532962803).
  [Canonical deployment](https://github.com/curtcox/hashbin.org/actions/runs/42534043528)
  published Cloudflare version `f136eb18-2cb3-445e-8541-936feb8887c3` at
  [python.hashbin.page](https://python.hashbin.page/). All **247 inventoried
  served files** matched their receipt; shipped SDK files matched published
  0.4.3 hashes, and canonical offline hashes were consistent. The intentionally
  deployed runtime subset excludes development/package metadata.
- [Gated recovery deployment](https://github.com/curtcox/PythonOnline/actions/runs/42534043642)
  passed all three browser engines and published the same final revision. Live
  recovery editor/gallery pages and active modules matched that source.
- Actual production checks in **Chromium and WebKit** passed: no host frame or
  provider call on link load, paste proposal/review/acceptance, run-disabled URL,
  opaque execution after acceptance and gallery text-search fallback. The actual
  deployed settings → separate host popup → streamed proposal → review →
  acceptance path also passed with a synthetic key and mocked provider response.
  No accepted source ran automatically and no test key entered app storage.
- The canonical gallery now permits only the approved AI host in its frame policy;
  a model-choice round trip under the actual gallery CSP passed in Chromium,
  Firefox and WebKit CI. The original search/tag controls remain usable.
- Consumer checks passed: **45 Node tests with real packages, 19 Python tests**,
  static/docs/offline/vendor checks, 32 real gallery previews, published-pin
  verification, shared/mobile contracts and complete gallery/AI checks in all
  three Linux engines. Focused hosted filesystem checks also passed in all three
  engines ([run](https://github.com/curtcox/PythonOnline/actions/runs/42523910374)).
- The [actual deployed-host measurement](https://github.com/curtcox/PythonOnline/actions/runs/42532397399)
  passed in Linux **Firefox, Chromium and WebKit**, with synthetic credentials and
  a mocked provider (no paid calls). Session handoff and Forget passed in all three.
  Top-level to same-site-frame localStorage/IndexedDB/Cache were all shared in
  Firefox and Chromium. WebKit shared localStorage and partitioned IndexedDB/Cache.
  A native Safari inspection stalled and is **not** counted as verification.
- Spending against the authorized **$10 cap**: known actual model cost
  **$0.027089008**, published documents **$0.02**, unresolved conservative
  reservations **$0.2015466**; total **$0.248635608 used or reserved**. No keys,
  raw private cases or account records are committed.

The owner also approved merging the host receipt PR, including its broader
hashbin.org deployment side effect. [PR #245](https://github.com/curtcox/hashbin.org/pull/245)
merged as `2f1abedb423980952fb714e890d0ecd1765b8b35`; [deployment](https://github.com/curtcox/hashbin.org/actions/runs/42524634672)
passed all gates, main/content/run-origin verification and live health matched
that revision.

[docs/ai-status.md](../docs/ai-status.md) is the frozen implementation snapshot
included in immutable kit releases; its earlier staged/unpublished statements are
superseded by the dated receipts above. Remaining coverage includes native Safari storage,
other-provider successful streams, Jev
option limits, real GPU/device testing and public browser-model mirror acceptance.
The original evidence below remains dated.

## 1. Goal

Let any Fragment Kit page use language models and decision models, without giving up what the kit already
guarantees: explicit URLs win, invalid input fails visibly, untrusted bytes are bounded and verified, and
credentials stay off app origins.

| Users can | How |
| --- | --- |
| Run an in-browser model they name with a 256t string | A small 256t manifest names verified weight shards, fetched from any mirror (§7) |
| Use hosted models | OpenRouter, OpenAI, Anthropic, Gemini and OpenAI-compatible local servers (§6) |
| Reuse accounts and subscriptions | OpenRouter sign-in, their own API keys, and paste handoff for any chat subscription (§6.2) |
| Answer multiple-choice questions with a decision model | For example, which gallery sample to start from (§8) |
| Describe a change instead of making it | A model proposes it, the user reviews a diff, and only acceptance changes the state (§9, §10) |
| See which model works best for this page | Per-page evaluation with objective checks, cost and latency (§11) |

**Out of scope for the first release:** model tool calling or agents, automatic application of changes, running
model output without a user action, speech and video, and training. Direct editing is never removed.

## 2. Evidence

### Tested here on 2026-11-08

| Finding | Result | Effect on the plan |
| --- | --- | --- |
| Browser access to hosted APIs | OpenRouter (including `/api/alpha/decisions` and `/auth/keys`), OpenAI, Anthropic and Gemini's OpenAI-compatible endpoint all return CORS headers on real responses, using an invalid key | No relay is needed for any of them. Secondary sources saying OpenAI blocks browsers were wrong as of today. **Successful and streaming responses are untested** (Phase 0) |
| Anthropic browser header | Without `anthropic-dangerous-direct-browser-access`, the response has no CORS header | The Anthropic driver always sends it |
| HashBin size limits | API `max_upload_bytes` is 94371840 (90 MiB); hosted Publish accepts 5 MiB; the kit's `maxBytes` is 5 MiB | Weights can't be one CID through existing paths, so they are shards named by a small manifest |
| `verify()` / `computeCID()` | One-shot `crypto.subtle.digest` over a whole buffer | Shards must be small enough to hold in memory: 64 MiB by default |
| Public Suffix List | `github.io` is listed. `hashbin.page` is not | `*.hashbin.page` apps are same-site with each other; `curtcox.github.io` is cross-site to them |
| Canonical app headers | `python.hashbin.page` sends `frame-ancestors 'none'` and no COOP/COEP | Headers can be set on this hosting; multi-threaded WASM is not available in apps today |
| Fleet CSPs | They vary. PythonOnline, R, livelier and ManimOnline allow `connect-src https:`; pages, GnuplotOnline and AudioOnline list hosts; all seven limit `frame-src`; modl sets neither. None found in `index.html` for sheets and apptron (check staged output) | Direct mode means per-site CSP work; AI host mode needs one `frame-src` |
| Kit entry point | `src/index.js` re-exports every module eagerly | AI gets its own entry point so non-AI consumers load nothing new |
| `gaitway` local proxy | Reflects any `Origin`, with no authentication, in front of cloud keys | Any visited site could try to spend those keys. It can't be a listed route until origins are restricted |

Storage probe: `ai.hashbin.page` wrote at top level, then an iframe of it read under each embedder. All hosts were
Playwright routes, so this is a local simulation.

| Engine | Same-site embedder (`python.hashbin.page`) | Cross-site embedder (`curtcox.github.io`) |
| --- | --- | --- |
| Chromium, partitioning restored | localStorage, IndexedDB and Cache all shared | All partitioned |
| Playwright WebKit | localStorage shared; IndexedDB and Cache **not** shared | localStorage shared; IndexedDB and Cache not shared |
| Firefox | **Did not run** (`Could not find profile folder`) | **Did not run** |

Playwright WebKit is not Safari. Real Safari and Firefox must be measured before relying on this (Phase 0).

### Reported by others, not tested here

| Claim | Source quality | Treatment |
| --- | --- | --- |
| Jev: `POST /api/alpha/decisions`, question types `choice`, `score`, `noul`, `box`; typed answers with probabilities; text and PNG/JPEG input; $0.042 per million input tokens, output free | OpenRouter's post, and working use in `The-Last-Evolution/tools/ask.mjs` | Adopted as the kit's decision schema. The path says *alpha*, so it stays behind a driver |
| OpenRouter OAuth PKCE issues a user-controlled key billed to the user; keys can carry `limit`, `expires_at`, `usage_limit_type`; callbacks must be HTTPS or localhost | OpenRouter docs. Limits are documented on `POST /auth/keys/code`; support on the `/auth` page is unconfirmed | Phase 0 confirms the browser flow |
| OpenRouter's Jev post advises keeping keys server-side, while its OAuth guide allows browser storage | Both first-party | These are the user's own keys in their own browser, shown with a clear warning |
| Claude Pro/Max OAuth is limited to Claude Code and Claude.ai; enforcement reported in 2026 | Press and blogs, some conflicting on the Agent SDK | Not used. Recheck official terms before any change |
| OpenAI staff publicly welcomed Codex subscriptions in third-party harnesses | Press; no documented client registration found | Not used until there is a documented flow |
| Chrome 142+ asks permission before public pages reach localhost | Chrome docs | Local routes need a clear prompt message. Safari and Firefox unknown |
| Transformers.js has `env.fetch`, `env.customCache`, `env.allowRemoteModels`, `env.remoteHost` | Official docs | Candidate engine |
| wllama (MIT) loads GGUF, supports split files, has a 2 GB per-file limit, and needs COOP/COEP only for threads; `n_threads: 1` forces single-thread | Project README. Blob input not confirmed | Candidate engine |
| WebLLM needs precompiled MLC models; MediaPipe LLM is in maintenance mode | Secondary sources | Not first choices: they fit arbitrary 256t weights poorly |
| OpenJev follows Jev's request and response shape but needs a large GPU (about 54 GB, non-commercial licence) | Model card | Reachable as a self-hosted decision server, not in a browser |

From this project's own use of Jev (`The-Last-Evolution/review/models.md`): decision models give no reasons, a yes/no
score runs low on long descriptions, and asking as a *choice against decoys* worked far better. §8 and §11 use this.

## 3. Decisions

| # | Decision | Source |
| --- | --- | --- |
| D1 | **The kit supports three connection modes: AI host, direct and gateway. Each deployment picks.** | owner, 2026-11-08 |
| D2 | **256t names the weights and any mirror may serve them.** Every shard is verified by hash, so hosts need no trust. | owner, 2026-11-08 |
| D3 | **Evaluation results stay local unless explicitly published** as a 256t report that any page can open and compare. | owner, 2026-11-08 |
| D4 | **Python Online is the pilot** after the Fragment Notes demo. | owner, 2026-11-08 |
| D5 | One API for all modes. A site's choice of mode changes configuration, not its code. | proposed |
| D6 | Jev's question and answer shape is the kit's decision schema; other routes adapt to it. It is already a de facto standard (OpenJev copies it). | proposed |
| D7 | A model proposes; only a user action applies. No model call, download or spend ever starts from loading a link. | proposed |
| D8 | Weight files and manifests are data. **Engines are vendored, pinned and allowlisted, and are never loaded from a CID or link**, because that would run linked code. | proposed |
| D9 | No credential enters a URL, document, draft, eval report or kit storage on an app origin. Direct mode keeps keys in memory only. | proposed, extends the existing rule |
| D10 | AI is opt-in by config. With no `ai` config, the kit renders nothing, frames nothing and makes no AI request. | proposed |
| D11 | Scores are never faked. Emulated decisions report `probabilities: null`, and the UI shows no confidence for them. | proposed |
| D12 | Consumer subscriptions are reused only through paste handoff until a provider documents a third-party flow. Tokens are never extracted from another product. | proposed |

**Vocabulary.** A *connection* is how the kit reaches credentials and remote calls (host, direct, gateway). A *route*
is who answers (OpenRouter, OpenAI, a browser model, paste). A *model ref* is a stable name such as
`openrouter:typesafe/jev-1.14` or `256t:<manifest CID>`.

## 4. Architecture

```
 Page UI      Ask panel · sample chooser · AI settings · Compare models
                 │
 Features     change requests (propose/apply) · chooser · evaluation
                 │
 Client       createAi(): generate() · decide() · models() · budget ledger
                 │
 Connection   ┌─ host ──────┬─ direct ─────┬─ gateway ─────┐   paste handoff is
              │ iframe on   │ this page,   │ site's server │   available in all,
              │ own origin  │ memory only  │               │   needs no connection
              └──────┬──────┴──────┬───────┴───────┬───────┘
 Drivers      OpenRouter · OpenAI · Anthropic ·    gateway protocol
              OpenAI-compatible · browser engines
```

New files. AI has its own entry, `src/ai/index.js`, not re-exported from `src/index.js`.

```
src/ai/
  index.js  client.js  models.js  budget.js  prompts.js
  connections/  host.js  direct.js  gateway.js  paste.js
  drivers/      openrouter.js  openai.js  anthropic.js  openai-compatible.js  decisions.js
  browser/      manifest.js  weights.js  engine.js  worker.js
  change/       propose.js  apply.js  diff.js
  chooser.js
  ui/           ask-panel.js  settings.js  compare.js  ai.css
  eval/         suite.js  checks.js  runner.js  metrics.js  report.js
  host/         host.html  host.js
tools/          model-manifest.mjs  ai-eval.mjs  stage-ai-host.mjs
testing/contract/  ai-change  ai-credentials  ai-decisions  ai-models  ai-eval  ai-mobile (.spec.js)
testing/fixtures/  mock-ai.mjs
```

Client sketch. The contract goes into `docs/contracts.md` before the code changes.

```js
const ai = await createAi({ config, type });
await ai.models({ capability: 'generate' });
await ai.generate({ model, messages, schema, maxTokens, signal, onText });
                                       // → { text, json, usage, cost, finish, timing, model, provider }
await ai.decide({ model, state, questions, signal });
                                       // → { answers, usage, cost, timing, model, source: 'native' | 'emulated' }

const change = createChangeRequests({ ai, type, getSnapshot, getFingerprint, onApply });
const proposal = await change.propose({ request, model, signal });
change.apply(proposal); change.undo(); change.cancel();

await chooseSample({ ai, catalog, request, model, signal });   // → ranked options
await runEval({ ai, suite, models, repeats, budget, signal, onProgress });
```

## 5. Connection modes

Each deployment declares its mode by origin, because one app can have both a canonical and a recovery deployment:

```json
"ai": {
  "deployments": {
    "https://python.hashbin.page/": { "connection": "host", "host": "https://ai.hashbin.page/v1/" },
    "https://curtcox.github.io/PythonOnline/": { "connection": "direct" }
  },
  "routes": ["openrouter", "openai", "anthropic", "gemini", "browser", "paste"],
  "defaults": { "generate": "openrouter:…", "decide": "openrouter:typesafe/jev-1.14" }
}
```

An origin with no entry gets paste handoff only, and says so. Invalid config throws, like every other kit config error.

| | AI host | Direct | Gateway |
| --- | --- | --- | --- |
| Who holds keys | A separate static origin, which the app can't read | This page's JS memory; gone on reload | The site's server |
| Reconnect | Rarely | Every load | Site's `getAuthorization()` hook |
| Site CSP | `frame-src` for the host | `connect-src` for each enabled provider; for browser models also `'wasm-unsafe-eval'` and `worker-src` | `connect-src` for the gateway; browser models as in direct |
| Browser models run | In the host frame | A Worker on the app origin | A Worker on the app origin, if enabled |
| Downloaded weights | Shared across `*.hashbin.page` in Chromium, per app in Playwright WebKit | Per origin | Per origin |
| Site must also | Be on the host's allowlist | Nothing | Run a conforming server |
| Weakness | One more deployment and a shared point of trust | Same-origin scripts could read a key while it is in memory | Prompts cross the site's server; cost and terms sit with the site |
| Suits | Fleet canonical sites | Recovery copies; apps with no host | Organizations or managed billing |

### 5.1 AI host

- **What it is.** A small static page built from `src/ai/host/` and deployed at a version-pinned path. No server, no
  third-party scripts. Anyone can deploy one. We would run `ai.hashbin.page` (the name doesn't resolve today), added
  to hashbin.org's owned-app registry through a separate PR there.
- **Protocol.** The kit creates the iframe and opens a versioned `MessageChannel`. Requests carry capabilities, never
  keys. Streaming and abort use the same port.
- **Boundaries.** `frame-ancestors` lists exact app origins, not `*.hashbin.page`. `event.origin` is checked again and
  each app origin gets its own consent and budget. Preview hosts and `hashbin.app` run origins are never allowed.
  The shared `curtcox.github.io` origin can't be split by path, so it uses direct mode.
- **Frame permissions.** The kit sets `allow="webgpu; local-network-access"`; Phase 0 confirms these are required.
- **Connecting.** Sign-in and key entry happen in a top-level host popup opened synchronously in a click, as HashBin
  Publish does. If the iframe can't see the stored key, the popup passes it over a `MessagePort` for this session
  and the UI says it won't persist.
- **Integrity.** Iframes can't use SRI. Host versions are immutable paths with published hashes, and new versions
  are explicit config changes in each app.
- **Failure.** If the host is unreachable or blocked, the error is visible. Paste handoff still works. The kit never
  silently falls back to direct mode.

### 5.2 Direct

- Keys live in one closure in memory. No kit storage API receives them; `ai-credentials.spec.js` plants a probe key
  and scans localStorage, sessionStorage, IndexedDB, Cache Storage, URL, history and drafts for it.
- OpenRouter sign-in uses a popup in the click. The callback reaches the app with `?code&state`, which `scrub` already
  strips. A new `ai.handleCallback()` runs before `urlState.parse`, checks `state`, sends the code to the opener and
  closes. A redirect flow isn't offered, since it would lose the in-memory PKCE state.
- The UI warns once that a pasted key is exposed to any script running on this page.

### 5.3 Gateway

- The kit ships a client, a mock and a **conformance suite**, not a server: `GET /v1/models`, `POST /v1/generate`
  (server-sent events), `POST /v1/decide`, typed errors, and required `usage` and `cost` fields.
- `getAuthorization()` is supplied by the site and must return a short-lived header. The kit never persists it.
- A HashBin-billed gateway is one possible implementation. It needs its own plan in hashbin.org because of its
  server runtime, cost controls and terms.

## 6. Routes and account reuse

### 6.1 Model catalog

`ai.models()` merges the site's recommendations, the user's added models, and live lists where available (OpenRouter's
`/api/v1/models` is public and CORS-open). Each entry records capabilities, context size, prices, where data goes and
whether the ref is pinned. An alias such as `~typesafe/jev-latest` works but is labeled as not reproducible.

### 6.2 What each account type gets

| The user has | Route | Experience | Evidence |
| --- | --- | --- | --- |
| OpenRouter account | `openrouter` | One-click sign-in; billed to their credits; key with limit and expiry where supported; also reaches Jev | CORS tested; flow in Phase 0 |
| OpenAI API account | `openai` | Paste key | CORS tested |
| Anthropic API account | `anthropic` | Paste key | CORS tested with the required header |
| Google AI key | `gemini` | Paste key; OpenAI-compatible endpoint | CORS tested on an error response |
| Ollama, LM Studio, self-hosted Jev-compatible server | `local` | Base URL, no account; browser permission prompt in Chrome | Phase 0, per browser |
| ChatGPT, Claude, Gemini or other chat subscription | `paste` | Copy the prompt, paste it into their own chat, paste the reply back | Needs no CORS, CSP or credentials |
| Nothing, but a capable device | `browser` | 256t model, free after download; data stays on the device | Phase 0 |

**Paste handoff** is the honest route to subscriptions, works on every deployment and plan, and needs no permission
from anyone. The kit builds one self-contained prompt, shows its size, copies it in the click, opens the chosen chat
with `noopener`, and sends the pasted reply through the same validation and review as any other proposal. Its limit
is that it can't automate evaluation, so paste models can be compared only one request at a time.

Provider requests use the app's name for attribution where supported (`X-Title`), and never user or document data.

### 6.3 Budgets

This follows the ledger in `The-Last-Evolution/tools/ask.mjs`: estimate first, refuse past the cap, record the actual
cost. Budgets are per app and per day and month. Every call sets `maxTokens`. An unknown price needs a confirmation.
Provider-enforced limits are used in addition where they exist; a local ledger alone can't guarantee a bill.

## 7. In-browser models named by 256t

The user pastes a 256t string or saved link, in the same way HashBin load works. That string names a **manifest**:

```json
{ "format": "fragment-kit-model", "version": 1,
  "name": "…", "license": { "id": "Apache-2.0", "url": "…" }, "source": "https://huggingface.co/…@<commit>",
  "engine": { "id": "wllama", "format": "gguf" },
  "capabilities": ["generate"], "contextTokens": 8192,
  "requires": { "webgpu": false, "memoryBytes": 4000000000 },
  "files": [ { "path": "model.gguf", "bytes": 1234567890,
    "shards": [ { "cid": "AAAA…", "offset": 0 }, { "cid": "AAAA…", "offset": 67108864 } ] } ],
  "mirrors": [ "https://256t.us/{cid}", "https://256t.org/{cid}",
    { "url": "https://huggingface.co/…/resolve/<commit>/{path}", "ranges": true } ] }
```

- **Manifest loading.** At most 1 MiB, CID-verified, strictly validated. `store.load` is tied to a `DocumentType`, so
  the bounded fetch-and-verify step moves into a shared helper.
- **Shard download.** The CID's size prefix sets a hard byte limit before reading. Each shard is hashed before it's
  stored. Mirrors are tried in order; 404, 429, a hash mismatch or a CORS failure moves to the next. Downloads resume
  by shard, and all shards failing is a visible error naming what was tried.
- **No re-hosting required.** With `ranges`, a shard is a byte range of a commit-pinned file. Hosting on 256t.us stays
  optional: it costs retention (about $0.03/GB/month) plus finite download allowances or requester payment, and 64 MiB
  shards fit its 90 MiB API limit. Hugging Face CDN redirects and range support are checked in Phase 0.
- **Consent.** Before any download, the page shows name, total size, licence, source, free storage, memory needed and
  mirrors. A CID proves the bytes are unchanged, not that the model is good or safe, and the dialog says so.
- **Storage.** A prefixed cache family (`<prefix>-ai-models-…`) kept through `preserveCache`, verified on read, excluded
  from "Available offline", with per-model size and delete controls. `navigator.storage.persist()` is requested in
  the download click.
- **Execution.** Engines run in a Worker with weights supplied by the kit. Engine network access is disabled or
  redirected, so nothing bypasses verification. WebGPU first, then single-thread WASM. Apps aren't cross-origin
  isolated, so threads aren't assumed. Out-of-memory and device-loss errors are reported plainly.
- **Tooling.** `tools/model-manifest.mjs` takes a local file or a commit-pinned URL and writes the manifest and shard
  CIDs. Publishing the manifest uses ordinary HashBin Publish, since it is a small document.
- **Links.** A link can *suggest* a model with `?model=<cid>`. The page shows the suggestion with its size. It never
  downloads automatically or replaces the user's default. An invalid value is a visible error and the document still
  loads. Model choice is a per-device preference and doesn't enter the envelope.

## 8. Decision models

`ai.decide` uses Jev's shape: `state` (text or text and image parts) and named `questions` of type `choice`, `score`,
`noul` or `box`.

| Route | Behavior | `source` |
| --- | --- | --- |
| Jev through OpenRouter, pinned to `typesafe/jev-1.14` | Direct | `native` |
| Self-hosted Jev-compatible server | Same request, different base URL | `native` |
| Any LLM with JSON output | Schema-constrained answer; no probabilities | `emulated` |
| In-browser decision model | Phase 0 question: stock llama.cpp is reported not to produce decision scores, though wllama links a decision demo | to be determined |
| No model at all | The gallery's existing text search | not AI |

### Choosing a gallery sample

`chooseSample` is the first decision feature, and also a template for sites' own questions.

1. The site's catalog already has `id`, `title`, `description` and `tags`. It adds an optional `useCases` field.
2. Only card text is sent, never whole documents. Cover images are off by default and downscaled if enabled.
3. Large catalogs are narrowed first by text search. Phase 0 measures the practical option limit.
4. The result is a ranked list with probabilities when native. The top pick is marked, and if confidence is low the
   page says none is a clear match. Because decision models give no reasons, **the UI shows the sample's own
   description and invents no explanation**.
5. Each result uses the normal gallery `Open` link. Nothing navigates automatically and normal search remains.

It appears on `gallery.html` and on a new or default document ("What do you want to make?"). A follow-up action,
"Start from this and apply my request", feeds the chosen sample into §9.

Later candidates: routing a request between edit, question and sample; choosing a cheaper or stronger LLM.

## 9. Change requests

1. **Snapshot.** Capture `getSnapshot()` and `getFingerprint()`. Show what will be sent, its size, and where it goes.
   In-browser routes say "stays on this device". Consent is remembered per route and per app, and the size limit is
   enforced before sending.
2. **Prompt.** A versioned kit template plus the site's `type.ai.describe`. The document is marked as data, not
   instructions. The template's hash is recorded with results.
3. **Output.** One of two formats, chosen by the site:
   - `edits` (default): `{ summary, edits: [{ path?, find, replace }], settings? }`. Every `find` must match exactly once,
     otherwise the proposal fails visibly and offers a retry.
   - `full`: the whole normalized document, for small documents or formats where edits are unreliable.
4. **Validate.** Apply to the snapshot, then run the app's strict `type.normalize`, the 5 MiB bound and optional
   `type.ai.validate`. Invalid output goes back to the user as an error, never into the editor.
5. **Review.** Show the summary, a text-only diff and optional `type.ai.renderProposal`. Nothing has touched the editor,
   URL, draft or history yet.
6. **Apply.** On Accept, compare fingerprints, as `HashBinPanel.commit` does. If the document changed, try to reapply
   `edits`; if that fails, say so and offer to regenerate. Then call the site's `onApply`, which uses the same path as
   a normal edit, including revision guards and drafts.
7. **Undo.** A new `urlState.commit(doc)` adds one history entry per accepted change (`write` still uses `replaceState`
   for keystrokes), so Back works, as well as an in-session Undo button. The draft contract gets a test for this.
8. **Refine.** Refinement continues from the proposal, and the conversation stays in memory. Prompts don't enter the
   envelope or shared links in this release.

**Concurrency.** Generation runs under an abort signal and a revision guard. Navigation or an explicit load cancels it and
drops any late result. Typing doesn't cancel it, and instead marks the proposal as based on an older version.

**Prompt injection.** Documents can arrive from untrusted links, so a model may be manipulated by the content it reads.
So proposals are never auto-applied or auto-run, are rendered with `textContent` only (no Markdown, HTML or remote
images, which could leak data through image URLs), and the first release gives models no tools. Running proposed code
is a user action through the consumer's existing sandbox (`type.ai.tryProposal`), and PythonOnline's opaque
sandbox stays the default for it.

## 10. User interface

The new primary flow is *describe → review → accept*. Editing stays available at all times.

| Surface | Change |
| --- | --- |
| Header | New **Ask** action, kept visible on phones. `compactShell` consumers get a mountable button |
| Workspace | Ask panel as a tab through `mountMobileTabs`: `Write · Read · Ask · Split`. Sites with other layouts use a dialog from `createDialog` |
| Ask panel: compose | Request box, model picker showing data destination and estimated cost, Send and Cancel |
| Ask panel: progress | Streamed text in a status area, never in the document; elapsed time and spend |
| Ask panel: review | Summary, diff, optional preview, **Accept**, **Refine**, **Reject**, **Try** (only if the site offers it) |
| Compare | One request across 2–4 models, shown blind, feeding §11 |
| Paste flow | **Copy prompt**, **Open chat**, paste box, then the normal review |
| New or default document | "What do you want to make?" with sample results (§8) |
| Gallery page | Same box above search and tag filters |
| More → AI settings | Connection status, connect and disconnect, masked keys never shown again, budgets, added models and storage use, data destinations, Compare models |
| Site option `ai.layout: 'ask-first'` | Opens on Ask for pages whose users don't want to read source. Source remains one tab away |

**Rules.** Unified, wrapping diff at phone width. 360 px with no horizontal scroll, 44 px targets and `--fk-*` tokens
as elsewhere. Screen readers get `role="status"` updates at state changes, not per token. Short outcomes use
`data-fk-primary-status`. Errors say what to do: reconnect, add credit, wait, or choose a smaller model. AI UI never
overlays a working editor. Nothing opens a frame or a connection until the user first opens Ask, unless a site asks to preconnect.

## 11. Evaluation

Each page can answer "which model is best at making changes *here*, for how much?" with evidence specific to that page.

### 11.1 Suites

A suite is a data-only JSON document with its own CID. The site supplies it, and a user can add local cases.

```json
{ "format": "fragment-kit-eval-suite", "version": 1, "app": "python",
  "cases": [
    { "id": "add-title", "kind": "change", "base": { "src": "…" }, "request": "Add a title to the plot",
      "checks": [ { "type": "valid" }, { "type": "contains", "text": "title(" },
                  { "type": "unchangedFields", "fields": ["settings"] }, { "type": "site", "name": "runsAndOutputs", "expected": "…" } ],
      "reference": { "good": { "src": "…" }, "bad": { "src": "…" } } },
    { "id": "pick-sample-1", "kind": "decision", "question": { "type": "choice", "options": ["…"] },
      "state": "I want to chart monthly rainfall", "expected": ["plotting-basics"] } ] }
```

### 11.2 How results are scored

| Tier | Method | Treatment |
| --- | --- | --- |
| Structural | Output applies and passes `normalize` and `validate` | Always runs |
| Declarative | `contains`, `notContains`, `regex`, `fieldEquals`, `unchangedFields`, `maxChangedRatio` | Data only |
| Site | Named functions in `type.ai.checks`, such as running code in the sandbox and comparing output | **Referenced by name; a suite can't carry code** |
| Judge | A decision model asked to choose the request this change fulfils, among the real one and decoys | Reported separately. Counts only with calibration, below |
| Human | Blind side-by-side choice, with models revealed afterwards | Stored locally as preference votes |

**The checks get checked too.** Every change case has a known-good and a known-bad reference. CI requires the good one to pass and
the bad one to fail. The same references calibrate the judge, whose accuracy on them is shown in the report. If it can't
separate them, its results for that suite are hidden.

### 11.3 Metrics

| Applies to | Metrics |
| --- | --- |
| Change models | Success rate with a Wilson interval and N; valid-output rate; unrelated changes; edit size; agreement across repeats; refusals |
| Decision models | Accuracy and top-2; Brier score and log loss for native probabilities only; calibration; repeat agreement |
| All | Cost per case and **per success**; time to first output and in total; failures by type |
| In-browser | Download size, load time, tokens per second, runs out of memory or not; coarse device class |
| Real use, local only | Accepted, rejected, or edited soon after accepting |

**No false winners.** There is no composite score. The table sorts by success, then cost per success. A model is called best only
when its interval separates from the others; otherwise it says "not enough evidence to separate these", with an
offer to add repeats and the cost of doing so. Filters include "stays on this device" and "under $X per success".

### 11.4 Runner

- The same code runs in the page and in Node (`tools/ai-eval.mjs`).
- Before anything runs, it shows calls, estimated cost and data destinations, and refuses to pass the budget. A
  run stays within the cap, and paid runs need a click.
- Runs resume from a local log keyed by suite CID, case, model, repeat and prompt hash. Stopping keeps results.
- Hosted models run with bounded concurrency, browser models one at a time.
- **Compare on my request** runs a real request across several models for blind review. The user can save it as a
  local case, with a warning that it contains their document.

### 11.5 Reports

- Reports contain suite CID, model refs **as resolved by the provider**, provider, parameters, prompt hash, kit and
  engine versions, date and per-case results.
- Reports stay local by default. **Publish** uses HashBin Publish in the click, as usual, and shows exactly what's included. User
  cases are left out unless explicitly chosen; keys and account data are never in a report.
- Any page can open reports by CID and compare them. A published report is labeled **self-reported**, since a CID
  proves the report is unchanged, not that its numbers are true. Reports are bounded, strictly validated and rendered as text.
  **Rerun this** repeats the comparison with the user's own models.
- Reports that used different suites or prompts are shown separately. Aliased models are flagged as not reproducible.

## 12. Who supplies what

### 12.1 What the kit gives each library

| Library | The kit supplies | The kit requires |
| --- | --- | --- |
| In-browser engines (wllama, Transformers.js) | Verified weights through `env.fetch` and `customCache`, or Blobs; pinned WASM and JS paths; a Worker; abort; WebGPU or single-thread choice; progress and memory reports | No network access of its own, no unverified weights, exact version vendored with licence and listed in `vendor/integrity.json` |
| Jev and Jev-compatible servers | Text or image state; typed `questions`; pinned model; key through the connection; timeout; budget check | Typed answers; unknown shapes fail visibly. Reasons are never assumed |
| Hosted LLM APIs | Messages, JSON schema, `maxTokens`, streaming, abort, required headers, key through the connection | `usage` where offered; otherwise a marked estimate |
| Gateways | Same operations in the gateway protocol, plus the site's auth header | Passing the conformance suite |
| HashBin SDK (unchanged) | Manifests and reports as ordinary documents; synchronous Publish in a click | Existing rules |
| Consumer sandbox (`createSandbox`, app engines) | Proposed documents, only after a user action or within an eval the user started | Existing isolation; opaque by default |
| Pages and models | `textContent` rendering, bounded output and no tools | Output is always untrusted |

### 12.2 What each existing kit module gains

| Module | Addition |
| --- | --- |
| `core/config.js` | Validate the optional `ai` block; pick by origin, as `redirectUri` does |
| `core/url-state.js` | `commit(doc)`; `model` suggestion on `parse`; added to stale keys for `scrub` |
| `core/cid.js`, `hashbin/store.js` | Shared bounded fetch-and-verify helper usable without a `DocumentType` |
| `ui/shell.js`, `ui/mobile-tabs.js` | Ask action; panel count already supports a third tab, with tests added |
| `gallery/gallery.js` | Optional chooser box; optional `useCases` field |
| `offline/sw-core.js` | `preserveCache` for the model cache; verified read of large shards |
| `tools/check.mjs` | CSP matches the chosen mode; no credential storage in AI code; manifest and suite validation |
| `tools/vendor-sync.mjs` | Optional engine files, so sites without browser models don't carry them |

### 12.3 What each site supplies, and when

| When | What | Required? |
| --- | --- | --- |
| **Writing the app** | `type.ai.describe`: what the document is and its rules | Yes, for change requests |
| | `type.ai.format`: `edits` or `full`; `paths` for multi-file documents | Default `edits` |
| | `type.ai.validate(doc)`: syntax checks beyond `normalize` | Optional |
| | `type.ai.renderProposal(doc, node)`, `type.ai.tryProposal(doc, signal)` | Optional |
| | `useCases` on catalog entries | Optional, improves choosing |
| | Eval suite, with references, and `type.ai.checks` | Yes, to offer evaluation |
| **Configuring** | `ai.deployments`, `routes`, `defaults`, recommended models, `ai.layout`, size limit, suggested budget | `deployments` required |
| | Manifests of any recommended browser model | Optional |
| **Building** | `vendor-sync` with or without engine files; offline allowlist; `npm run check` | Yes |
| **Deploying** | CSP for the mode (§5); exact origin added to the AI host allowlist; gateway URL and server; HashBin client ID for report publishing | By mode |
| **Starting the page** | `getSnapshot`, `getFingerprint`, `onApply`, containers; `getAuthorization` for gateways | Yes |
| **During use** | `change.cancel()` on navigation; route `onApply` through the same path as an edit | Yes |
| **During evaluation** | Sandbox-backed site checks | If the suite names them |

**The user supplies, never the site:** keys or sign-ins, budgets, model choices, and consent for each download and destination.
**Sites must never embed a shared key.** `check.mjs` can flag obvious key patterns, but this is a rule more than a guarantee.

## 13. Security rules

These go into `docs/contracts.md` and `AGENTS.md`.

1. Loading a link never calls a model, downloads weights or spends money.
2. No key in any URL, document, draft, report, log or kit storage on an app origin.
3. Model output is untrusted: bounded, validated by the app's strict `normalize`, rendered as text, and never auto-applied or auto-run.
4. Weights are verified by hash before storage and when read. Engines are vendored and allowlisted, never loaded from a manifest.
5. Every paid call has a pre-call estimate, a `maxTokens` limit and a budget check.
6. All storage and cache names are prefixed, including on the AI host.
7. Data destinations are shown before sending, per route and per app.
8. Suites, manifests and reports are data: bounded, strictly parsed, and unable to carry code.
9. AI host access is limited to exact origins with per-origin consent. No silent mode fallback.

## 14. Testing

- **Unit (`npm test`).** Schemas, budget, prompt hashing, edit application, diff, manifest parsing, shard and mirror
  logic, drivers against recorded responses, metrics and Wilson intervals, hostile suites and reports.
- **Contract (`npm run test:browser`).** A mock provider (`mock-ai.mjs`) and a test engine. `ai-change`: stale proposals,
  navigation during generation, undo, drafts. `ai-credentials`: the probe-key scan. `ai-decisions`: chooser, emulated
  labels. `ai-models`: mismatch, mirror fallback, resume, consent. `ai-eval`: resume, budget stop, reports.
  `ai-mobile`: 360 px, keyboard, tabs. All three connection modes run the same feature specs.
- **Reference checks in CI.** Every suite's good and bad references, with no network.
- **No paid or live model calls in CI.** Live runs are manual, with a capped key and an approved budget. Their evidence
  is recorded with date and browser.
- **Reporting.** As with existing work, only browsers that actually ran are reported, and WebGPU coverage is stated
  separately since CI runners may lack it. A real-GPU smoke test is a manual, recorded step.
- **After runtime changes.** `npm test`, `npm run check`, `npm run test:browser`, `npm run demo`.

## 15. Phases

Each phase ends with green tests and a CHANGELOG entry, and consumers are unaffected until they add `ai` config.

| Phase | Work | Done when |
| --- | --- | --- |
| **0. Evidence** | Real Safari and Firefox storage; success and streaming responses with a capped key; OpenRouter popup flow and key limits; Jev on a real gallery; option limits; engine weight-injection spike that picks the first engine; `allow` attributes; Hugging Face ranges and redirects; `localhost` from HTTPS per browser | Results recorded here, and §2 corrected. **Needs an owner-approved test budget and key** |
| **1. Contracts and core** | `docs/contracts.md` section; `src/ai/` entry, schemas, budget, prompts, edit apply, diff, `mock-ai`, config validation, `urlState.commit` | Unit tests pass with no UI |
| **2. Ask flow, paste and direct** | Ask panel, review, undo; paste route; direct mode with OpenRouter; Fragment Notes `type.ai` | Someone can describe a change in the demo, review it and undo it, in three engines and at 360 px |
| **3. Providers and decisions** | OpenAI, Anthropic, Gemini, local; `ai.decide`; Jev driver; emulated decisions; `chooseSample`; settings; budgets | Demo gallery picks samples, with fallback and honest labels |
| **4. Evaluation** | Suites, checks, runner, metrics, Compare UI, reports, `tools/ai-eval.mjs`, demo suite | Demo compares mock models end to end; a live manual run is recorded |
| **5. AI host** | Host page, protocol, consent, stage tool; hashbin.org registry PR for `ai.hashbin.page`, deployed with owner approval | Credential spec passes on host mode; deployment verified live, and recorded as such |
| **6. Browser models** | Manifest, weights, engine, `model-manifest.mjs`, storage UI, `?model=` suggestion | A real model named by a 256t string runs in at least one real browser, from at least two mirrors with one failing |
| **7. Gateway** | Client, protocol doc, conformance suite | Mock gateway passes the same feature specs |
| **8. Python Online pilot** | `type.ai`, sandbox-backed checks, 20–30 case suite, deployment choice per origin, PR in its repo | Live comparison of at least three models, including one on-device if practical, with a published report |
| **9. Release** | `v0.4.0` through the normal release; pin the demo; docs; `AGENTS.md` | Tag and release exist remotely; status docs describe actual remote state. Tags never move |

Phases 2 to 4 deliver value with no new deployment. Other consumers adopt by choice afterwards, each with its own PR.

## 16. Risks and open items

| Item | Plan |
| --- | --- |
| Jev's endpoint is `alpha` | Driver boundary, pinned model, schema checks, recorded fixtures; LLM emulation stays available |
| Provider CORS can change without notice | Errors name the route and suggest paste or another mode; Phase 0 evidence is dated, and a manual probe is kept in `tools/` |
| Same-site sharing depends on `hashbin.page` staying off the Public Suffix List | Adding it would partition the host's storage across apps. Check before any PSL submission; host mode already has a per-session fallback |
| Safari may isolate host storage per app, or evict it | Measured in Phase 0; UI states when a model or key won't persist |
| Large downloads on phones | Consent shows size and memory; device check before download; manifests declare requirements |
| Weights exceed device memory or crash a tab | Worker isolation, a recorded failure state and no auto-retry |
| Model licences vary | Manifests must declare one; shown at consent. The kit doesn't vouch for accuracy |
| Local ledger undercounts | Described as a guard, not a guarantee; provider limits are used where available |
| `gaitway` accepts any origin without authentication | Stays off the listed routes until it restricts origins |
| Hosted model output quality on real documents | Exactly what §11 is for: nothing here assumes a particular model is good enough |
| Default budgets, default recommended models | Decide in Phase 3 from Phase 0 costs |
| Whether to build a HashBin-billed gateway | Separate owner decision after Phase 7; needs its own plan in hashbin.org |

## 17. Definition of done

- A site can enable AI through config, choose any of the three connection modes per deployment, and pass the shared contract specs in each.
- A user can name a model by 256t string and run it verified in a browser, sign in with OpenRouter, use their own API
  keys, and use any chat subscription through paste handoff.
- A decision model can rank gallery samples, with a working non-AI fallback and no invented confidence.
- A user can describe a change, review a diff, accept it, and undo it, on desktop and at 360 px, and no link can trigger
  any of this by itself.
- Each adopting page offers evaluation with objective checks, cost and latency, and doesn't declare a winner without evidence.
- Python Online has shipped this in production, with live evidence recorded. Each browser that ran is named.

## Sources

- [OpenRouter on Jev](https://openrouter.ai/blog/insights/what-is-jev/)
- [OpenRouter OAuth PKCE guide](https://openrouter.ai/docs/guides/overview/auth/oauth), [authorization code API](https://openrouter.ai/docs/api/api-reference/oauth/create-authorization-code.md)
- [Simon Willison on Anthropic's browser header](https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/)
- [The Register on Anthropic's third-party terms](https://www.theregister.com/software/2026/02/20/anthropic-clarifies-ban-on-third-party-tool-access-to-claude/5014546), [conflicting summary](https://autonomee.ai/blog/claude-code-terms-of-service-explained/)
- [Chrome Local Network Access](https://developer.chrome.com/blog/local-network-access)
- [Transformers.js `env`](https://huggingface.co/docs/transformers.js/api/env), [wllama](https://github.com/ngxson/wllama), [OpenJev](https://huggingface.co/AlquimiaAi/openjev)
- [Browser inference overview, secondary](https://tianpan.co/blog/2026-04-17-browser-native-llm-inference-webgpu), [open Jev alternatives, secondary](https://www.datacamp.com/blog/top-open-source-jev-alternatives)
- [Public Suffix List](https://publicsuffix.org/list/public_suffix_list.dat)
- Local: `hashbin.org/docs/API.md`, `browser-client-safety.md`, `owned-app-hosting.md`, `hosted-run-origin.md`; `The-Last-Evolution/tools/ask.mjs`, `review/models.md`; `curtcox/gaitway` `server.py`
