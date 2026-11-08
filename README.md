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

[v0.3.5 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.5),
with verified release artifacts and the checked-in demo pin. The
[demo and docs are live](https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/).
See [current rollout status](todo/rollout-status.md) for consumer migrations and deployment evidence.

Consumers reference the reusable workflows at immutable `@v2`, created at
`5c12e840cbc2229e1d905830204c78bce6b27cc9` after all three browser gates passed.
This fixes Ubuntu's separate apt mirror-list files. The earlier `v1` remains
unchanged. Runtime code stays pinned to an exact release such as
`vendor/fragment-kit-v0.3.5`; workflow majors do not declare runtime releases.
Future workflow updates require a new immutable reference and an explicit consumer change.

**[v0.3.5 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.3.5)**:
compact controls, readable light/dark buttons, visible dialog dismissal and
individual-pane/split workspace views. Consumer deployments and live acceptance
are recorded in [rollout status](todo/rollout-status.md).

## Optional AI

Version 0.4.0 adds optional AI through a separate entry point. See
[AI adoption](docs/ai.md) and [actual implementation/evidence status](docs/ai-status.md).
Check [the release page](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.4.0) for published availability. The AI-host and Python production rollout have separate approval and acceptance gates.
