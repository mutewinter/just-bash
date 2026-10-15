import { describe, expect, it } from "vitest";
import { InMemoryFs } from "../in-memory-fs/in-memory-fs.js";
import type { DirentEntry, FsStat, IFileSystem } from "../interface.js";
import { MountableFs } from "./mountable-fs.js";

/** A filesystem that answers no listing with file types, so each entry is stat'd. */
function withoutDirents(delegate: IFileSystem): IFileSystem {
  return new Proxy(delegate, {
    get(target, key, receiver) {
      if (key === "readdirWithFileTypes") {
        return undefined;
      }
      const value: unknown = Reflect.get(target, key, receiver);
      return typeof value === "function"
        ? (...args: unknown[]): unknown => Reflect.apply(value, target, args)
        : value;
    },
  });
}

const named = (entries: DirentEntry[]) => entries.map((entry) => entry.name);
const typed = (entries: DirentEntry[], name: string) =>
  entries.find((entry) => entry.name === name);

describe("MountableFs readdirWithFileTypes", () => {
  it("reads the owning filesystem's own types", async () => {
    const fs = new MountableFs({
      base: new InMemoryFs({ "/a.txt": "a", "/dir/b.txt": "b" }),
    });

    const entries = await fs.readdirWithFileTypes("/");

    expect(named(entries)).toEqual(["a.txt", "dir"]);
    expect(typed(entries, "a.txt")).toMatchObject({
      isDirectory: false,
      isFile: true,
    });
    expect(typed(entries, "dir")).toMatchObject({
      isDirectory: true,
      isFile: false,
    });
  });

  it("lists a mount point as a directory of its own", async () => {
    const fs = new MountableFs({ base: new InMemoryFs({ "/a.txt": "a" }) });
    fs.mount("/mnt", new InMemoryFs({ "/inside.txt": "in" }));

    const entries = await fs.readdirWithFileTypes("/");

    expect(named(entries)).toEqual(["a.txt", "mnt"]);
    expect(typed(entries, "mnt")).toMatchObject({
      isDirectory: true,
      isFile: false,
      isSymbolicLink: false,
    });
  });

  it("reads through a mount to the filesystem under it", async () => {
    const fs = new MountableFs({ base: new InMemoryFs({}) });
    fs.mount(
      "/mnt",
      new InMemoryFs({ "/inside.txt": "in", "/sub/c.txt": "c" }),
    );

    const entries = await fs.readdirWithFileTypes("/mnt");

    expect(named(entries)).toEqual(["inside.txt", "sub"]);
    expect(typed(entries, "sub")?.isDirectory).toBe(true);
  });

  it("asks a filesystem with no listing of its own about each entry", async () => {
    const fs = new MountableFs({
      base: withoutDirents(
        new InMemoryFs({ "/a.txt": "a", "/dir/b.txt": "b" }),
      ),
    });

    const entries = await fs.readdirWithFileTypes("/");

    expect(named(entries)).toEqual(["a.txt", "dir"]);
    expect(typed(entries, "dir")?.isDirectory).toBe(true);
    expect(typed(entries, "a.txt")?.isFile).toBe(true);
  });

  it("keeps an entry it cannot stat in the listing, with no type", async () => {
    const backing = new InMemoryFs({ "/a.txt": "a", "/gone": "" });
    const base: IFileSystem = new Proxy(withoutDirents(backing), {
      get(target, key, receiver) {
        if (key === "lstat") {
          return async (path: string): Promise<FsStat> => {
            if (path === "/gone") {
              throw Object.assign(new Error("ENOENT: no such file"), {
                code: "ENOENT",
              });
            }
            return backing.lstat(path);
          };
        }
        const value: unknown = Reflect.get(target, key, receiver);
        return typeof value === "function"
          ? (...args: unknown[]): unknown => Reflect.apply(value, target, args)
          : value;
      },
    });
    const fs = new MountableFs({ base });

    const entries = await fs.readdirWithFileTypes("/");

    expect(named(entries)).toEqual(["a.txt", "gone"]);
    expect(typed(entries, "gone")).toMatchObject({
      isDirectory: false,
      isFile: false,
      isSymbolicLink: false,
    });
  });

  it("answers mount points for a directory the base does not hold", async () => {
    const fs = new MountableFs({ base: new InMemoryFs({}) });
    fs.mount("/mnt/data", new InMemoryFs({ "/d.txt": "d" }));

    expect(named(await fs.readdirWithFileTypes("/mnt"))).toEqual(["data"]);
  });

  it("throws what readdir throws for a directory nothing holds", async () => {
    const fs = new MountableFs({ base: new InMemoryFs({}) });

    await expect(fs.readdirWithFileTypes("/nope")).rejects.toThrow();
    await expect(fs.readdir("/nope")).rejects.toThrow();
  });

  it("names the same entries readdir does", async () => {
    const fs = new MountableFs({
      base: new InMemoryFs({ "/a.txt": "a", "/b/c.txt": "c" }),
    });
    fs.mount("/mnt", new InMemoryFs({}));

    expect(named(await fs.readdirWithFileTypes("/"))).toEqual(
      await fs.readdir("/"),
    );
  });
});
