---
"just-bash": minor
---

stat: expand every `-c` directive, and print `?` for one that cannot be answered

`stat -c '%Y' file` printed the two characters `%Y` and exited 0. The format expansion matched `/%[nNsFaAuUgG]/g` and returned any other directive as itself, so the whole timestamp family passed through as its own source text. `stat -c 'mtime=%Y'` is the idiom for reading a modification time, and its output was `mtime=%Y`, which looks like output rather than like a gap: nothing in the exit code, stderr, or the string says the value is missing.

- `%y` / `%Y` (modify), `%x` / `%X` (access), `%z` / `%Z` (change) are expanded. The filesystem keeps one timestamp per file, so access and change report the modification time.
- `%w` / `%W` (birth) report `-` and `0`, which is what GNU prints where a filesystem does not record birth time.
- `%y`, `%x` and `%z` render as GNU does, `2024-01-15 09:17:14.764000000 +0000`, in `$TZ` when it names a zone Intl accepts and UTC otherwise, the same contract `date` uses. The filesystem stores milliseconds, so the last six digits of the nanoseconds are always zero.
- `%%` is a literal percent, a `%` at the end of FORMAT prints as itself, and `-`, `0` and a width are honored, so `%5s` and `%-5s` pad.
- A directive with no value, whether unknown or naming something this filesystem does not record, prints `?` as it does in GNU.
- `%a` is the permission bits alone. It was `stat.mode.toString(8)`, which carries the file type: a 0644 file reported `100644` where GNU reports `644`.

`%n`, `%N`, `%s`, `%F`, `%A`, `%u`, `%U`, `%g` and `%G` are unchanged, as is the default output.

`%b`, `%B`, `%h`, `%i`, `%d`, `%D`, `%f`, `%o`, `%t`, `%T` and `%m` print `?`. Each names something `FsStat` does not carry (allocated blocks, link count, inode, device, mount point), and inventing a plausible constant for them is the failure this change is fixing. They are one small `FsStat` addition away if that is wanted.
