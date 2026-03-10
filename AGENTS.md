# AGENTS.md

## Cursor Cloud specific instructions

- For bug-fix tasks, reproduce each bug before changing code whenever a local or terminal-driven repro is feasible.
- Prefer high-confidence fixes with minimal code changes and narrow scope.
- Prioritize validation and input-guard fixes that convert avoidable 500s into explicit 4xx responses when inputs are invalid.
- Include concise repro evidence in responses (pre-fix behavior and post-fix verification commands/results).
- Run targeted checks relevant to the changed area (for example: direct API `curl` repros plus `npm run build` for Next.js route edits).
