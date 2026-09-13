---
"just-bash": minor
---

`js-exec` accepts `-e`/`--eval` as another spelling of `-c` and `-p`/`--print` to print an expression's value, the options `node` takes for inline code, and `process.argv` now has Node's shape: the executable first, then the script for a file (nothing for inline code, as with `node -e`), then the arguments, so `process.argv.slice(2)` is the script's arguments. Before, `argv[0]` was the script path and `slice(2)` dropped the first argument.
