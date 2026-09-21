---
"just-bash": patch
---

interpreter: tell a custom command whether fd 0 is connected

A custom command received `ctx.stdin` as bytes and nothing about where they came from, so `false | cmd` and a bare `cmd` arrived identically. A command that reads stdin only when it has one (ripgrep, which walks the directory otherwise) had to guess, and guessing from the byte count turns every failed producer into a directory walk. `ctx.stdinConnected` now says whether a pipe, a redirection, or an enclosing group's stdin is on the other end of fd 0, even when nothing arrived.

Underneath, every pipeline stage after the first now owns its stdin the way a redirection from an empty file does, so the flag also holds for a command inside a group, subshell, or function that a pipe feeds.
