import { getErrorMessage } from "../../interpreter/helpers/errors.js";
import type {
  ExecResult,
  RuntimeCommand,
  RuntimeCommandContext,
} from "../../types.js";
import { unknownOption } from "../help.js";

/**
 * Parse a date string in various formats supported by touch -d
 * Supports:
 * - YYYY/MM/DD or YYYY-MM-DD
 * - YYYY/MM/DD HH:MM:SS or YYYY-MM-DD HH:MM:SS
 * - ISO 8601 format
 */
function parseDateString(dateStr: string): Date | null {
  // Try common date formats
  // Replace / with - for consistency
  const normalized = dateStr.replace(/\//g, "-");

  // A bare YYYY-MM-DD is midnight local time, which is what touch means by
  // it. The Date constructor reads that same spelling as UTC, so it has to
  // be built from components before the general parse gets a look at it.
  const dateMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    const date = new Date(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10) - 1,
      Number.parseInt(day, 10),
    );
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  // Try parsing as ISO 8601 or simple date
  const date = new Date(normalized);
  if (!Number.isNaN(date.getTime())) {
    return date;
  }

  // Try YYYY-MM-DD HH:MM:SS format
  const dateTimeMatch = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
  );
  if (dateTimeMatch) {
    const [, year, month, day, hour, minute, second] = dateTimeMatch;
    const dateTime = new Date(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10) - 1,
      Number.parseInt(day, 10),
      Number.parseInt(hour, 10),
      Number.parseInt(minute, 10),
      Number.parseInt(second, 10),
    );
    if (!Number.isNaN(dateTime.getTime())) {
      return dateTime;
    }
  }

  return null;
}

/**
 * Parse the stamp `touch -t` takes: `[[CC]YY]MMDDhhmm[.ss]`.
 *
 * Two-digit years pivot at 69, the boundary POSIX fixes for this format: 69
 * through 99 are 1969-1999, 00 through 68 are 2000-2068. Without a year at
 * all the stamp lands in the current one.
 */
function parseTimestampString(stamp: string): Date | null {
  const match = /^(\d{8}|\d{10}|\d{12})(?:\.(\d{2}))?$/.exec(stamp);
  if (!match) return null;

  const [, digits, secondsPart] = match;
  const rest = digits.slice(digits.length - 8);
  const yearDigits = digits.slice(0, digits.length - 8);

  let year: number;
  if (yearDigits.length === 4) {
    year = Number.parseInt(yearDigits, 10);
  } else if (yearDigits.length === 2) {
    const twoDigit = Number.parseInt(yearDigits, 10);
    year = twoDigit >= 69 ? 1900 + twoDigit : 2000 + twoDigit;
  } else {
    year = new Date().getFullYear();
  }

  const month = Number.parseInt(rest.slice(0, 2), 10);
  const day = Number.parseInt(rest.slice(2, 4), 10);
  const hour = Number.parseInt(rest.slice(4, 6), 10);
  const minute = Number.parseInt(rest.slice(6, 8), 10);
  const second = secondsPart ? Number.parseInt(secondsPart, 10) : 0;

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (hour > 23 || minute > 59 || second > 60) return null;

  const date = new Date(year, month - 1, day, hour, minute, second);
  if (Number.isNaN(date.getTime())) return null;
  // Reject a day the month does not have, which Date would roll forward.
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

/** Where the timestamp to write came from; the last flag given wins. */
type TimeSource =
  | { kind: "date"; value: string }
  | { kind: "stamp"; value: string }
  | { kind: "reference"; value: string };

export const touchCommand: RuntimeCommand = {
  name: "touch",

  async execute(
    args: string[],
    ctx: RuntimeCommandContext,
  ): Promise<ExecResult> {
    const files: string[] = [];
    let timeSource: TimeSource | null = null;
    let noCreate = false;

    // Parse arguments
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg === "--") {
        // Rest are files
        files.push(...args.slice(i + 1));
        break;
      } else if (arg === "-d" || arg === "--date") {
        // -d DATE or --date=DATE
        if (i + 1 >= args.length) {
          return {
            stdout: "",
            stderr: "touch: option requires an argument -- 'd'\n",
            exitCode: 1,
          };
        }
        timeSource = { kind: "date", value: args[++i] };
      } else if (arg.startsWith("--date=")) {
        timeSource = { kind: "date", value: arg.slice("--date=".length) };
      } else if (arg === "-c" || arg === "--no-create") {
        noCreate = true;
      } else if (arg === "-t" || arg === "-r") {
        if (i + 1 >= args.length) {
          return {
            stdout: "",
            stderr: `touch: option requires an argument -- '${arg.slice(1)}'\n`,
            exitCode: 1,
          };
        }
        timeSource = {
          kind: arg === "-t" ? "stamp" : "reference",
          value: args[++i],
        };
      } else if (arg === "-a" || arg === "-m") {
        // The filesystem keeps only a modification time, so selecting which
        // of the two to write has nothing to select between.
      } else if (arg.startsWith("--")) {
        return unknownOption("touch", arg);
      } else if (arg.startsWith("-") && arg.length > 1) {
        // Check for combined short options like -cm
        let skipNext = false;
        for (const char of arg.slice(1)) {
          if (char === "c") {
            noCreate = true;
          } else if (char === "a" || char === "m") {
            // Silently ignore
          } else if (char === "d" || char === "t" || char === "r") {
            // Each of these consumes the next argument.
            if (i + 1 >= args.length) {
              return {
                stdout: "",
                stderr: `touch: option requires an argument -- '${char}'\n`,
                exitCode: 1,
              };
            }
            timeSource = {
              kind:
                char === "d" ? "date" : char === "t" ? "stamp" : "reference",
              value: args[++i],
            };
            skipNext = true;
            break;
          } else {
            return unknownOption("touch", `-${char}`);
          }
        }
        if (skipNext) continue;
      } else {
        files.push(arg);
      }
    }

    if (files.length === 0) {
      return {
        stdout: "",
        stderr: "touch: missing file operand\n",
        exitCode: 1,
      };
    }

    // Resolve whichever of -d, -t and -r was given last
    let targetTime: Date | null = null;
    if (timeSource !== null) {
      if (timeSource.kind === "reference") {
        try {
          const reference = ctx.fs.resolvePath(ctx.cwd, timeSource.value);
          // Copy the instant out rather than keeping the Date the context
          // handed back: that object stops answering once the command ends,
          // and it is about to be written into the filesystem.
          targetTime = new Date((await ctx.fs.stat(reference)).mtime.getTime());
        } catch {
          return {
            stdout: "",
            stderr: `touch: failed to get attributes of '${timeSource.value}': No such file or directory\n`,
            exitCode: 1,
          };
        }
      } else {
        targetTime =
          timeSource.kind === "stamp"
            ? parseTimestampString(timeSource.value)
            : parseDateString(timeSource.value);
        if (targetTime === null) {
          return {
            stdout: "",
            stderr: `touch: invalid date format '${timeSource.value}'\n`,
            exitCode: 1,
          };
        }
      }
    }

    let stderr = "";
    let exitCode = 0;

    for (const file of files) {
      try {
        const fullPath = ctx.fs.resolvePath(ctx.cwd, file);
        const exists = await ctx.fs.exists(fullPath);

        if (!exists) {
          if (noCreate) {
            // -c: don't create, just skip
            continue;
          }
          await ctx.fs.writeFile(fullPath, "");
        }

        // Update timestamp if we have utimes support
        const mtime = targetTime ?? new Date();
        await ctx.fs.utimes(fullPath, mtime, mtime);
      } catch (error) {
        stderr += `touch: cannot touch '${file}': ${getErrorMessage(error)}\n`;
        exitCode = 1;
      }
    }

    return { stdout: "", stderr, exitCode };
  },
};

import type { CommandFuzzInfo } from "../fuzz-flags-types.js";

export const flagsForFuzzing: CommandFuzzInfo = {
  name: "touch",
  flags: [
    { flag: "-c", type: "boolean" },
    { flag: "-a", type: "boolean" },
    { flag: "-m", type: "boolean" },
    { flag: "-d", type: "value", valueHint: "string" },
    { flag: "-t", type: "value", valueHint: "string" },
    { flag: "-r", type: "value", valueHint: "path" },
  ],
  needsArgs: true,
};
