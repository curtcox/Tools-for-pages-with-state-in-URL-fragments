# Rollout status

Verified remotely on 2026-11-04. Phases 0–8 are implemented and published. Phase 9 is in progress; the remaining consumers are not marked complete.

## Published kit and workflows

- [v0.3.3](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.3) is published at `aa970dee6a55e072557fa5bb2851dc12d4273676`, with tarball, manifest and SHA-256 sums. Earlier release tags remain unchanged.
- The [release gate](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41933132525) passed 275 unit tests, static/integrity checks, 85 contracts in Chromium/Pixel 7 (34), Firefox (17), WebKit/iPhone 14 (34), and independent published-demo verification.
- v0.3.3 verifies Publish returns against the SDK transaction's original bytes, then compares its parsed document with the restored snapshot. This preserves pre-kit envelope ordering without weakening CID verification. Regressions use the actual pinned SDK, including cancelled returns and substituted content.
- Immutable workflow `v2` remains `5c12e840cbc2229e1d905830204c78bce6b27cc9`; `v1` remains unchanged. Runtime pins are independent exact releases.
- [Docs/demo deployment](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41932883579) succeeded. The live demo serves v0.3.3.

## Consumer state

| Consumer | Runtime | Actual remote state |
| --- | --- | --- |
| GnuplotOnline | v0.3.3 | [PR #4](https://github.com/curtcox/GnuplotOnline/pull/4) merged as `3e2f27b`; recovery and canonical deployed; live legacy/CID/QR/mobile checks passed on both origins |
| R | v0.3.3 | [PR #2](https://github.com/curtcox/R/pull/2) merged as `458e0d3`; recovery deployed and live acceptance passed; canonical DNS/client registration unprovisioned |
| PythonOnline | v0.3.3 | [PR #2](https://github.com/curtcox/PythonOnline/pull/2) merged as `4cef804`; recovery and canonical deployed; live legacy/CID/QR/mobile acceptance passed on both; storage-guidance follow-up [PR #3](https://github.com/curtcox/PythonOnline/pull/3) merged as `c7b4177` and deployed on both origins |
| livelier | v0.3.3 | [PR #2](https://github.com/curtcox/livelier/pull/2) merged as `967aa83`; recovery deployed; live acceptance passed; canonical/client registration unprovisioned |
| AudioOnline | v0.3.3 | [PR #1](https://github.com/curtcox/AudioOnline/pull/1) merged as `5bd9344`; all three-browser CI passed; owner-controlled manual deployment remains staged |
| pages | v0.3.3 | [PR #1](https://github.com/curtcox/pages/pull/1) merged as `77e33d2`; recovery/canonical deployments and live legacy/CID/QR/mobile checks passed |
| ManimOnline | v0.3.3 | PR #8 merged at `d48126c`; recovery deployed; canonical publisher compatibility PR #235 prepared |
| apptron | v0.3.4 | Isolated migration underway; 68 local shared contracts pass; real VM and offline checks pass; no PR or deployment |
| sheets | — | Pending |
| modl | — | Pending |

## Verification evidence

All four merged upgrade PRs passed unit, independent published-pin verification and browser gates in Chromium, Firefox and WebKit. Consumer engine suites use the actual engines and existing galleries, in addition to the shared contracts. Python's first Firefox run timed out during a package download; the isolated retry passed the full suite.

- Gnuplot [CI](https://github.com/curtcox/GnuplotOnline/actions/runs/41933944639), [recovery deployment](https://github.com/curtcox/GnuplotOnline/actions/runs/41935875969), [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41935892697). Canonical release.json confirms `3e2f27b88ce031cda3e1c3b1739c4104e4e177c2`, `dirty:false`. Original metadata-first Publish transaction returns pass against the actual pinned SDK.
- R [CI](https://github.com/curtcox/R/actions/runs/41933950693), [recovery deployment](https://github.com/curtcox/R/actions/runs/41935883293). Its independent immutable SDK v0.3.0 execution sandbox/cache verifier remain pinned; Publish uses the kit's v0.4.0. Optional verified packages remain separate from application readiness. Phone input fills its panel and recovery controls meet 44px targets.
- Python [CI](https://github.com/curtcox/PythonOnline/actions/runs/41933934758), [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41936859015). Canonical release.json confirms `4cef8041a172be40aecda7bbdd145357248d0fff`, `dirty:false`. Hosted/opaque execution and local-only persistence permission remain app-owned. Original Publish transactions restore source/input; verified packages remain separate from application readiness.
- Livelier [CI](https://github.com/curtcox/livelier/actions/runs/41933955438), [recovery deployment](https://github.com/curtcox/livelier/actions/runs/41935890852). Kernel, compiler, host and original CSP bootstrap bytes remain unchanged. Fresh asynchronous world snapshots have revision guards before share/save; Publish remains synchronous in the confirm click. Original transaction namespace stays readable.

Live Chromium and WebKit checks passed five harvested legacy URLs, an inline CID, real QR image upload and 360px layout on Gnuplot's recovery/canonical origins, R recovery and Livelier recovery. Actual-origin offline installation, reload, corrupt-cache refusal and repair passed on Gnuplot canonical, R recovery and Livelier recovery with v0.3.3. Gnuplot recovery and Python recovery also passed the same v0.3.3 offline checks in Chromium and WebKit. R also executed the actual engine after a fully offline deployed reload on v0.3.2.

## Audio integration

The isolated migration preserves the legacy hashbin-audio writer, notation type, settings and WAV attachments. The worker uses the kit CID/byte modules through an app-owned Blob dependency adapter, with initial messages queued until helpers load. The 16 MiB CID sample limit stays separate from the 5 MiB document bound. Deterministic renderer/math/Python API and golden hashes are unchanged. Neural voices retain explicit consent and their separate verified cache; AAC gallery previews remain outside readiness.

[Audio CI](https://github.com/curtcox/AudioOnline/actions/runs/41939228598) passed 74 unit tests, static/integrity/published-pin checks, 85 shared desktop/phone contracts and the full actual-engine suites in Chromium, Firefox and WebKit. Local Chromium and WebKit also passed every exact audio golden, uploads/verified CID/tamper refusal, playback/export, gallery/mobile, update preservation and origin-shutdown offline rendering with NumPy and the bundled voice. Both engines passed actual neural synthesis, consent refusal/approval, verified persistent-cache reuse and fresh-session determinism, producing identical Kitten audio hashes. Original pre-kit Publish transactions approved and cancelled correctly against the actual pinned SDK; no paid save was created. Original renderer/math/Python API, effects/instruments/Pico and golden files have no diff.

Audio main is `5bd934432ed9c51219d88afd59ac3b17b29ec010`. Its AGENTS.md reserves remote deployment, DNS and registration for the owner; the merged workflow is gated and manually dispatched. No Audio deployment is claimed.

## Python live storage follow-up

The live hosted sandbox permits the canonical parent only. Actual canonical file creation, worker restart, reload, origin isolation and incoming-link guards passed in Chromium. Recovery opt-in timed out because the service CSP rejects the GitHub parent. [PR #3](https://github.com/curtcox/PythonOnline/pull/3) disables unavailable recovery persistence and offers a lossless source/input handoff to canonical with autorun off. Local 44 package-enabled tests and Chromium/WebKit recovery UI checks passed. All three CI browsers passed after an isolated retry of an upstream Shiny dependency-resolution conflict. PR #3 merged as `c7b41773a1bb510598390fc43d13ef23d8d393bc`; recovery deployment 41941787283 and canonical publisher 41941788306 succeeded. Live Chromium/WebKit recovery UI checks confirmed disabled unavailable persistence and a lossless canonical handoff. Actual canonical file creation, worker restart, reload, origin isolation and incoming-link guards passed again after deployment. No hosted allowlist is changed. Canonical acceptance separately records Cloudflare's injected analytics beacon blocked by the existing CSP; no analytics permission was added.

No paid saves or account registrations were performed. Automated Publish uses mocks or seeded transactions with the actual SDK. Physical-camera and real registered Publish approval remain manual acceptance work. Local macOS Firefox cannot launch; the reported successful Firefox runs are from Linux CI. Original sibling working directories remain untouched; migrations use isolated clones under /private/tmp.

## Pages integration

[PR #1](https://github.com/curtcox/pages/pull/1) merged as `77e33d2e605d5c94e3027a1a0ce5191a1ca26857`. [CI](https://github.com/curtcox/pages/actions/runs/41944905770) passed 40 unit tests, 85 shared contracts and the full native 19-check project/preview/browser suites in Chromium, Firefox and WebKit. The original bundler, Markdown renderer, preview host/runtime, loop guard, console engine, project validator and pinned vendors are unchanged. Active-file identity, selected page and view/run flags survive links; pre-kit Publish approvals/cancellations restore all files and options through the actual pinned SDK. Publish retains its SRI module-script loader.

[Recovery deployment](https://github.com/curtcox/pages/actions/runs/41945373839) and [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41945373702) succeeded. Canonical release.json confirms the merged revision and `dirty:false`. Live Chromium/WebKit checks passed five legacy links, CID loading, real QR image upload and 360 px layout on both origins. Recovery and canonical offline reload, corruption detection and repair passed in both browsers. Deployment manifests can have a different cache version from the local source checkout; live checks select the actual app-prefixed cache.

## Manim integration

[PR #8](https://github.com/curtcox/ManimOnline/pull/8) merged as `d48126ce8fff3bc58d554b4c194ccb6b5547397d` after [CI 41955822974](https://github.com/curtcox/ManimOnline/actions/runs/41955822974) passed Chromium, Firefox and WebKit. The original engines, Python API and catalog are unchanged. All 115 original previews were regenerated through the opaque SDK worker; media bytes stayed identical. Local validation passed 167 Node tests, 754 Python tests (one skip), static/generated checks, 68 shared contracts and native rendering/export/sharing/offline checks in Chromium and WebKit.

[Recovery deployment](https://github.com/curtcox/ManimOnline/actions/runs/41956746863) succeeded. [Canonical deployment](https://github.com/curtcox/hashbin.org/actions/runs/41956747682) failed because the publisher expects the retired `manifest.local` and `offline-hashes.js`. [Publisher PR #235](https://github.com/curtcox/hashbin.org/pull/235) supports both manifest generations and refreshes final migration-module hashes. Its 995 unit tests pass; actual staging produces 545 public assets. Central production-main merge and canonical redeployment await explicit owner approval under that repository’s AGENTS.md. Live Manim acceptance is still pending.

## Structured-source contract update

[v0.3.4 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.4) from the owner-approved immutable commit `f20de26aabea5c987788e1f84b15f7cfee9bea79`. [Release workflow 41958222985](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41958222985) succeeded with Chromium, Firefox and WebKit gates and uploaded the tarball, manifest and SHA256SUMS. It adds an optional source factory for strict formats such as Apptron txtar. Local validation passed 275 unit tests, checks and 68 Chromium/WebKit/phone contracts. The docs/demo deployment also uses v0.3.4. Earlier tags remain unchanged.

## Apptron integration underway

The isolated migration retains the actual locked Linux runtime and patches. The published kit pin is independently verified. Local validation has passed 32 unit tests and all 68 shared contracts in Chromium, WebKit, Pixel and iPhone profiles. Actual Chromium VM checks passed shell, filesystem capture, Python, Go, native WASI, overlay restore and hostile-environment containment. Browser-offline reboot passed for shell and Python after lazy runtime assets were pinned and verified separately from editor readiness. Native editor/security and paired-origin artifact validation remain in progress; no source PR, merge or deployment is claimed. The client ID and prospective canonical origin remain unprovisioned.
