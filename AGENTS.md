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

AI is opt-in through its separate entry point. Loading links never calls a model,
downloads weights or spends money. Keys stay out of app-origin storage, URLs,
documents, drafts, reports and logs. Model output is bounded, strictly normalized,
text-rendered, and applied/run only by explicit user action. Reserve estimated
cost before every paid call and set maxTokens. Manifests, suites and reports are
data only; verify weight hashes on write/read and load only pinned kit engines.
Show data destinations before consent; host access uses exact origin allowlists,
per-app consent and budgets, with no silent connection fallback.
