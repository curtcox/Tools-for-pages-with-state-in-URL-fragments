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

Version 0.1.0 is unreleased. `npm run release:prepare` creates local artifacts;
GitHub Release publication, Pages deployment and consumer migrations are separate
operations with their own verification.
