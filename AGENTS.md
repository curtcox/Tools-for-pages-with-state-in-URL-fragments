# Fragment Kit

Work directly on main and commit often, in small, focused commits, unless asked to do
otherwise. Do not create a feature branch or pull request unless asked.

Buildless native ES modules; Node 22.12+ for tooling and tests. Do not add a production
bundler. Document adapters and execution isolation belong to consumers.

Read docs/contracts.md before changing runtime APIs. Explicit URLs win over drafts;
invalid links fail visibly. Bound untrusted bytes before decoding and verify CIDs.
HashBin Publish must start synchronously in a click after SDK initialization, and
must never retain credentials on an app origin. Prefix all storage and cache names.
Preserve pinned vendor bytes and licenses; update vendor/integrity.json deliberately.

Run npm test, npm run check and npm run test:browser after runtime changes. Report
each browser that actually ran. Regenerate the pinned demo with npm run demo after
runtime changes. Never move release tags. Release and migration status must describe
actual remote state; a prepared artifact is not a published release or deployment.
