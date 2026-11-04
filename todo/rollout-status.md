# Rollout status

Verified remotely on 2026-11-04. Phases 0–8 are implemented; phase 9 is in progress.

## Kit releases and workflows

- [v0.3.2](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.2)
  is published with tarball, manifest and SHA-256 sums. Earlier v0.1.0, v0.2.0,
  v0.3.0 and v0.3.1 releases remain immutable. No tag has moved.
- [v0.3.2 release gate](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41921753645)
  passed 272 unit tests, 85 contracts across Chromium/Pixel 7 (34), Firefox (17),
  WebKit/iPhone 14 (34), static checks and independent published-demo verification.
- Immutable workflow tag `v2` points at `5c12e840cbc2229e1d905830204c78bce6b27cc9`; `v1` remains unchanged.
  [Its CI](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41928143500)
  passed unit and all three browsers. It rewrites apt source files and separate mirror-list files to use the official Ubuntu archive; logs confirm the intended HTTPS source. The earlier v1 rewrite missed the mirror-list files on some runners. Runtime pins remain exact; `v1` is not a runtime release.
- [Docs and demo](https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/)
  serve v0.3.2. The [latest gated deployment](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41928143605)
  succeeded on `5c12e84`, including all browser tests and the live marker.
  Earlier Pages attempts timed out in GitHub's `updating_pages` state; a fresh
  run succeeded. Prepared artifacts were not recorded as deployments.

## Consumers

| Consumer | Runtime | Actual remote state |
| --- | --- | --- |
| GnuplotOnline | v0.3.1 | PRs [#1](https://github.com/curtcox/GnuplotOnline/pull/1) and [#2](https://github.com/curtcox/GnuplotOnline/pull/2) merged; main `20b6921`; recovery and canonical deployed and verified |
| R | v0.3.2 | [PR #1](https://github.com/curtcox/R/pull/1) merged as `a800873`; [gated recovery deployment](https://github.com/curtcox/R/actions/runs/41926294797) succeeded and live acceptance passed; canonical DNS and client registration remain unprovisioned |
| PythonOnline | v0.3.2 | [PR #1](https://github.com/curtcox/PythonOnline/pull/1) is a draft; [CI](https://github.com/curtcox/PythonOnline/actions/runs/41929011440) running; no production deployment yet |
| livelier | v0.3.2 | Isolated integration and local acceptance in progress; no PR or deployment yet |
| AudioOnline | — | Pending |
| pages | — | Pending |
| ManimOnline | — | Pending |
| apptron | — | Pending |
| sheets | — | Pending |
| modl | — | Pending |

## Gnuplot evidence

- Main `20b6921bea591dd13013a23751c405e2c4fd2306` uses the published v0.3.1,
  production document/legacy writer adapters, shared shell/dialogs/QR scanning,
  verified offline core and gallery tooling. Duplicated shared modules are deleted.
- PR checks passed 30 unit/corpus tests, 85 contracts and actual WASM rendering,
  all 16 examples, execution isolation, URL/draft recovery and origin-shutdown
  offline rendering in Chromium, Firefox and WebKit.
- [Recovery deployment](https://github.com/curtcox/GnuplotOnline/actions/runs/41921835482)
  and [canonical publisher](https://github.com/curtcox/hashbin.org/actions/runs/41921837072)
  succeeded. Canonical release.json confirms `20b6921` and `dirty:false`.
- On both [recovery](https://curtcox.github.io/GnuplotOnline/) and
  [canonical](https://gnuplot.hashbin.page/), Chromium and WebKit passed five
  legacy corpus links, an inline CID, real QR image upload, 360px layout and
  actual-origin offline installation/reload/corruption/repair.
- The HashBin-owned domain notice was generated before offline hashing, matching
  the central publisher's replacement exactly. The publisher repository was not modified.

## R evidence

- [Final PR gate](https://github.com/curtcox/R/actions/runs/41925251200) passed
  unit, independent published-pin verification and all three browsers, including
  the real 37-example gallery, isolation, t256, URL/draft recovery and 85 contracts.
- Local validation passed 47 unit/corpus/cache-upgrade tests, 68 contracts in
  Chromium/WebKit/Pixel 7/iPhone 14, and the full actual-engine/gallery suites in
  Chromium and WebKit. Local macOS Firefox cannot launch; successful Firefox
  results are from Linux CI.
- The original independent v0.3.0 execution sandbox and cache verifier remain
  byte-pinned. Shared Publish uses the kit's v0.4.0. Optional verified packages
  migrate without network into a separate cache; spike caches survive activation.
- On deployed [GitHub Pages](https://curtcox.github.io/R/), Chromium and WebKit passed five legacy corpus links with settings, inline CID loading, real QR image upload, 360px layout and actual-origin offline install/reload/corruption/repair. The prospective
  r.hashbin.page origin has no DNS service and R's client ID remains deliberately
  empty. No registration, paid saves or invented client IDs were performed.

## Python integration

The isolated branch keeps the opaque/hosted execution boundary, local-only
persistence permission, real Pyodide engine, Python helpers and t256. Shared
modules are replaced with v0.3.2; old draft history remains readable and untouched.
Unused SDK/cache v0.3.0 and the duplicate SDK v0.4.0 are removed. Execution imports
the kit's identical immutable SDK bytes. Optional packages are separated from
application readiness and verified against the pinned lockfile, including during
cache migration. Published-pin verification, 19 Python tests, 42 package-enabled Node tests (no skips), static checks and 68 shared contracts passed. Full WebKit acceptance passed all 32 real examples, hosted persistence/isolation, Publish mocks, stale loads, mobile and offline execution. Chromium reached the same checks before a test-fixture reference failure, which is fixed. CI exposed missing package fixtures and a Firefox draft target sizing issue; both are fixed in the current rerun. Local macOS Firefox cannot launch; Firefox results will be reported from Linux CI.

Real registered Publish approval and physical-camera checks remain separate
acceptance work. Automated Publish is mocked and no paid documents are created.

## Livelier integration

The production world adapter preserves deterministic snapshots and the existing kernel version. Shared tools replace copied modules; the original kernel, compiler, host, iframe permissions and CSP bootstrap bytes remain unchanged. Fresh asynchronous world snapshots are prepared before shared save/share dialogs, with revision guards and synchronous Publish clicks. The original world-preview renderer remains available. Local validation has passed 34 unit/corpus tests, static checks, original preview fingerprints and Chromium URL/draft independence. Full interaction and shared-contract acceptance are running.
