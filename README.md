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

[v0.1.0 is published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.1.0),
and the [demo and docs are live](https://curtcox.github.io/Tools-for-pages-with-state-in-URL-fragments/).
[v0.2.0 is also published](https://github.com/curtcox/Tools-for-pages-with-state-in-URL-fragments/releases/tag/v0.2.0),
with consumer migration compatibility. See [current rollout status](todo/rollout-status.md)
for consumer PRs and remaining deployment checks.
