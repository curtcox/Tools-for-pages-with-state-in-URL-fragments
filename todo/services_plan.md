# Services: HashBin, cronly and subetha, directly or through devicebasedauth.org

Status 2026-11-22 (America/Chicago): **plan only; all decisions made; nothing implemented.** Remote
state below was read from each repository's `STATUS.md`/README on this date and
is not re-verified live.

## Goal

A Fragment Kit client app can use three services, each either **directly** or
**through devicebasedauth.org (DBA)**:

| Service | What an app can do |
| --- | --- |
| HashBin (hashbin.org) | Publish documents and load them by CID (exists today, direct only) |
| cronly (cronly.org) | Schedule jobs, run jobs, edit jobs, view job results |
| subetha (subetha.org) | Send messages, receive messages |

Plus the features and documentation each service needs, and a pilot in
**Pages Online**.

## Decisions (owner-confirmed 2026-11-22)

| Topic | Decision |
| --- | --- |
| Where DBA device keys live | In a new **DBA-hosted frame** on devicebasedauth.org. The app never holds a device key, credential or DPoP proof. It asks the frame to make requests over a MessagePort, with consent per app origin |
| "Directly" for cronly | **New cronly feature:** an OAuth (authorization code + PKCE) popup that gives short-lived, scoped tokens. The kit keeps them only in memory. subetha uses its existing Clerk OAuth (`workers/api/src/oauth.ts`) and publishable tokens. HashBin keeps its SDK popup |
| Isolation | **Both kinds, chosen by the app's code and config, not by the user.** By default an app gets its own namespace (`<slug>`). An app can declare shared namespaces when its purpose needs them. Consent screens show what was requested, and the server enforces it |
| Scope | Kit, the four services, the demo, a kit release, and **one pilot: Pages Online** |

## Facts this plan depends on

- **Origins.** Canonical apps each have their own origin
  (`https://pages.hashbin.page/`). Recovery copies all share
  `https://curtcox.github.io/`, so anything stored on a recovery origin is open
  to every app there. `*.hashbin.page` apps are one site, so third-party
  storage partitioning puts all of them in one partition.
- **DBA** has been live since 2026-11-22, with payments closed until
  `DBA_LAUNCH_APPROVED`. Browser SDK v1.4.0 keeps a non-extractable P-256 key in
  IndexedDB on *the origin that runs it* (`new DBA({name})` keeps one key per
  name). Credentials are JWS + DPoP with server nonces. Grants already support
  `resources` prefix patterns (`job:pages/*`). devicebasedauth.org sends
  `frame-ancestors 'none'` and `X-Frame-Options: DENY`. OIDC is at
  `/oauth/authorize` and `/oauth/token`.
- **HashBin** (S24/S25 🟨, code on `main`): accepts `Authorization: DBA` + DPoP
  with `hashbin:<scope>` actions, gives DBA requests CORS from any origin, and
  takes uploads at `POST /api/content` (`content:write`). Remaining owner steps:
  register the webhook, fund the operator account, run the live check.
- **cronly** (S5 🟨): accepts DBA credentials (`cronly:read|run|change|prose|secrets:write`,
  `cronly:session`) with any-origin CORS. Grants limited by `resources` **fail
  closed** today. Clerk sessions and `crk_` keys get no CORS. Trigger tokens
  (`/hook/*`) are the only browser credential that works from other sites.
  Production is prelaunch: **payments, automatic deploys and public
  JavaScript are disabled**. Supports `dry_run=1` and `/api/quote`. Runs are at
  `GET /api/runs` and `GET /api/runs/:id`.
- **subetha** has no DBA support yet (PLAN.md open question 1). It has its own
  Ed25519 device enrollment, `se_` tokens, origin-bound publishable tokens and
  Clerk OAuth for publish+subscribe with a per-client daily cap. Its OPTIONS
  handler sends `allow-headers: *`, which per Fetch does **not** cover
  `Authorization`. Topic names have one segment (`@handle/name`, name
  `[A-Za-z0-9_-]{1,64}`), and scopes allow only `@handle/*` or an exact topic.
  Supports `X-Dry-Run: 1` estimates.

## Design

### Kit: a separate opt-in entry point

`src/connect/index.js` is a new entry point. Like AI, the ordinary kit entry
never imports it. Without `config.services`, the kit creates no frame, popup,
control or request.

**Invariants.** These follow the AGENTS.md rules for AI and HashBin.

- Loading a link never contacts DBA, cronly or subetha, and never schedules,
  runs or sends anything. A document may *carry* a job definition or a message
  draft, but only an explicit user action applies it.
- Tokens, credentials, proofs and keys stay out of app-origin storage, URLs,
  documents, drafts, the library, reports and logs. Direct OAuth tokens live
  only in a closure for the tab's lifetime.
- Before consent, the app shows where data goes: exact service origins, the
  namespaces, the scopes, and whether the request is direct or through DBA.
- Every paid call (cronly run, save or test; subetha send) is quoted first with
  the service's dry run or quote and needs an explicit click. The kit's ledger
  (reusing `src/ai/budget.js`, prefixed storage) is only a guard. The services'
  own caps do the enforcing: the DBA grant's `spend_usd_per_month`, cronly's key
  budget, and subetha's token or OAuth daily cap.
- Every response is bounded before decoding. Job results and incoming messages
  are untrusted text: they are rendered as text, never as HTML, never run, and
  never navigated to. They are applied to a document only by explicit action,
  like scanned QR data.
- Host access uses exact origin allowlists (`https://hashbin.org`,
  `https://cronly.org`, `https://subetha.org`, `https://devicebasedauth.org`,
  plus loopback for development). There is **no silent fallback** between
  direct and DBA routes. A failed route shows its error.

**Config** (`validateServicesConfig`, beside `validateAiConfig`):

```json
"services": {
  "dba":     { "frame": "https://devicebasedauth.org/frame/v1/" },
  "hashbin": { "routes": ["direct", "dba"] },
  "cronly":  { "routes": ["direct", "dba"], "clientId": "…", "namespaces": ["pages"], "scopes": ["read", "run", "change"] },
  "subetha": { "routes": ["direct", "dba"], "clientId": "…", "namespaces": ["pages"], "scopes": ["publish", "subscribe"] },
  "deployments": { "https://pages.hashbin.page/": {}, "https://curtcox.github.io/pages/": { "dba": false } },
  "budget": { "day": 0.25, "month": 2 }
}
```

`namespaces` defaults to `[slug]`. Anything else is the app's deliberate
choice, and consent shows it. `"*"` means the whole account and needs an
explicit `"wholeAccount": true`. An empty `clientId` disables direct cronly and
subetha. The kit never invents one, as with HashBin. Recovery deployments
default to `dba: false`, because the frame cannot tell apps on a shared origin
apart (see the DBA decision below).

**Modules**

| Module | Role |
| --- | --- |
| `connect/config.js` | Validation described above |
| `connect/transport.js` | `request({service, method, path, body, signal, stream})`. Picks the route the user connected, applies limits, parses errors without echoing bodies or authorization |
| `connect/oauth.js` | Public-client PKCE popup opened synchronously in a click. The callback is the app's own `redirectUri(config)`, and `urlState.scrub` already strips `code`/`state`. Tokens are in memory only. State and verifier go in prefixed sessionStorage and are used once |
| `connect/dba.js` | Lazy frame and MessagePort client for DBA frame protocol v1. Checks the exact frame origin. Shows the frame's own panel whenever user activation is needed (enrollment, gates, consent), as the AI host does |
| `connect/cronly.js` | `CronlyClient`: `jobs.list/get`, `jobs.save` (schedule/edit, `PUT /api/jobs/:name`, quote first), `jobs.pause/resume/remove`, `run(name, input)` (`dry_run=1` quote, then a confirmed run), `runs.list({job, before, status})`, `runs.get(id)`, `explainCron`. It adds the namespace prefix to names and refuses names outside the declared namespaces. Actions follow the same rules; secrets are never written |
| `connect/subetha.js` | `SubEthaClient`: `send(topic, message)` (`X-Dry-Run` estimate first), `subscribe(topics, {since, signal, onMessage})` over a fetch NDJSON stream (works through the frame; EventSource cannot send headers), `poll`. Bounds each message. Uses namespace topics `@handle/<ns>_<name>`. Signed-message verification shows provenance |
| `connect/hashbin.js` | HashBin publish via the DBA route: `POST /api/content` through the frame, with the same CID verification and snapshot fingerprint checks as `HashBinStore` |
| `connect/ui/*` | Connect/consent dialog. Cronly panel: job list, editor (cron text and `explainCron` preview, next fire times, budgets), Run, run history with result viewer. Messages panel: compose, inbox, topic picker. All text-rendered, 44 px targets, inside the shell's More dialog or tabs |

**HashBin direct** stays exactly as it is today: SDK popup, synchronous
publish in the click. `HashBinPanel` gains a route choice only when
`services.hashbin.routes` includes `dba`.

### devicebasedauth.org: the embeddable frame (new feature)

- Serve `/frame/v1/` (immutable versioned bytes with published hashes, like
  `/sdk/v1.4.0/`) with `frame-ancestors *`. The site's other pages keep
  `'none'`.
- **Protocol v1** over a transferred MessagePort: `hello` (exact parent origin
  from the `message` event), `status`, `connect({audiences, grants})`,
  `request({id, method, url, headers, body})` returning streamed `head`,
  `chunk` and `end`, `abort(id)`, `disconnect`, `forget`. Request IDs, message
  sizes and the number of in-flight requests are all bounded.
- **One key per embedding origin**: `new DBA({name: parentOrigin})`. Revoking
  one app's credential leaves other apps alone. The dashboard labels the device
  by app origin and browser.
- **Enrollment from a frame.** The enrollment request records the embedding
  origin (new `requested_by` field; `return_origin` stays devicebasedauth.org).
  The approval page shows it prominently. The approval popup opens from a click
  inside the frame's own panel.
- **Request policy.** `url` must be on an audience the credential names, with
  that audience's exact origin registered at DBA (hashbin.org, cronly.org,
  subetha.org). Nothing else is reachable. The frame adds `Authorization: DBA`,
  DPoP and confirmation, handles nonce challenges and `gate_pending` (its panel
  shows the wait), and never returns the credential or proofs to the app.
- **Partitioned storage.** Use the partitioned key, which is per top-level site
  and further split per origin by `name`. Optionally ask for the Storage Access
  API (`indexedDB`) where browsers support it. Where storage is unavailable,
  fall back to a session-only key and say so.
- **Shared origins.** The frame sees only `https://curtcox.github.io`, so on a
  shared origin a credential is effectively shared by every app there. The
  consent text must say so. The kit defaults recovery deployments to DBA off.
- Spec `spec/frame.md` with conformance tests. Docs page "Static web apps"
  (frontend/docs). Pricing note: each app origin enrolls its own device (issue
  87 µ$, renew 25 µ$, billed to the user's DBA account). Owner-approved prices
  only.
- Register the **subetha.org audience** and its action catalog (below).

### cronly (new features)

1. **Resource-scoped grants.** Evaluate DBA grants with a resource per route:
   `job:<name>`, `action:<name>`, `run:<job>`, `variable:<name>`. List routes
   filter by the granted prefixes. Then `resources: ["job:pages/*"]` works
   instead of failing closed. Add the same restriction (`name_prefixes`) to
   API keys and OAuth tokens.
2. **Direct OAuth for browser apps.** cronly becomes an OAuth resource server
   with Clerk as the authorization server, mirroring subetha's `oauth.ts`
   (RFC 9068 JWTs or introspection). It also needs: registered public clients
   with exact redirect origins; scopes mapped to `USER_SCOPES`, never
   `secrets:write` or session routes; requested name prefixes; a per-client
   daily cap; a short lifetime. CORS goes only to the client's registered
   origins (exact `Origin` match), which is a deliberate exception to "no CORS
   for exportable credentials", for owner approval. A popup consent page
   shows the app origin, scopes, prefixes and cap.
3. **Results for apps.** Make sure `GET /api/runs/:id` returns a bounded,
   documented result shape (status, timing, cost, truncated output text,
   content type), so app viewers need no other page. Add `GET /api/jobs?prefix=`.
4. **Notify on completion (optional, documented).** A job's HTTP action can
   publish to a subetha topic, with the subetha token kept as a cronly secret
   set by the user in cronly's own UI. This lets an app *receive* results as
   messages.
5. **Docs:** a "Browser apps" guide (both routes, namespaces, quotes, errors),
   OpenAPI regenerated, `llms.txt`, and a STATUS row.
6. **Owner steps that block live use:** finish S5 (migration v4, namespaces,
   webhook, operator funding), open payments, and enable public JavaScript or
   limit the pilot to HTTP actions.

### subetha (new features)

1. **DBA credential kind** (resolves PLAN open question 1), at parity with
   cronly S5 and hashbin S24. Vendor `@devicebasedauth/verify` unmodified with
   hashes. Accept `Authorization: DBA` + DPoP and DBA access tokens. Link
   accounts over DBA OIDC (one DBA account to one subetha account). Use the
   catalog `subetha:publish`, `subetha:subscribe`, `subetha:session`
   (session never reaches token, billing or link management), with resources
   `topic:@handle/<prefix>*`. Map `spend_usd_per_month` onto caller caps. Add a
   revocation webhook, a cross-isolate DPoP replay cache, and an
   online-decision path for gated grants. The native Ed25519 devices stay as
   they are; DBA is an extra credential kind.
2. **CORS:** list `Authorization, DPoP, DBA-Confirmation, Content-Type,
   Idempotency-Key` and the signed publish headers explicitly. Expose cost
   headers. Test preflights from another origin.
3. **Namespace scopes** without changing the topic grammar: allow the pattern
   `@handle/<prefix>_*` in `validateScopes`, `scopeAllows`, OAuth requested
   scopes and publishable tokens. `_` cannot appear in a kit slug, so
   `pages_*` never matches `pages-pro_*`. Clerk OAuth tokens may request
   narrower scopes than whole-account publish+subscribe.
4. **Direct OAuth for kit apps:** register public PKCE clients per app origin
   and confirm Clerk allows public clients with CORS on its token endpoint.
   This is an open verification item; if Clerk can't, add a small token
   exchange on subetha.
5. **Docs:** "Static web apps" (direct OAuth, publishable tokens, DBA),
   namespaces, OpenAPI regenerated, conformance vectors for the new scope
   pattern, and the README status row.

### HashBin

No new features are expected. Acceptance only: a DBA-route upload from another
origin through the frame (preflight, `POST /api/content`, CID equality), after
the S24 owner steps.

### Pilot: Pages Online

- Upgrade the pin from v0.4.3 to the new kit release, with its usual browser
  gates.
- **Cronly panel.** A page document may include a `cronly` section holding a job
  definition (cron text, an HTTP or JS action source, an input sample). It is
  part of the document, so it is shared by link, but it is only *applied* by
  Save to cronly. Actions available: Run now, Pause/Resume, and run history
  with results. Namespace `pages`.
- **Messages panel.** Send to and subscribe to `@handle/pages_<name>`. The
  optional demo shows a job's completion published to subetha and arriving live.
- The live preview iframe gets **no** service access. A bridge to page scripts
  is out of scope and would be a later decision.
- Both routes on the canonical origin. Direct only on the recovery origin.
- Live acceptance needs real accounts and spends real (small) money. Each paid
  step is an explicit owner action, recorded with spend in `rollout-status.md`.

## Phases

| # | Repo | Work | Depends on |
| --- | --- | --- | --- |
| 0 | kit, DBA | Kit `docs/contracts.md` "Services" section draft. DBA `spec/frame.md` | — |
| 1a | DBA | Frame v1, `requested_by` enrollment, subetha.org audience, docs, tests | 0 |
| 1b | cronly | Resource-scoped grants, name-prefix keys | — |
| 1c | cronly | Direct OAuth resource server, origin-bound CORS, consent page, results shape, docs | 0 |
| 1d | subetha | DBA credential kind, CORS fix, namespace scopes, OAuth scopes, docs | — (live DBA use needs the subetha.org audience from 1a) |
| 2 | kit | `src/connect/` against fake DBA frame, cronly and subetha servers (second loopback origin for the frame). Unit, contract and three-browser tests | 0; can run alongside 1 |
| 3 | kit | Demo (Fragment Notes: optional connect panel against fakes in CI), `npm run demo`, contracts/migration/tooling docs, release candidate, then a published release only after gates pass | 2 |
| 4 | services | Deploy 1a–1d. Owner steps: S5/S24 webhooks and funding, Clerk OAuth clients, cronly payments and JS | 1 |
| 5 | pages | Pin upgrade, panels, browser tests with fakes, deploy, live acceptance on both origins | 3, 4 |

Phases 1a–1d and 2 can run in parallel in separate sessions; each lands in its
own repository.

## Further decisions (owner accepted the recommendations 2026-11-22)

| ID | Question | Decision |
| --- | --- | --- |
| D1 | Should the DBA frame be embeddable by any origin, or only by registered app origins? | Any origin, with per-origin consent and per-origin keys, matching DBA's any-origin CORS stance |
| D2 | cronly direct OAuth: Clerk as authorization server, or cronly's own (like HashBin)? Is CORS for origin-bound OAuth tokens acceptable? | Clerk as authorization server (parity with subetha, least code). CORS yes, for exact registered origins only, with a short lifetime and a per-client cap |
| D3 | Recovery origins (`curtcox.github.io`): DBA off, or on with a "shared by every app here" warning? | Off by default; an app may turn it on in config, and consent then carries the shared-origin warning |
| D4 | subetha namespace syntax `@handle/<prefix>_*` vs. a multi-segment topic grammar | The `_` prefix pattern (no topic-grammar change) |
| D5 | Pilot cronly actions while public JS is disabled | HTTP actions first; JS after cronly opens it |
| D6 | Who pays for the frame enrollment per app origin | The user's DBA account, at approved prices, shown on the approval page |

These still need verification during the work: whether Clerk allows public
PKCE clients with CORS on its token endpoint (subetha item 4, cronly item 2).

## Acceptance

- Kit: `npm test`, `npm run check` and `npm run test:browser` (report each
  browser that actually ran), with `npm run demo` regenerated. Tests show that
  loading any link makes zero service requests, that no token, credential or
  proof appears in storage, URLs, documents, drafts, the library or logs, that
  there is no fallback between routes, that namespaces are refused
  client-side and server-side, and that results and messages are bounded and
  text-rendered.
- Each service: its own test suites plus cross-origin browser tests through
  the frame.
- Status describes actual remote state. A prepared release or deploy is not a
  published one.
