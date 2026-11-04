# Rollout status

## Verified remotely on 2026-11-04

- Implementation was committed to `main` and pushed (`0a275ac`).
- [v0.1.0](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.1.0)
  and [v0.2.0](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.2.0)
  are published, each with tarball, manifest and SHA-256 sums. Tags have not moved.
- [v0.2.0 release CI](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41903993921)
  passed 270 unit tests and 85 contracts: Chromium/Pixel 7 (34), Firefox (17),
  WebKit/iPhone 14 (34). The demo pin was independently verified against the release.
- [Docs and demo deployment](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/actions/runs/41903989136)
  passed through the reusable test and Pages workflows, including its live marker.
  [Open the site](https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/).
- A previous dependency-install stall was retried successfully. An older in-flight
  deployment run was cancelled to prevent it replacing the newer site. Site runs
  now cancel superseded runs before deployment.

## Consumer rollout

| Consumer | Actual state |
| --- | --- |
| GnuplotOnline | [Pilot PR #1](https://github.com/curtcox/GnuplotOnline/pull/1), draft pending full remote CI; not merged or deployed |
| R | Pending |
| PythonOnline | Pending |
| livelier | Pending |
| AudioOnline | Pending |
| pages | Pending |
| ManimOnline | Pending |
| apptron | Pending |
| sheets | Pending |
| modl | Pending |

The pilot checkout is `/private/tmp/fragment-kit-gnuplot-pilot`, branch
`codex/fragment-kit-pilot`. It uses the downloaded, checksum-verified published
v0.2.0, removes the copied shared modules, supplies production schema and legacy
writer adapters, and switches to shared workflows and gallery rendering.

Local pilot acceptance: 30 unit/corpus tests; 68 contracts in Chromium, WebKit,
Pixel 7 and iPhone 14; actual WASM rendering/isolation, all 16 examples, verified
manual/automatic offline recovery with the origin stopped, and URL/draft recovery
in Chromium and WebKit. Firefox runs in Linux CI; local macOS launch still fails.

Phases 7–8 now have release and deployment evidence. Consumer integration is not
complete until each PR and its deployed checks are verified. Real registered
HashBin approval and physical-camera checks remain separate acceptance work.
