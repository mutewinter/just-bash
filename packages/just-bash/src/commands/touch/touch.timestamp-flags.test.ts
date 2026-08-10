import { describe, expect, it } from "vitest";
import { Bash } from "../../Bash.js";

/**
 * `touch -t` and `touch -r` set the modification time.
 *
 * Both were accepted, had their argument skipped, and were then discarded, so
 * `touch -t 202001010000 f` left the file stamped with the current time and
 * said nothing about it. A script that stamps a file and then sorts by age
 * got the wrong answer with no failure anywhere to explain it.
 *
 * The `-t` stamp is `[[CC]YY]MMDDhhmm[.ss]`. Two-digit years pivot at 69:
 * 69-99 are 1969-1999, 00-68 are 2000-2068, which is the boundary POSIX
 * fixes for this format. With no year at all the stamp lands in the current
 * one.
 *
 * Measured against GNU coreutils touch 9.2. BSD touch accepts the same
 * stamp; it differs only in rejecting `-d` spellings GNU takes, which this
 * change does not touch.
 */

async function mtimeOf(bash: Bash, path: string): Promise<Date> {
  return (await bash.fs.stat(path)).mtime;
}

describe("touch -t", () => {
  it.each([
    ["202601020304", 2026, 0, 2, 3, 4, 0],
    ["2601020304.05", 2026, 0, 2, 3, 4, 5],
    ["6901020304", 1969, 0, 2, 3, 4, 0],
    ["6801020304", 2068, 0, 2, 3, 4, 0],
  ])("stamps %s onto the file", async (stamp, year, month, day, hour, minute, second) => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    const result = await bash.exec(`touch -t ${stamp} /w/f.txt`);
    expect(result.exitCode).toBe(0);

    const mtime = await mtimeOf(bash, "/w/f.txt");
    expect([
      mtime.getFullYear(),
      mtime.getMonth(),
      mtime.getDate(),
      mtime.getHours(),
      mtime.getMinutes(),
      mtime.getSeconds(),
    ]).toEqual([year, month, day, hour, minute, second]);
  });

  it("defaults a yearless stamp to the current year", async () => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    await bash.exec("touch -t 01020304 /w/f.txt");

    const mtime = await mtimeOf(bash, "/w/f.txt");
    expect(mtime.getFullYear()).toBe(new Date().getFullYear());
    expect(mtime.getMonth()).toBe(0);
    expect(mtime.getDate()).toBe(2);
  });

  it("creates the file it stamps", async () => {
    const bash = new Bash({ cwd: "/w", files: { "/w/keep": "" } });
    const result = await bash.exec("touch -t 202001010000 /w/new.txt");
    expect(result.exitCode).toBe(0);
    expect(await bash.fs.exists("/w/new.txt")).toBe(true);
    expect((await mtimeOf(bash, "/w/new.txt")).getFullYear()).toBe(2020);
  });

  it.each([
    "99",
    "202613010000",
    "202002300000",
    "2020010100000",
  ])("rejects %s as a date format", async (stamp) => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    const result = await bash.exec(`touch -t ${stamp} /w/f.txt`);
    expect(result.stderr).toBe(`touch: invalid date format '${stamp}'\n`);
    expect(result.exitCode).toBe(1);
  });

  it("reports a missing argument", async () => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    const result = await bash.exec("touch -t");
    expect(result.stderr).toBe("touch: option requires an argument -- 't'\n");
    expect(result.exitCode).toBe(1);
  });

  it("reads the stamp out of a combined short option", async () => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    const result = await bash.exec("touch -ct 202001010000 /w/f.txt");
    expect(result.exitCode).toBe(0);
    expect((await mtimeOf(bash, "/w/f.txt")).getFullYear()).toBe(2020);
  });
});

describe("touch -r", () => {
  it("copies the reference file's time", async () => {
    const bash = new Bash({
      cwd: "/w",
      files: { "/w/ref.txt": "", "/w/f.txt": "" },
    });
    const result = await bash.exec(
      "touch -t 202001020304 /w/ref.txt && touch -r /w/ref.txt /w/f.txt",
    );

    expect(result.exitCode).toBe(0);
    const mtime = await mtimeOf(bash, "/w/f.txt");
    expect([
      mtime.getFullYear(),
      mtime.getMonth(),
      mtime.getDate(),
      mtime.getHours(),
      mtime.getMinutes(),
    ]).toEqual([2020, 0, 2, 3, 4]);
  });

  it("reports a reference that does not exist", async () => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    const result = await bash.exec("touch -r /w/nope.txt /w/f.txt");
    expect(result.stderr).toBe(
      "touch: failed to get attributes of '/w/nope.txt': No such file or directory\n",
    );
    expect(result.exitCode).toBe(1);
  });
});

describe("touch -d", () => {
  it("reads a bare date as local midnight", async () => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    const result = await bash.exec("touch -d 2021-01-01 /w/f.txt");

    expect(result.exitCode).toBe(0);
    const mtime = await mtimeOf(bash, "/w/f.txt");
    expect([mtime.getFullYear(), mtime.getMonth(), mtime.getDate()]).toEqual([
      2021, 0, 1,
    ]);
  });
});

describe("touch timestamp flag precedence", () => {
  it.each([
    ["-d 2021-01-01 -t 202201010000", 2022],
    ["-t 202201010000 -d 2021-01-01", 2021],
  ])("lets the last of %s win", async (flags, year) => {
    const bash = new Bash({ cwd: "/w", files: { "/w/f.txt": "" } });
    const result = await bash.exec(`touch ${flags} /w/f.txt`);
    expect(result.exitCode).toBe(0);
    expect((await mtimeOf(bash, "/w/f.txt")).getFullYear()).toBe(year);
  });
});
