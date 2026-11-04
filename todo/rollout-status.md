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
| PythonOnline | v0.3.3 | [PR #2](https://github.com/curtcox/PythonOnline/pull/2) merged as `4cef804`; canonical deployed; gated recovery deployment and v0.3.3 live acceptance in progress |
| livelier | v0.3.3 | [PR #2](https://github.com/curtcox/livelier/pull/2) merged as `967aa83`; recovery deployed; live acceptance passed; canonical/client registration unprovisioned |
| AudioOnline | v0.3.3 staged | Isolated migration under validation; no PR, merge or deployment yet |
| pages | — | Pending |
| ManimOnline | — | Pending |
| apptron | — | Pending |
| sheets | — | Pending |
| modl | — | Pending |

## Verification evidence

All four merged upgrade PRs passed unit, independent published-pin verification and browser gates in Chromium, Firefox and WebKit. Consumer engine suites use the actual engines and existing galleries, in addition to the shared contracts. Python's first Firefox run timed out during a package download; the isolated retry passed the full suite.

- Gnuplot [CI](https://github.com/curtcox/GnuplotOnline/actions/runs/41933944639), [recovery deployment](https://github.com/curtcox/GnuplotOnline/actions/runs/41935875969), [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41935892697). Canonical release.json confirms `3e2f27b88ce031cda3e1c3b1739c4104e4e177c2`, `dirty:false`. Original metadata-first Publish transaction returns pass against the actual pinned SDK.
- R [CI](https://github.com/curtcox/R/actions/runs/41933950693), [recovery deployment](https://github.com/curtcox/R/actions/runs/41935883293). Its independent immutable SDK v0.3.0 execution sandbox/cache verifier remain pinned; Publish uses the kit's v0.4.0. Optional verified packages remain separate from application readiness. Phone input fills its panel and recovery controls meet 44px targets.
- Python [CI](https://github.com/curtcox/PythonOnline/actions/runs/41933934758), [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41936859015). Canonical release.json confirms `4cef8041a172be40aecda7bbdd145357248d0fff`, `dirty:false`. Hosted/opaque execution and local-only persistence permission remain app-owned. Original Publish transactions restore source/input; verified packages remain separate from application readiness.
- Livelier [CI](https://github.com/curtcox/livelier/actions/runs/41933955438), [recovery deployment](https://github.com/curtcox/livelier/actions/runs/41935890852). Kernel, compiler, host and original CSP bootstrap bytes remain unchanged. Fresh asynchronous world snapshots have revision guards before share/save; Publish remains synchronous in the confirm click. Original transaction namespace stays readable.

Live Chromium and WebKit checks passed five harvested legacy URLs, an inline CID, real QR image upload and 360px layout on Gnuplot's recovery/canonical origins, R recovery and Livelier recovery. Actual-origin offline installation, reload, corrupt-cache refusal and repair passed on Gnuplot canonical, R recovery and Livelier recovery with v0.3.3. Gnuplot recovery had passed the same offline checks on v0.3.1; its v0.3.3 offline rerun remains to be recorded. R also executed the actual engine after a fully offline deployed reload on v0.3.2.

## Audio integration

The isolated migration preserves the legacy hashbin-audio writer, notation type, settings and WAV attachments. The worker uses the kit CID/byte modules through an app-owned Blob dependency adapter, with initial messages queued until helpers load. The 16 MiB CID sample limit stays separate from the 5 MiB document bound. Deterministic renderer/math/Python API and golden hashes are unchanged. Neural voices retain explicit consent and their separate verified cache; AAC gallery previews remain outside readiness.

Local validation passed 71 unit tests and the original golden check before adding three corpus/transaction-scope regressions. Chromium and WebKit actual-engine suites have passed every example's exact audio golden hashes. Shared contracts and the remaining UI/offline/real-SDK acceptance are still running. Audio's AGENTS.md reserves remote deployment, DNS and registration for the owner; its proposed workflow is gated and manually dispatched. No Audio deployment is claimed.

No paid saves or account registrations were performed. Automated Publish uses mocks or seeded transactions with the actual SDK. Physical-camera and real registered Publish approval remain manual acceptance work. Local macOS Firefox cannot launch; the reported successful Firefox runs are from Linux CI. Original sibling working directories remain untouched; migrations use isolated clones under /private/tmp.
