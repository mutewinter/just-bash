---
"just-bash": patch
---

Honor `touch -t` and `touch -r`. Both were accepted, had their argument skipped and were then discarded, so the file ended up stamped with the current time and nothing reported that the requested one had been dropped. `-t` now takes the POSIX `[[CC]YY]MMDDhhmm[.ss]` stamp, `-r` copies the reference file's time, and whichever of `-d`, `-t` and `-r` is written last wins. A bare `-d YYYY-MM-DD` is also now read as local midnight rather than UTC, which moved the date a day earlier everywhere west of Greenwich.
