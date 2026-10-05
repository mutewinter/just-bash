---
"just-bash": patch
---

python3: fail at once when the worker dies instead of waiting out the timeout

When the Python worker errored, exited, or could not be constructed without sending the bridge its EXIT, the result was settled but the bridge kept polling, so the command returned only when `maxPythonTimeoutMs` ran out, as exit 124 with `execution timeout exceeded` ahead of the worker's own error. A worker file missing from a bundle is the common way in. A worker that died while the bridge was serving one of its filesystem, HTTP, command, or tool requests left the bridge awaiting that request the same way, or indefinitely if it never settled. The command now fails at once with exit 1 and the worker's error.
