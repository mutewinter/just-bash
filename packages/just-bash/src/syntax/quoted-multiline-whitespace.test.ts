import { describe, expect, it } from "vitest";
import { Bash } from "../Bash.js";

// Regression tests: the script must NOT be normalized line-by-line. Leading
// whitespace inside a multi-line single- or double-quoted string is literal
// and must be preserved verbatim (POSIX). A prior `normalizeScript` pass
// trimStart()'d every non-heredoc line, corrupting indented quoted content
// (e.g. `python3 -c '...'` bodies).
describe("multi-line quoted string whitespace", () => {
  it("preserves leading indentation inside a single-quoted string", async () => {
    const env = new Bash();
    const result = await env.exec(
      "printf '%s' 'import sys\nfor p in [1]:\n    print(p)\n'",
    );
    expect(result.stdout).toBe("import sys\nfor p in [1]:\n    print(p)\n");
    expect(result.exitCode).toBe(0);
  });

  it("preserves leading indentation inside a double-quoted string", async () => {
    const env = new Bash();
    const result = await env.exec(
      'printf "%s" "first\n    second\n        third\n"',
    );
    expect(result.stdout).toBe("first\n    second\n        third\n");
    expect(result.exitCode).toBe(0);
  });

  it("preserves indentation through a variable assignment and expansion", async () => {
    const env = new Bash();
    const result = await env.exec(
      "v='a\n    b\n        c'\nprintf '%s' \"$v\"",
    );
    expect(result.stdout).toBe("a\n    b\n        c");
    expect(result.exitCode).toBe(0);
  });

  it("still allows the surrounding script itself to be indented", async () => {
    const env = new Bash();
    const result = await env.exec(
      "    if true; then\n        printf '%s' '    keep'\n    fi",
    );
    expect(result.stdout).toBe("    keep");
    expect(result.exitCode).toBe(0);
  });
});
