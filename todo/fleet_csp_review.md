# Remaining client AI network policy review

Proposed permission change for the nine remaining clients:

- Permit framing only the separate credential host `https://ai.hashbin.page` in editor/gallery pages. Existing preview/worker policies stay intact.
- For recovery copies that use direct, tab-only credentials, permit connections to `https://api.openai.com`, `https://openrouter.ai`, `https://api.anthropic.com`, and `https://generativelanguage.googleapis.com`.
- Canonical client configuration remains host-only. There is no silent direct fallback. Shared links never start requests. Provider requests still require explicit consent and a nonzero budget.
- Do not add localhost permissions or arbitrary external frame origins.

This changes the page's permitted destinations. It does not itself create a connection or grant document code network access inside the app-owned isolated execution environment.

Status: awaiting owner decision after automatic approval review rejected the earlier broader provider-and-localhost proposal. No rejected network-policy mutation was applied.
