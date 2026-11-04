# Rollout status

2026-11-04: implementation commit `0a275ac` is on `origin/main`.
CI passed 269 unit tests and 85 contracts across Chromium, Firefox, WebKit,
Pixel 7 and iPhone 14 on GitHub Actions. Docs and demo were deployed successfully.

[v0.1.0](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.1.0)
is published with its tarball, manifest and checksum assets. The tag has not moved.
The demo now exercises the reusable test workflow. A dependency-install stall in
one Firefox job required a retry; earlier CI and release matrix runs passed all engines.

Development is on 0.2.0: legacy-writer rollout gating, editor-aware contract hooks,
SDK mock preservation and version-aware demo regeneration.
The Gnuplot pilot has an isolated checkout at `/private/tmp/fragment-kit-gnuplot-pilot`
on branch `codex/fragment-kit-pilot`; no consumer changes have been pushed yet.
All ten consumer migrations and their deployed checks remain pending.
