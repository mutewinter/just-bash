import { sanitizeErrorMessage } from "./fs/sanitize-error.js";
import {
  ExecutionAbortedError,
  ExecutionLimitError,
} from "./interpreter/errors.js";
import { SecurityViolationError } from "./security/defense-in-depth-box.js";

/**
 * Rethrow errors that command-level recovery must never turn into ordinary
 * command failures. Call this first in broad catch blocks.
 */
export function rethrowFatalExecutionError(error: unknown): void {
  if (
    error instanceof ExecutionLimitError ||
    error instanceof ExecutionAbortedError ||
    error instanceof SecurityViolationError
  ) {
    throw error;
  }
}

/**
 * Rethrow an execution limit a command caught, with stderr naming the
 * command. The limit still ends the script, so a later pipeline stage or an
 * `||` cannot pass the command's partial output off as a success. `stdout`
 * is what the command wrote before the limit, reported as the script's own.
 */
export function rethrowCommandLimit(
  command: string,
  error: ExecutionLimitError,
  stdout = "",
): never {
  throw new ExecutionLimitError(
    error.message,
    error.limitType,
    stdout,
    `${command}: ${sanitizeErrorMessage(error.message)}\n`,
  );
}
