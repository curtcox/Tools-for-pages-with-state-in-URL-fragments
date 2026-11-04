# Implementation status

This repository starts at 0.1.0, unreleased. The master plan's phase definitions
are acceptance criteria, not a record of actions already performed.

Local runtime, documentation, baseline corpora, demo, tooling and workflows are
implemented here. The local acceptance snapshot covers:

| Phase | Local result | Remaining acceptance work |
| --- | --- | --- |
| 0 | Ten committed corpora with source commits, serialized bytes, decoded examples and storage/cache evidence | Expand discovered documentation references into executable cases during each migration |
| 1 | Core unit tests and corpus codec round-trips | Production adapter validation remains app-owned |
| 2 | Verified loads, Publish timing, callbacks, cancellation and stale-load guards | Real registered client approval against the deployed demo |
| 3 | Versions 1–40 at all ECC levels; static image, upload and deterministic camera-frame paths | Physical camera checks; Firefox execution on a working host |
| 4 | Original drafts and shortener tests ported; recovery and share dialogs | Consumer integration |
| 5 | Install, offline reload, update/activation, corruption detection and failed-repair preservation | Consumer extra-cache integrations |
| 6 | Desktop, 360px, Pixel 7 and iPhone 14 contracts in Chromium/WebKit | Firefox profile launch currently fails on the local host |
| 7 | Local docs, demo and fingerprinted gallery; demo imports a pinned vendored copy | GitHub Pages deployment |
| 8 | Reusable workflows, integrity/manifest checks and local release packaging | Published v0.1.0 tag/Release and workflow execution on GitHub |
| 9 | Migration guide and baseline inputs prepared | All ten consumer branches/PRs, module deletion and deployed-site checks |

The jsQR 1.4.0 original is preserved. A generated, documented derivative fixes
its version-23 alignment table; CI verifies that transformation. Canonical v1
source payloads use JSON strings to distinguish code that resembles JSON documents.
The baseline corpus tests exercise wire formats with explicit adapters; they do
not assert that a consumer has migrated or passed its actual engine tests.

Remote release/tag creation, Pages deployment, and the ten consumer migrations
require published artifacts and separate verified consumer changes. They must
not be marked complete merely because the reusable implementation exists.
