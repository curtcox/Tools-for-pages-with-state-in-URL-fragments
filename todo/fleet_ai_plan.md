# Remaining client AI adoption

Status 2026-11-12 (America/Chicago): source inventory complete; implementation in progress.

Bring Gnuplot, Livelier, Audio, Pages, Manim, Apptron, Sheets, MODL and Gripeline
to the same opt-in Ask/review/undo, settings, gallery suggestions and model
comparison flow as Python and R. Work on main in focused commits, following the
owner's latest repository instructions. Preserve published pins and app-owned
execution, parsing, sanitization, networking, drafts and document contracts.

Each consumer pins published Fragment Kit 0.4.3 without editing vendor bytes.
Canonical clients use a separate immutable AI-host entry with exact app origins;
Python's /v0.4.0/ and R's /v0.4.3/ bytes and policies remain unchanged.
Recovery copies use direct mode; unknown origins paste only; budgets begin at zero.
Keys never enter editor storage. Proposals wait for explicit Run/Render/Check.

For each app: wire the existing edit/draft path; add data-only synthetic cases
with honest app-specific checks; run required unit/static/conformance, real-engine
and Chromium/Firefox/WebKit gates; regenerate docs/offline manifests; commit and
push; publish canonical and recovery sites; verify actual bytes and browser flows.
Named checks must use fresh execution isolation or the app's pure parser/compiler;
no AI proposal may execute in the editor origin. Apptron comparisons validate
snapshots without booting a VM or granting networking. Pages proposals preserve
validated projects; Livelier captures a paused fresh world before review.

Reuse the existing approved test key and shared $10 cap. Before this rollout,
$0.275508408 was spent or reserved. Reserve before every paid call; no paid CI.
No new paid HashBin uploads are planned. Record real model comparisons and
limitations separately from mocked provider/transport checks.

Prepared source is not a deployment. Update this record with actual remote
revisions, successful workflow URLs, browser coverage, published file hashes
and budget evidence as the fleet ships. Native Safari, GPU and additional-provider
coverage stay unverified unless actually run.

## Implementation checkpoint

All nine working clones are under ignored `dist/ai-fleet/repos/`, on main at the
recorded inventory baselines. Published 0.4.3 is verified and copied unchanged.
Consumer Ask/review/undo, gallery chooser, settings, zero caps and 25-case suites
are implemented. Accepted changes save drafts and wait for explicit execution;
Pages also stops the old preview. Gripeline preserves its separate bash review.
Chromium acceptance/draft/undo/navigation/gallery/callback checks have passed in
all nine source previews; WebKit and the full original app gates are in progress.

The separate `/fleet-v0.4.3/` host is staged only, with nine exact origins. No
client source or host change has been pushed or deployed yet. Python/R source,
versioned host policies and release tags remain unchanged. Host tooling's full
1,017-test suite and lint (zero errors) passed before the popup compatibility
adapter was added; rerun both after its final changes.

Automatic approval review rejected a broad client provider/localhost policy.
The narrower proposal in `todo/fleet_csp_review.md` awaits owner response. A
proposed relaxation of the new host's popup policy was also rejected; it was
not applied. Keep its strict isolation and solve the credential handoff within
that boundary. Chromium's same-origin channel works; WebKit requires further
investigation. These are staging checks with synthetic keys, not live sign-in.

Manual three-model synthetic comparisons are running with the approved key and
shared $10 ledger. Reports contain only bounded results and hashes, no keys or
private documents. The first four completed apps have 75 results each; these
source assertions and document invariants are not runtime-quality scores.

## Published host and client rollout checkpoint

The owner approved the four-provider recovery policy on 2026-11-12. All recovery
copies now use direct, tab-only credentials; canonical copies remain host-only.
No localhost expansion or host isolation relaxation was applied.

Host commit `89551812964eb2b6ccd8200f5801ddf73802cd87` is deployed in run
43349881620, Cloudflare version `927ef80d-7186-4fcc-950c-f8dd29e912f7`.
All 282 served assets match the staged package; all 188 previous versioned assets
and both earlier response policies are preserved. Chromium, Firefox and WebKit
passed the strict-isolation key, PKCE, forget and stale-popup checks in that run.

All nine client source changes are committed and pushed on main. Local app unit
and static checks passed; all nine AI flows passed phone Chromium and WebKit
checks. Original engine checks passed after fixing Audio's missing offline AI
module and a malformed Manim policy comment. Remote three-browser gates and
recovery deployments are now running; Gnuplot, MODL and Gripeline have failed
checks to investigate before canonical publication. Livelier and Pages recovery
workflows have succeeded. Prepared or pushed source is not canonical deployment.

The 675 synthetic results contain 674 passes. The shared $10 ledger is at
$0.486313208 spent or reserved before final production live checks. Reports are
source assertions and document invariants, with native MODL parsing, not a claim
about general runtime code quality or a model winner. No paid HashBin uploads
were made for this fleet.
