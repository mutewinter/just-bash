---
"just-bash": patch
---

interpreter: preserve leading whitespace in multi-line quoted strings (fixes #259)

`exec()` ran every script through a `normalizeScript()` pass that `trimStart()`'d
each non-heredoc line to allow indented template literals. That re-implemented
the lexer's quoting rules line-by-line and got them wrong: leading indentation
inside a multi-line single- or double-quoted string was stripped. The most
visible symptom was `python3 -c '...'` (and `node -e`, `awk`, etc.) with an
indented body failing with `IndentationError`, while the same code via heredoc
or pipe worked.

The normalization is unnecessary — the lexer already handles leading whitespace
on command lines — so it has been removed entirely. The raw script is now parsed
as-is, matching real bash. The `rawScript` exec option is now a no-op (kept for
backward compatibility). This also un-skips four sed spec tests whose indented
stdin was previously being corrupted.
