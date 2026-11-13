# Fragment Kit

Browser-native modules for static apps with complete document state in URL
fragments. Includes legacy URL readers, bounded codecs, verified HashBin loads
and Publish, QR generation/scanning, local recovery, sharing, offline/PWA,
mobile shell, gallery and consumer tooling. No production bundler or runtime server.

```sh
npm ci
npm test
npx playwright install chromium firefox webkit
npm run demo
npm run check
npm run test:browser
npm run serve
```

Open [Fragment Notes](http://127.0.0.1:8000/demo/) or
[the documentation](http://127.0.0.1:8000/docs/).
The demo imports a checked-in pinned copy exactly like a consumer.

See [runtime contracts](docs/contracts.md), [migration guide](docs/migration.md),
[tooling](docs/tooling.md), [implementation status](docs/implementation-status.md),
and [the master plan](todo/master_plan.md).

See [client reuse through 256t links](CLIENT-REUSE.md) for the compatibility
matrix and proposed shared mechanisms for cross-repo reuse and embedding.

[v0.4.3 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.4.3),
with verified release artifacts and the checked-in demo pin. The
[demo and docs are live](https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/).
See [current rollout status](todo/rollout-status.md) for consumer migrations and deployment evidence.

Consumers reference the reusable workflows at immutable `@v2`, created at
`5c12e840cbc2229e1d905830204c78bce6b27cc9` after all three browser gates passed.
This fixes Ubuntu's separate apt mirror-list files. The earlier `v1` remains
unchanged. Runtime code stays pinned to an exact release such as
`vendor/fragment-kit-v0.4.3`; workflow majors do not declare runtime releases.
Future workflow updates require a new immutable reference and an explicit consumer change.

Published `@v4` of **test.yml only** adds optional `working-directory`
(default `.`) for applications inside monorepos. Its nested-package smoke workflow
checks install, pre-test, unit/check/gallery, server, contracts and browser commands.
The owner-approved immutable tag resolves to `3de01b1e3ea6c2508a1831ada35c84e8e242925a`.
The existing `@v3` (`8807ee5`) predates this input and remains unchanged.
Existing consumers and `pages.yml` / `kit-check.yml` remain on immutable `@v2`.
All shell steps, including `pre-test`, server startup and contract/browser
commands, run in the selected directory. `kit-path` and contract config paths
are relative to it. Node's npm cache keys use that directory's `package-lock.json`,
and failure artifacts come from its `test-results/`. A pre-test that builds the
enclosing workspace should first `cd "$GITHUB_WORKSPACE"`.

Runtime v0.4.4 is prepared, not published. It vendors the deployed SDK v0.6.0
for opt-in opaque DOM execution alongside the unchanged v0.4.0 SDK. Consumers
remain on their exact runtime pins until they explicitly upgrade.

**[v0.3.5 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.5)**:
compact controls, readable light/dark buttons, visible dialog dismissal and
individual-pane/split workspace views. Consumer deployments and live acceptance
are recorded in [rollout status](todo/rollout-status.md).

## Optional AI

Version 0.4.0 adds optional AI through a separate entry point. See
[AI adoption](docs/ai.md) and [historical implementation snapshot](docs/ai-status.md) and [current adoption evidence](todo/fleet_ai_acceptance.json).
Published [v0.4.3](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.4.3) is deployed in all eleven client editors. Canonical apps use separate credential hosts; recovery copies use direct, session-only connections. Review, undo, gallery suggestions and model comparisons remain opt-in. [Deployment and verification receipts](todo/rollout-status.md) record actual remote state and remaining coverage limits.
