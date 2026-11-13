# Remaining client AI network policy review

Proposed permission change for the nine remaining clients:

- Permit framing only the separate credential host `https://ai.hashbin.page` in editor/gallery pages. Existing preview/worker policies stay intact.
- For recovery copies that use direct, tab-only credentials, permit connections to `https://api.openai.com`, `https://openrouter.ai`, `https://api.anthropic.com`, and `https://generativelanguage.googleapis.com`.
- Canonical client configuration remains host-only. There is no silent direct fallback. Shared links never start requests. Provider requests still require explicit consent and a nonzero budget.
- Do not add localhost permissions or arbitrary external frame origins.

This changes the page's permitted destinations. It does not itself create a connection or grant document code network access inside the app-owned isolated execution environment.

Status: Owner approved this exact policy on 2026-11-12. Applied the separate-host frame permission and the four named provider destinations. Canonical configurations remain host-only; recovery copies use direct, tab-only credentials; unknown origins remain paste-only. No localhost expansion or host-isolation relaxation was applied.
