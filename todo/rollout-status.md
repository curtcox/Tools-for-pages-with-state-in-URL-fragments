# Rollout status

Latest remote verification: **2026-11-12 (America/Chicago)**. All eleven client editors have shipped opt-in AI on independently verified Fragment Kit **v0.4.3**, with canonical and recovery deployments verified. The older compact-interface and initial migration entries below are historical evidence. Current AI receipts: [Python](ai_acceptance.json), [R](r_ai_acceptance.json), [remaining nine](fleet_ai_acceptance.json).

## Published kit and workflows

- [v0.3.5](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.5) is published at `767849e068e3106593053b5f0eb9b1e9947d7b66`; the [release workflow](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42446729005) passed all three browsers and independent published-demo verification. Current fleet receipts are recorded at the end of this file.

- [v0.3.3](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.3) is published at `aa970dee6a55e072557fa5bb2851dc12d4273676`, with tarball, manifest and SHA-256 sums. Earlier release tags remain unchanged.
- The [release gate](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41933132525) passed 275 unit tests, static/integrity checks, 85 contracts in Chromium/Pixel 7 (34), Firefox (17), WebKit/iPhone 14 (34), and independent published-demo verification.
- v0.3.3 verifies Publish returns against the SDK transaction's original bytes, then compares its parsed document with the restored snapshot. This preserves pre-kit envelope ordering without weakening CID verification. Regressions use the actual pinned SDK, including cancelled returns and substituted content.
- Immutable workflow `v2` remains `5c12e840cbc2229e1d905830204c78bce6b27cc9`; `v1` remains unchanged. Runtime pins are independent exact releases.
- [Docs/demo deployment](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41932883579) succeeded. The demo subsequently moved to v0.3.4; see its published release evidence below.

## Initial consumer migration (2026-11-05)

This table records the initial migration. Current v0.3.5 revisions and deployments are in **Compact UI rollout** below.

| Consumer | Runtime | Actual remote state |
| --- | --- | --- |
| GnuplotOnline | v0.3.3 | [PR #4](https://github.com/curtcox/GnuplotOnline/pull/4) merged as `3e2f27b`; recovery and canonical deployed; live legacy/CID/QR/mobile checks passed on both origins |
| R | v0.3.3 | [PR #3](https://github.com/curtcox/R/pull/3) merged as `9f17446`; registered; recovery/canonical deployed and live Chromium/WebKit acceptance passed, including real offline R and paid Publish |
| PythonOnline | v0.3.3 | [PR #2](https://github.com/curtcox/PythonOnline/pull/2) merged as `4cef804`; recovery and canonical deployed; live legacy/CID/QR/mobile acceptance passed on both; storage-guidance follow-up [PR #3](https://github.com/curtcox/PythonOnline/pull/3) merged as `c7b4177` and deployed on both origins |
| livelier | v0.3.3 | [PR #3](https://github.com/curtcox/livelier/pull/3) merged as `c2ff73d`; registered; recovery/canonical deployed and live Chromium/WebKit acceptance passed, including real offline world execution and paid Publish |
| AudioOnline | v0.3.3 | [PR #2](https://github.com/curtcox/AudioOnline/pull/2) merged as `655dd9d`; registered; recovery/canonical deployed; three-browser CI and live Chromium/WebKit offline synthesis, cache repair and paid Publish passed |
| pages | v0.3.3 | [PR #1](https://github.com/curtcox/pages/pull/1) merged as `77e33d2`; recovery/canonical deployments and live legacy/CID/QR/mobile checks passed |
| ManimOnline | v0.3.3 | PR #8 merged; recovery and canonical deployed; live Chromium/WebKit acceptance passed |
| apptron | v0.3.4 | [PR #13](https://github.com/curtcox/apptron/pull/13) merged as `e7bab10`; registered; recovery/canonical deployed; three-browser CI and live Chromium/WebKit UI/offline repair passed; real Chromium VM and paid redirect Publish passed |
| sheets | v0.3.4 | [PR #1](https://github.com/curtcox/sheets/pull/1) merged as 6e226a2; recovery and canonical deployed; live Chromium/WebKit acceptance passed on both origins |
| modl | v0.3.4 | [PR #1](https://github.com/curtcox/modl/pull/1) merged as 9a8fdb2; recovery and canonical deployed; live Chromium/WebKit acceptance passed on both origins |

## Verification evidence

The first four merged upgrade PRs passed unit, independent published-pin verification and browser gates in Chromium, Firefox and WebKit. Consumer engine suites use the actual engines and existing galleries, in addition to the shared contracts. Python's first Firefox run timed out during a package download; the isolated retry passed the full suite.

- Gnuplot [CI](https://github.com/curtcox/GnuplotOnline/actions/runs/41933944639), [recovery deployment](https://github.com/curtcox/GnuplotOnline/actions/runs/41935875969), [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41935892697). Canonical release.json confirms `3e2f27b88ce031cda3e1c3b1739c4104e4e177c2`, `dirty:false`. Original metadata-first Publish transaction returns pass against the actual pinned SDK.
- R [CI](https://github.com/curtcox/R/actions/runs/41933950693), [recovery deployment](https://github.com/curtcox/R/actions/runs/41935883293). Its independent immutable SDK v0.3.0 execution sandbox/cache verifier remain pinned; Publish uses the kit's v0.4.0. Optional verified packages remain separate from application readiness. Phone input fills its panel and recovery controls meet 44px targets.
- Python [CI](https://github.com/curtcox/PythonOnline/actions/runs/41933934758), [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41936859015). Canonical release.json confirms `4cef8041a172be40aecda7bbdd145357248d0fff`, `dirty:false`. Hosted/opaque execution and local-only persistence permission remain app-owned. Original Publish transactions restore source/input; verified packages remain separate from application readiness.
- Livelier [CI](https://github.com/curtcox/livelier/actions/runs/41933955438), [recovery deployment](https://github.com/curtcox/livelier/actions/runs/41935890852). Kernel, compiler, host and original CSP bootstrap bytes remain unchanged. Fresh asynchronous world snapshots have revision guards before share/save; Publish remains synchronous in the confirm click. Original transaction namespace stays readable.

Live Chromium and WebKit checks passed five harvested legacy URLs, an inline CID, real QR image upload and 360px layout on Gnuplot's recovery/canonical origins, R recovery and Livelier recovery. Actual-origin offline installation, reload, corrupt-cache refusal and repair passed on Gnuplot canonical, R recovery and Livelier recovery with v0.3.3. Gnuplot recovery and Python recovery also passed the same v0.3.3 offline checks in Chromium and WebKit. R also executed the actual engine after a fully offline deployed reload on v0.3.2.

## Audio integration

The isolated migration preserves the legacy hashbin-audio writer, notation type, settings and WAV attachments. The worker uses the kit CID/byte modules through an app-owned Blob dependency adapter, with initial messages queued until helpers load. The 16 MiB CID sample limit stays separate from the 5 MiB document bound. Deterministic renderer/math/Python API and golden hashes are unchanged. Neural voices retain explicit consent and their separate verified cache; AAC gallery previews remain outside readiness.

[Audio CI](https://github.com/curtcox/AudioOnline/actions/runs/41939228598) passed 74 unit tests, static/integrity/published-pin checks, 85 shared desktop/phone contracts and the full actual-engine suites in Chromium, Firefox and WebKit. Local Chromium and WebKit also passed every exact audio golden, uploads/verified CID/tamper refusal, playback/export, gallery/mobile, update preservation and origin-shutdown offline rendering with NumPy and the bundled voice. Both engines passed actual neural synthesis, consent refusal/approval, verified persistent-cache reuse and fresh-session determinism, producing identical Kitten audio hashes. Original pre-kit Publish transactions approved and cancelled correctly against the actual pinned SDK; no paid save was created. Original renderer/math/Python API, effects/instruments/Pico and golden files have no diff.

The owner subsequently requested registration and deployment. Audio is now registered and deployed at clean revision `655dd9db46b1e0fd9980192e2ca8d7c6aa6dcee7`; see the final deployment and paid acceptance evidence below.

## Python live storage follow-up

The live hosted sandbox permits the canonical parent only. Actual canonical file creation, worker restart, reload, origin isolation and incoming-link guards passed in Chromium. Recovery opt-in timed out because the service CSP rejects the GitHub parent. [PR #3](https://github.com/curtcox/PythonOnline/pull/3) disables unavailable recovery persistence and offers a lossless source/input handoff to canonical with autorun off. Local 44 package-enabled tests and Chromium/WebKit recovery UI checks passed. All three CI browsers passed after an isolated retry of an upstream Shiny dependency-resolution conflict. PR #3 merged as `c7b41773a1bb510598390fc43d13ef23d8d393bc`; recovery deployment 41941787283 and canonical publisher 41941788306 succeeded. Live Chromium/WebKit recovery UI checks confirmed disabled unavailable persistence and a lossless canonical handoff. Actual canonical file creation, worker restart, reload, origin isolation and incoming-link guards passed again after deployment. No hosted allowlist is changed. Canonical acceptance separately records Cloudflare's injected analytics beacon blocked by the existing CSP; no analytics permission was added.

Early migration tests used mocks or seeded transactions with the actual SDK. On 2026-11-05 the owner authorized the four missing registrations and a $0.04 total budget for four real test saves; those registrations and paid saves are now complete. Physical-camera acceptance remains manual. Local macOS Firefox cannot launch; the reported successful Firefox runs are from Linux CI. Original sibling working directories remain untouched; migrations use isolated clones under /private/tmp.

## Pages integration

[PR #1](https://github.com/curtcox/pages/pull/1) merged as `77e33d2e605d5c94e3027a1a0ce5191a1ca26857`. [CI](https://github.com/curtcox/pages/actions/runs/41944905770) passed 40 unit tests, 85 shared contracts and the full native 19-check project/preview/browser suites in Chromium, Firefox and WebKit. The original bundler, Markdown renderer, preview host/runtime, loop guard, console engine, project validator and pinned vendors are unchanged. Active-file identity, selected page and view/run flags survive links; pre-kit Publish approvals/cancellations restore all files and options through the actual pinned SDK. Publish retains its SRI module-script loader.

[Recovery deployment](https://github.com/curtcox/pages/actions/runs/41945373839) and [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41945373702) succeeded. Canonical release.json confirms the merged revision and `dirty:false`. Live Chromium/WebKit checks passed five legacy links, CID loading, real QR image upload and 360 px layout on both origins. Recovery and canonical offline reload, corruption detection and repair passed in both browsers. Deployment manifests can have a different cache version from the local source checkout; live checks select the actual app-prefixed cache.

## Manim integration

[PR #8](https://github.com/curtcox/ManimOnline/pull/8) merged as `d48126ce8fff3bc58d554b4c194ccb6b5547397d` after [CI 41955822974](https://github.com/curtcox/ManimOnline/actions/runs/41955822974) passed Chromium, Firefox and WebKit. The original engines, Python API and catalog are unchanged. All 115 original previews were regenerated through the opaque SDK worker; media bytes stayed identical. Local validation passed 167 Node tests, 754 Python tests (one skip), static/generated checks, 68 shared contracts and native rendering/export/sharing/offline checks in Chromium and WebKit.

[Recovery deployment](https://github.com/curtcox/ManimOnline/actions/runs/41956746863) succeeded. The owner approved the central publisher change and Manim deployment. [PR #235](https://github.com/curtcox/hashbin.org/pull/235) added modern manifest staging; live offline acceptance then found a namespace mismatch. [PR #236](https://github.com/curtcox/hashbin.org/pull/236) preserves the manifest's declared prefix, with 996 publisher unit tests passing. [Canonical deployment 41962320892](https://github.com/curtcox/hashbin.org/actions/runs/41962320892) succeeded. Live release.json identifies the merged Manim revision with dirty:false, and the cache version starts with its declared manimonline-offline prefix.

Both deployed origins passed five harvested legacy links, verified CID loading, real QR upload and 360 px layout in Chromium and WebKit. Both also passed actual offline Graphviz rendering, corruption detection and repair in both browsers. No paid Publish saves were performed.

## Structured-source contract update

[v0.3.4 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.4) from the owner-approved immutable commit `f20de26aabea5c987788e1f84b15f7cfee9bea79`. [Release workflow 41958222985](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41958222985) succeeded with Chromium, Firefox and WebKit gates and uploaded the tarball, manifest and SHA256SUMS. It adds an optional source factory for strict formats such as Apptron txtar. Local validation passed 275 unit tests, checks and 68 Chromium/WebKit/phone contracts. The docs/demo deployment also uses v0.3.4. Earlier tags remain unchanged.

## Apptron recovery accepted

[PR #11](https://github.com/curtcox/apptron/pull/11) and the deployment-variable follow-up [PR #12](https://github.com/curtcox/apptron/pull/12) are merged at c57b0aa6282082fef651a986f1e7003ad7d58abd. [CI 41964738441](https://github.com/curtcox/apptron/actions/runs/41964738441) passed Chromium, Firefox, WebKit, unit, immutable-pin and real-VM jobs. [Recovery deployment 41965606028](https://github.com/curtcox/apptron/actions/runs/41965606028) succeeded.

Live recovery checks passed five harvested links, a verified CID, QR image upload and 360 px layout in Chromium/WebKit. Actual Chromium Linux boot, filesystem editing and capture passed. A previously verified shell and Python overlay both reloaded and ran with the browser fully offline. Runtime binaries, lock, patches, VM isolation and default network policy remain unchanged. The exact trusted-worker provenance fix preserves Firefox's cached module loading. The owner subsequently authorized canonical registration and deployment; both are now complete, with live acceptance recorded below.

## Sheets recovery and canonical accepted

An isolated clone pins published v0.3.4. The original 429 unit tests and recorded GFM conformance passed before runtime migration. The shared adapter retains Sheets v1/v2/v3 schemas, format/view/profile settings, legacy compressed/source/project writers and bounded, verified portable Org inputs. The shared UI, explicit draft recovery, QR, mobile tabs and opt-in offline controls are integrated. Original calculation engines, sanitization, worker execution and reference fixtures remain unchanged. Public staging excludes kit tools and tests; original real-engine gallery media supplies the 41 shared covers. Integrated validation passed 432 unit tests, generated-asset checks and the original GFM conformance (raw 672/672; production 601/672 with classified deviations). Native Chromium/WebKit passed 254 checks, with the remaining two table checks passing after selecting the mobile Preview tab. All 68 shared Chromium/WebKit/phone contracts pass. The final drawer fix also passes 74 affected/harvested native checks. [PR #1](https://github.com/curtcox/sheets/pull/1) merged as 6e226a2d36294e1cd3e4139a68355d107a921c1f after [CI 41969977004](https://github.com/curtcox/sheets/actions/runs/41969977004) passed all six gates: units, immutable pin, independent reference engines and actual Chromium/Firefox/WebKit. [Recovery deployment 41970832917](https://github.com/curtcox/sheets/actions/runs/41970832917) succeeded after all gates passed again, including all 134 native cases in each of Chromium, Firefox and WebKit, plus the shared contracts and independent reference engines. Live Chromium/WebKit acceptance passed five harvested links, verified CID loading, real QR upload and 360 px layout. Native Calca calculation worked after a fully offline reload, and corruption detection/repair passed in both browsers. [Canonical deployment 42031353245](https://github.com/curtcox/hashbin.org/actions/runs/42031353245) succeeded on 2026-11-05. Live release.json confirms 6e226a2d36294e1cd3e4139a68355d107a921c1f with dirty:false and cache prefix sheets-offline. Canonical Chromium/WebKit checks passed five harvested links, verified CID loading, QR image upload, 360 px layout, offline native Calca rendering, corruption detection and repair. The first cold-cache check exceeded its 30-second browser wait; diagnostics confirmed verified installation and the repeated fresh-profile checks passed with the existing 120-second acceptance deadline.

## MODL recovery and canonical accepted

An isolated clone pins v0.3.4. Its adapter retains h1 writers, the original untyped HashBin envelope and fractional node positions. Shared controls, drafts, sharing, QR and mobile tabs are integrated. The parser, layout, renderer, vocabulary, drag, pan and zoom blocks remain byte-identical to bde3a23c0f5abf5fe2746c2233f347092d2a07e1; an integrity check enforces this. Original deep zoom, cursor anchoring, fractional dragging, panning, SVG raster export and saved-position checks pass in Chromium/WebKit. The twelve original gallery diagrams supply covers rendered through the native SVG engine. Final local validation passed 24 adapter/deployment units, 20 native migration checks, the original deep-zoom suite and all 68 shared desktop/phone contracts. PR #1 at 9ffd83a29907ca7a38d1182f845ed8e3233c2465 passed all five gates in CI 41970447986, including actual Chromium/Firefox/WebKit and native geometry checks. [PR #1](https://github.com/curtcox/modl/pull/1) merged as 9a8fdb20e683ce4fa21996371470bf2dfd264627. [Recovery deployment 41970716758](https://github.com/curtcox/modl/actions/runs/41970716758) passed all gates and succeeded. Live Chromium/WebKit acceptance passed five harvested links, a verified CID, real QR upload, 360 px layout, offline native rendering, cache corruption/repair, and the original deep-zoom, cursor-anchor, fractional-drag, pan and SVG raster-export checks. [Canonical deployment 42031357149](https://github.com/curtcox/hashbin.org/actions/runs/42031357149) succeeded on 2026-11-05. Live release.json confirms 9a8fdb20e683ce4fa21996371470bf2dfd264627 with dirty:false and cache prefix modl-offline. Canonical Chromium/WebKit checks passed five harvested links, verified CID loading, QR image upload, 360 px layout, offline native rendering, corruption detection/repair and the original zoom, fractional dragging, pan and SVG raster-export checks.

## Final canonical publisher compatibility deployed

The owner approved publisher [PR #237](https://github.com/curtcox/hashbin.org/pull/237) and both canonical deployments. The PR merged as 4e61b30c4c45937fae7e76315951b6434300a314 on 2026-11-05. It reads generated native-module kit manifests as JSON, retains legacy MODL staging, inventories all modern MODL runtime assets, writes its notice to js/domain-migration.js and rehashes Sheets/MODL after final configuration. Local 998 unit tests and lint (zero errors) passed; remote unit/API/frontend and review gates passed. Final staging uses the exact clean merged revisions: MODL 9a8fdb2 (85 verified manifest assets) and Sheets 6e226a2 (965 verified manifest assets). Actual staged canonical artifacts pass five harvested links, CID, QR upload, 360 px layout, offline native rendering, corruption detection and repair in Chromium/WebKit. Both canonical deployments succeeded and passed live Chromium/WebKit acceptance. [HashBin production workflow 42031350542](https://github.com/curtcox/hashbin.org/actions/runs/42031350542) also passed unit, API/frontend, hosted-sandbox and funded-local gates, production deployment, hosted run-origin deployment and production verification. Live hashbin.org/health reports healthy at 4e61b30c4c45937fae7e76315951b6434300a314; 256t.us/health returns HTTP 200 OK.

## Final registrations and canonical deployments

The owner requested all remaining registration and deployment work on 2026-11-05. Each of the following public client IDs has exactly its canonical root return URL. HashBin's public Publish validation API accepts all four without origin warnings.

| App / canonical site | Registered client ID | Clean deployed revision | Canonical workflow | Recovery workflow |
| --- | --- | --- | --- | --- |
| [R](https://r.hashbin.page/) | app_d38327d1-7d1a-40c0-925c-8b3deea6e51e | 9f1744659453327b6d1bbd49893f28c537d09d92 | [42042674070](https://github.com/curtcox/hashbin.org/actions/runs/42042674070) | [42040723042](https://github.com/curtcox/R/actions/runs/42040723042) |
| [Livelier](https://livelier.hashbin.page/) | app_f044e0da-520a-4196-81f5-041c78f43c02 | c2ff73deb0aaa167f852912e7e518037d24c2fc4 | [42042910951](https://github.com/curtcox/hashbin.org/actions/runs/42042910951) | [42040477777](https://github.com/curtcox/livelier/actions/runs/42040477777) |
| [Audio](https://audio.hashbin.page/) | app_da72a010-439f-4772-b664-791ed9333c29 | 655dd9db46b1e0fd9980192e2ca8d7c6aa6dcee7 | [42043176217](https://github.com/curtcox/hashbin.org/actions/runs/42043176217) | [42042337332](https://github.com/curtcox/AudioOnline/actions/runs/42042337332) |
| [Apptron](https://apptron.hashbin.page/) | app_4988e882-b216-42ef-8d95-9f1747c6b55e | e7bab104c596c6b93f858fd619b53cb4f0230eb9 | [42043875433](https://github.com/curtcox/hashbin.org/actions/runs/42043875433) | [42040729665](https://github.com/curtcox/apptron/actions/runs/42040729665) |

All listed workflows succeeded. Registration PR CI passed units, immutable pin verification and actual Chromium, Firefox and WebKit for all four apps; Apptron also passed its real-VM boot/isolation job. Audio's WebKit playback timing assertion passed on its isolated rerun. The final Audio recovery workflow passed every gate again.

Publisher [PR #238](https://github.com/curtcox/hashbin.org/pull/238) added R/Livelier/Apptron manifest staging, Audio's actual client ID and Apptron delivery. Its five VM files above the hosting size limit, plus the system bundle, are delivered through six sets of 20 MiB static chunks at their original runtime URLs. The narrow Worker has no credentials, persistent storage or arbitrary upstream fetches. All source/runtime pins and full-file hashes remain unchanged. The same-origin VM retains COOP/COEP and its existing CSP/data grants. [PR #239](https://github.com/curtcox/hashbin.org/pull/239) corrected the runtime archive lookup to use curtcox/apptron rather than inheriting the publisher repository. The first Apptron attempt failed before deploying; the corrected workflow succeeded. GitHub replaced two pending jobs in its concurrency group; both were rescheduled and succeeded. Publisher validation passed 1,000 unit tests and lint with zero errors. Remote test/API gates passed; optional CodeRabbit checks were pending at merge and were cancelled, so no successful bot review is claimed.

Live Chromium and WebKit passed registered save review, verified CID loading, actual QR image upload and 360 px layout on all four canonical sites. Both browsers passed real offline R execution, Livelier world execution and deterministic Audio synthesis, then corruption detection and repair. Apptron passed offline editor reload and cache repair in both browsers. Actual Chromium shell boot, filesystem editing/capture, Go compilation and previously booted shell/Python-overlay execution after fully offline reload all passed. Each of the six live streamed runtime files matches its pinned SHA-256; direct chunk URLs return 404.

[Publisher production workflow 42043876119](https://github.com/curtcox/hashbin.org/actions/runs/42043876119) succeeded at b3cec808815ea16656de39451777df4ccf25ae8b. The subsequent status-only [production workflow 42045616727](https://github.com/curtcox/hashbin.org/actions/runs/42045616727) also succeeded. Hosting and status records are maintained in the publisher; later status commits do not change these consumer release revisions.

## Real paid Publish acceptance

The owner approved exactly $0.04 total: one $0.01 save per newly registered app with one-month retention. All four saves succeeded. R, Livelier and Audio used popups; Apptron used its isolated-editor redirect and restored the snapshot. Each app displayed the saved CID after its actual pinned SDK verified the return. An independent fetch from 256t.us recomputed each CID against the stored bytes, and fresh Chromium/WebKit profiles restored every saved source correctly.

| App | Published bytes | Verified saved link |
| --- | --- | --- |
| R | 173 | [Paid R test](https://r.hashbin.page/?run=0#AAAAAACtnpf6SDxNmB6Ov6glKc2JRUMkA25YNZMpU8ZJ3s7DIQGVDq0qrXEAwpHAFjLVXhMF6k8c6NVj4UxDem7KIeJSYg) |
| Livelier | 939 | [Paid world test](https://livelier.hashbin.page/?run=0#AAAAAAOrUh621vKt32M30hmceoitHxOyRVUwJzZilmWsvouhZ3qqeYf2chnduGn6FHEfNYjx9eto2L_p15ODU1E2n5QG1Q) |
| Audio | 259 | [Paid audio test](https://audio.hashbin.page/?run=0#AAAAAAEDRfvItWTL-eTgqY2jCE6JiRMvhXBWfbuREgd0sbtRgK2_rERWKQcNzqq8FtMe7AbtGSq4gVgc4KvXE_pBOfdIJQ) |
| Apptron | 158 | [Paid snapshot test](https://apptron.hashbin.page/?run=0#AAAAAACeQo--orM_JkagxDrDWfiBvp2UpRnnskjlPYGtJjftyoRlnw_5UV_Yii-eNGDbfOjbt0ihvxktfUD8agpMCQ_-ew) |

## Final physical-camera acceptance

The owner scanned all four canonical QR cards with a physical phone camera and confirmed that each opened its named document on the correct domain without automatic execution. This is owner-reported physical acceptance, separate from the automated real-image QR upload tests. The cards were displayed as a PNG in Preview after the browser policy refused local HTML navigation. All requested deployment, registration, offline, paid Publish and physical-camera work is complete; no owner rollout gate remains.

All ten adapters currently retain their existing writers. On 2026-11-05 the owner removed backward compatibility as a requirement: future work prioritizes features, security, simplicity and reliability, with no fleet-reader waiting period before a new writer. This deployment task does not change the document format.

## Compact UI rollout — 2026-11-07

The owner authorized deployment and verification. **[v0.3.5 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.5)** at `767849e068e3106593053b5f0eb9b1e9947d7b66`. Its published archive checksums and every manifest file were independently checked against the reviewed source. No existing release or workflow tag moved.

The shared shell combines action/status bars, pairs readable control colors, keeps Close above scrolling dialog contents, and offers individual-pane/Split views. MODL exposes Text/Diagram/Split and hides redundant automatic Render; explicit manual links retain Render once in More. Legacy migration overlays are removed; kit-backed draft transfers remain available in More.

All eleven consumer GitHub Pages sites deployed, as did all fourteen canonical editor/helper bundles and the separate Pages preview. [Canonical fleet deployment](https://github.com/curtcox/hashbin.org/actions/runs/42447224559) succeeded. The deployment metadata identifies clean committed consumer sources; 446 pin entries match the published kit, and the four actual served shared UI files were hash-checked on every canonical kit consumer.

| Consumer | Final source revision | Successful GitHub Pages workflow |
| --- | --- | --- |
| apptron | `f7332cd4a35d` | [Deployment](https://github.com/curtcox/apptron/actions/runs/42447115794) |
| AudioOnline | `c1a22c43ccd4` | [Deployment](https://github.com/curtcox/AudioOnline/actions/runs/42447308811) |
| GnuplotOnline | `9b589a485ed1` | [Deployment](https://github.com/curtcox/GnuplotOnline/actions/runs/42447123119) |
| livelier | `79aac5146865` | [Deployment](https://github.com/curtcox/livelier/actions/runs/42447164525) |
| ManimOnline | `84aae9a020ef` | [Deployment](https://github.com/curtcox/ManimOnline/actions/runs/42449639177) |
| modl | `afa751117cd2` | [Deployment](https://github.com/curtcox/modl/actions/runs/42447068591) |
| pages | `2a2905fd28cf` | [Deployment](https://github.com/curtcox/pages/actions/runs/42447131227) |
| PythonOnline | `789305b84b01` | [Deployment](https://github.com/curtcox/PythonOnline/actions/runs/42447146513) |
| R | `cfca438d1bca` | [Deployment](https://github.com/curtcox/R/actions/runs/42447139366) |
| sheets | `f55919245ad5` | [Deployment](https://github.com/curtcox/sheets/actions/runs/42447100163) |
| gripeline | `9235d08885c4` | [Deployment](https://github.com/curtcox/gripeline/actions/runs/42447157298) |

Actual Chromium, Firefox and WebKit CI gates passed for the kit and every consumer. Gripeline also passed its Linux/macOS/Windows compiler jobs. The shared demo and documentation deployed successfully in [website workflow 42449917372](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/42449917372). Its website publication step resolves the current stylesheet/version without changing the immutable kit documentation bytes.

Live Chromium/WebKit acceptance passed 46 host/browser cases across 92 desktop/phone layouts: every view, full-width single panes, no horizontal overflow, readable header/menu controls, always-visible dialog dismissal, focus return, sharing and QR. The larger Livelier world correctly offers a short-link fallback; a small explicit world generated a real QR. Phone checks used emulated 360 px layouts, not a physical camera. All fourteen canonical apps also passed live start/rendering checks in both browsers, including actual Python, R, Gnuplot, audio and world execution. Chromium booted the canonical Apptron VM, executed a terminal command and retained usable output across Code/Preview changes.

Broader live verification found and fixed two offline issues before completion:

- [Manim PR #10](https://github.com/curtcox/ManimOnline/pull/10) fetches classic deferred runtime scripts with CORS and omitted credentials so opaque responses are not mistaken for verifiable bytes. Runtime URLs and byte pins are unchanged. The regression failed before the fix; 168 unit tests, cold-cache/offline browser checks and the full three-browser CI passed. [Canonical correction](https://github.com/curtcox/hashbin.org/actions/runs/42449723398) and the final Pages workflow above succeeded. Actual cold MathTex animation, opaque Python execution and fully offline rerender passed live in Chromium/WebKit; both hosts serve the exact tested adapter bytes.
- [Publisher PR #241](https://github.com/curtcox/hashbin.org/pull/241) scopes the Pages frame-policy exception to `/preview` and `/preview.html`; the editor still refuses framing. Response policy contributes to the offline version so existing installed copies receive the correction. [Committed policy deployment](https://github.com/curtcox/hashbin.org/actions/runs/42449294976) succeeded. Actual online cross-site and offline local previews passed Chromium/WebKit with the user frame's origin remaining opaque. Publisher validation passed 1,008 units, lint with zero errors (153 warnings), and four real cross-origin draft transfers without copying credentials or deleting old drafts.

[Final publisher production deployment](https://github.com/curtcox/hashbin.org/actions/runs/42449535373) succeeded at `2314a1385aaee68707fc29148e6829b568cab642`; strict production verification confirmed that exact health/HTML revision, content-origin health, hosted-sandbox protections and public API refusals. This rollout made no new paid-save or physical-camera claim; the historical acceptances above remain separate. Already-open offline copies activate an offered update through **Update and reload**, preserving current source.

## R AI adoption — 2026-11-08 (America/Chicago)

[R PR #5](https://github.com/curtcox/R/pull/5) merged at
`daf9ac1e7818f1a642aea5f11f87c91b99b7b95e`. The exact reviewed source tree
passed 50 units, independent published 0.4.3 pin checks, all three browser/phone
gates, 25 real-sandbox reference pairs and all 37 gallery programs. Its
[canonical deployment](https://github.com/curtcox/hashbin.org/actions/runs/42540155232)
and [gated recovery deployment](https://github.com/curtcox/R/actions/runs/42540153890)
succeeded. Every one of 267 canonical inventory files and 265 recovery source
files matched. Actual Chromium/WebKit checks passed real R execution/plots,
fully offline reload, AI review/acceptance, and offline paste review on both sites.

The separately scoped R-only AI host at `ai.hashbin.page/v0.4.3/` is deployed;
Python keeps every 0.4.0 byte and its Python-only policy. Both versions' 186
served files, HTTPS/HSTS and exact frame policies passed. Actual session-key
handoff and Forget passed Chromium/Firefox/WebKit with mocked providers, and
the complete deployed R settings/popup/stream/review/acceptance flow passed
Chromium/WebKit. No accepted source auto-ran or retained an editor-origin key.

The real 75-result synthetic comparison cost $0.0268728. Scores were GPT-4.1
25/25, GPT-4.1 mini 24/25 and GPT-4o mini 18/25; no overall winner is supported.
The report and suite ship with R, without a new paid HashBin upload. Native
Safari, GPU/on-device R comparisons and other-provider R coverage remain
unverified. [Full receipts](r_ai_acceptance.json) record the exact revisions,
workflows, bytes, browser coverage and shared $10 budget.

## Remaining nine-client AI rollout — 2026-11-12 (America/Chicago)

Gnuplot, Livelier, Audio, Pages, Manim, Apptron, Sheets, MODL and Gripeline now use verified, unchanged Fragment Kit 0.4.3 pins. All source changes are committed and pushed on main. Their gated recovery deployments and [canonical deployment](https://github.com/curtcox/hashbin.org/actions/runs/43357509642) succeeded. Accepted proposals save normal drafts and wait for explicit Run, Render or Check; Pages stops the old preview and Apptron stops the VM and revokes its networking. Gallery search keeps a no-AI fallback.

| App | Final source | Canonical | Recovery | Successful gates/deployment |
| --- | --- | --- | --- | --- |
| gnuplot | [48f127e](https://github.com/curtcox/GnuplotOnline/commit/48f127e52dd2054ed05ae9329f0edd67eeeb5ddd) | [Main site](https://gnuplot.hashbin.page/) | [Recovery](https://curtcox.github.io/GnuplotOnline/) | [Deploy to GitHub Pages](https://github.com/curtcox/GnuplotOnline/actions/runs/43354410545) |
| livelier | [13a6a3a](https://github.com/curtcox/livelier/commit/13a6a3aa8ab6e28fd4e55f8d07e5caf9742abaf8) | [Main site](https://livelier.hashbin.page/) | [Recovery](https://curtcox.github.io/livelier/) | [Deploy Livelier](https://github.com/curtcox/livelier/actions/runs/43354305689) |
| pages | [7ce4695](https://github.com/curtcox/pages/commit/7ce4695f9744d04f21daf91bb2351d92466a5c57) | [Main site](https://pages.hashbin.page/) | [Recovery](https://curtcox.github.io/pages/) | [Deploy Pages Online](https://github.com/curtcox/pages/actions/runs/43354309567) |
| apptron | [3f13c3e](https://github.com/curtcox/apptron/commit/3f13c3e41733b9869a0817e6b557ca4c37854b63) | [Main site](https://apptron.hashbin.page/) | [Recovery](https://curtcox.github.io/apptron/) | [Test](https://github.com/curtcox/apptron/actions/runs/43356002047), [Deploy Pages](https://github.com/curtcox/apptron/actions/runs/43356002052) |
| sheets | [971a5b5](https://github.com/curtcox/sheets/commit/971a5b5eb64702bc901fe84189a5212bf9928ee4) | [Main site](https://sheets.hashbin.page/) | [Recovery](https://curtcox.github.io/sheets/) | [Deploy to GitHub Pages](https://github.com/curtcox/sheets/actions/runs/43354315202) |
| modl | [00e890c](https://github.com/curtcox/modl/commit/00e890cfbe51b529cfdf58fe8139e0ba4f2d0ac0) | [Main site](https://modl.hashbin.page/) | [Recovery](https://curtcox.github.io/modl/) | [Deploy MODL](https://github.com/curtcox/modl/actions/runs/43354413374) |
| gripeline | [6608347](https://github.com/curtcox/gripeline/commit/6608347eb62b2f4ac90cad14900cdb4acccb5130) | [Main site](https://gripeline.hashbin.page/) | [Recovery](https://curtcox.github.io/gripeline/editor/) | [Publish to GitHub Pages](https://github.com/curtcox/gripeline/actions/runs/43354556572) |
| audio | [9b31e52](https://github.com/curtcox/AudioOnline/commit/9b31e520ae0cc59c0b52cc5d5babcba6b748712d) | [Main site](https://audio.hashbin.page/) | [Recovery](https://curtcox.github.io/AudioOnline/) | [Deploy Audio Online](https://github.com/curtcox/AudioOnline/actions/runs/43354413657) |
| manim | [368f035](https://github.com/curtcox/ManimOnline/commit/368f03577281856389dfd1776820d80dc318493e) | [Main site](https://manim.hashbin.page/) | [Recovery](https://curtcox.github.io/ManimOnline/) | [Deploy ManimOnline](https://github.com/curtcox/ManimOnline/actions/runs/43354341438) |

The separate [fleet AI host](https://ai.hashbin.page/fleet-v0.4.3/host.html) deployed from `8955181` in [run 43349881620](https://github.com/curtcox/hashbin.org/actions/runs/43349881620), Cloudflare version `927ef80d-7186-4fcc-950c-f8dd29e912f7`. All 282 served host files match their inventory; all 188 previous versioned assets and both Python/R response policies are preserved. Strict isolation remains enabled. The host-only encrypted temporary handoff, PKCE, Forget and stale-popup rejection passed Chromium/Firefox/WebKit conformance. Canonical apps have exact host-only configuration; recovery copies use direct mode with the owner-approved four provider destinations; unknown origins are paste only. Caps start at zero.

All nine final app CI gates passed Chromium, Firefox and WebKit, including their native engine/editor checks. Actual phone-sized Chromium/WebKit acceptance passed on all eighteen deployed sites: review/acceptance/undo, drafts, explicit execution, navigation cancellation, gallery search and callback scrubbing. Each canonical app completed a real OpenAI stream through the deployed host in Chromium, with cost reserved in the shared ledger before sending and maxTokens 2048. WebKit canonical host flows used synthetic keys and mocked provider responses. No key entered app storage or URLs. Independently staged inventories match all canonical release inventories; 997 selected shipped source/AI files and 80 recovery AI/configuration/pin files were fetched and hash-verified. Unfetched runtime files are not claimed as remotely rehashed.

The public 25-case suites and 75-result reports ship with every app. The three-model synthetic comparisons produced 674 passes out of 675 results; Audio's one invalid output was rejected. These are source assertions/document invariants (plus native MODL parsing), not general runtime-quality scores or a model winner. Shared spending is **$0.487922008 used or reserved of $10**; no paid CI calls or new paid HashBin uploads occurred. Native Safari, GPU/on-device consumer comparisons and other-provider live acceptance remain unverified.

Six clean original local checkouts were fast-forwarded. Existing local work in Pages, Apptron and Sheets was preserved; the clean committed rollout checkouts remain under ignored `dist/ai-fleet/repos/`. [Full machine-readable receipt](fleet_ai_acceptance.json).


## Slidev Online workflow prerequisite (2026-11-13)

Prepared an optional `working-directory` for `test.yml` (default `.`), npm cache
keys, and failure artifact paths. Pages and kit-check are unchanged. Local
verification: 301 unit tests, full static/vendor/gallery checks, actionlint, and
a nested-app Chromium smoke exercising install/pre-test/unit/check/gallery,
server startup, the configured Playwright contract path and the browser command.
A separate reusable-workflow smoke runs the same nested package in Actions.
PR #4 merged at `3de01b1e3ea6c2508a1831ada35c84e8e242925a` after green Kit CI
and nested-app workflow runs. With explicit owner approval, immutable `@v4`
was published at that commit. `@v3` was already published at `8807ee5` on
November 8, before this plan, so it and `@v2` remain unchanged.

Runtime v0.4.4 is published with the deployed, hash-verified HashBin SDK
v0.6.0 alongside the unchanged v0.4.0 SDK and Publish default. With explicit owner
approval, PR #5 merged at `c410d289dd36040a527d0b64a7c1f23a915765b9` and immutable
tag `v0.4.4` was published there. [Release run 43437233993](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/43437233993)
passes all three browsers, artifact publication and independent demo verification.
Downloaded archive/manifest checksums pass; an independent download through the
old vendor-sync tool verifies every shipped file against the published manifest
and matches the prepared Slidev integration pin without editing it. This is
release evidence, not a Slidev product deployment. Preparation passes 302 unit tests,
static/vendor/gallery checks and release packaging. Chromium/WebKit pass 128
browser cases. Local Firefox fails to create a profile before application code,
including in a standalone launch; Linux CI must verify its contracts before
publication. The SDK deployment passed in hashbin.org run 43432577171, and its
strict production checklist and live v0.6.0 integrity hashes were verified.
