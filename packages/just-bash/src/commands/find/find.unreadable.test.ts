import { describe, expect, it } from "vitest";
import { Bash } from "../../Bash.js";
import { InMemoryFs } from "../../fs/in-memory-fs/in-memory-fs.js";
import type { IFileSystem } from "../../fs/interface.js";

/**
 * A filesystem where one directory cannot be listed, the way a home
 * directory's `.Trash` or a protected `Library` folder cannot be on macOS.
 * Both readdir entry points refuse it, since `find` prefers the typed one
 * when the filesystem offers it.
 */
function withUnreadableDirectory(
  fs: IFileSystem,
  unreadable: string,
): IFileSystem {
  return new Proxy(fs, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") {
        return value;
      }
      if (prop === "readdir" || prop === "readdirWithFileTypes") {
        return async (path: string, ...rest: unknown[]) => {
          if (path === unreadable) {
            throw new Error(`EACCES: permission denied, scandir '${path}'`);
          }
          return value.call(target, path, ...rest);
        };
      }
      return value.bind(target);
    },
  }) as IFileSystem;
}

function home(): Bash {
  const fs = withUnreadableDirectory(
    new InMemoryFs({
      "/Users/jeremy/.Trash/old.txt": "gone",
      "/Users/jeremy/Documents/notes.md": "# notes",
      "/Users/jeremy/Documents/vault/.obsidian/app.json": "{}",
      "/Users/jeremy/Downloads/paper.pdf": "pdf",
    }),
    "/Users/jeremy/.Trash",
  );
  return new Bash({ fs });
}

describe("find over an unreadable directory", () => {
  it("names the directory it could not read and keeps going", async () => {
    const result = await home().exec("find /Users/jeremy -name '*.md'");

    expect(result.stdout).toBe("/Users/jeremy/Documents/notes.md\n");
    expect(result.stderr).toBe("find: /Users/jeremy/.Trash: Permission denied\n");
    expect(result.exitCode).toBe(1);
  });

  it("still lists the directory itself, as GNU find does", async () => {
    const result = await home().exec("find /Users/jeremy -type d -name '.*'");

    expect(result.stdout).toBe(
      "/Users/jeremy/.Trash\n/Users/jeremy/Documents/vault/.obsidian\n",
    );
    expect(result.exitCode).toBe(1);
  });

  it("keeps the results reachable through a pipeline", async () => {
    const result = await home().exec(
      "find /Users/jeremy -name 'app.json' 2>/dev/null | head -1",
    );

    expect(result.stdout).toBe("/Users/jeremy/Documents/vault/.obsidian/app.json\n");
    expect(result.exitCode).toBe(0);
  });

  it("does not call a directory it could not read empty", async () => {
    const result = await home().exec("find /Users/jeremy -type d -empty");

    expect(result.stdout).toBe("");
    expect(result.stderr).toBe("find: /Users/jeremy/.Trash: Permission denied\n");
  });

  it("does not descend into it when it is not asked to read it", async () => {
    const result = await home().exec("find /Users/jeremy -maxdepth 1 -type d");

    expect(result.stdout).toBe(
      "/Users/jeremy\n/Users/jeremy/.Trash\n/Users/jeremy/Documents\n/Users/jeremy/Downloads\n",
    );
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });
});
