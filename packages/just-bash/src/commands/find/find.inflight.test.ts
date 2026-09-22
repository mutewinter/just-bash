import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Bash } from "../../Bash.js";
import { InMemoryFs } from "../../fs/in-memory-fs/in-memory-fs.js";
import type { DirentEntry } from "../../fs/interface.js";

// Taken before any command runs: the defense-in-depth box blocks the global
// during an execution, and a real disk's reads settle on the host's own timers.
const hostSetTimeout = setTimeout;

/**
 * A filesystem whose directory reads take real time, like a disk. On
 * InMemoryFs every read settles before `find` can fail, so nothing is still
 * running when it returns and the failure this covers cannot occur.
 */
class SlowReaddirFs extends InMemoryFs {
  private readonly pause = () =>
    new Promise<void>((resolve) => hostSetTimeout(resolve, 5));

  override async readdir(path: string): Promise<string[]> {
    await this.pause();
    return super.readdir(path);
  }

  override async readdirWithFileTypes(path: string): Promise<DirentEntry[]> {
    await this.pause();
    return super.readdirWithFileTypes(path);
  }
}

function tree(): Record<string, string> {
  const files: Record<string, string> = {};
  for (let d = 0; d < 30; d++) {
    for (let f = 0; f < 50; f++) files[`/t/d${d}/f${f}`] = "";
  }
  return files;
}

describe("find failing part way through a batch", () => {
  const unhandled: unknown[] = [];
  const record = (reason: unknown) => {
    unhandled.push(reason);
  };

  beforeEach(() => {
    unhandled.length = 0;
    process.on("unhandledRejection", record);
  });

  afterEach(() => {
    process.off("unhandledRejection", record);
  });

  it("leaves nothing running to reject after it returns", async () => {
    const bash = new Bash({
      fs: new SlowReaddirFs(tree()),
      executionLimits: { maxTraversalEntries: 500, maxTraversalWork: 500 },
    });

    const result = await bash.exec("find /t -type f");
    // Long enough for every sibling read in the failed batch to settle.
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.exitCode).toBe(126);
    expect(result.stderr).toMatch(/find: filesystem traversal .*limit exceeded/);
    expect(unhandled).toEqual([]);
  });
});
