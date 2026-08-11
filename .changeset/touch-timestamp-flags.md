---
"just-bash": patch
---

Honor `touch -t` and `touch -r`. Both were accepted, had their argument skipped and were then discarded, so the file ended up stamped with the current time and nothing reported that the requested one had been dropped. `-t` now takes the POSIX `[[CC]YY]MMDDhhmm[.ss]` stamp, `-r` copies the reference file's time, and whichever of `-d`, `-t` and `-r` is written last wins. Both `-t` and `-d` read a zone-less spelling in `$TZ`, or in UTC when the shell has none, which is the contract `date` already follows.
