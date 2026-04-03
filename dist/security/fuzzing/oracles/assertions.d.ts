/**
 * Reusable security assertions for fuzz testing and manual tests.
 *
 * These assertions check for common security issues like native code exposure
 * and prototype pollution indicators.
 */
export interface SecurityCheckResult {
    safe: boolean;
    issues: string[];
}
/**
 * Check if output contains native JavaScript code indicators.
 */
export declare function checkForNativeCode(output: string): SecurityCheckResult;
/**
 * Check if output contains prototype pollution indicators.
 */
export declare function checkForPollutionIndicators(output: string): SecurityCheckResult;
/**
 * Combined security check for output.
 */
export declare function checkOutputSecurity(output: string): SecurityCheckResult;
/**
 * Assert that output does not contain native JavaScript code.
 * Use this in tests to verify bash/jq output is safe.
 *
 * @example
 * const result = await env.exec("echo ${__proto__}");
 * assertNoNativeCode(result.stdout);
 * assertNoNativeCode(result.stderr);
 */
export declare function assertNoNativeCode(output: string | undefined, context?: string): void;
/**
 * Assert that output does not contain prototype pollution indicators.
 *
 * @example
 * const result = await env.exec("echo ${constructor}");
 * assertNoPollutionIndicators(result.stdout);
 */
export declare function assertNoPollutionIndicators(output: string | undefined, context?: string): void;
/**
 * Assert that output is safe from all known security issues.
 * Combines native code and pollution indicator checks.
 *
 * @example
 * const result = await env.exec(script);
 * assertOutputSafe(result.stdout, "stdout");
 * assertOutputSafe(result.stderr, "stderr");
 */
export declare function assertOutputSafe(output: string | undefined, context?: string): void;
/**
 * Assert that a bash execution result is safe.
 * Checks both stdout and stderr.
 *
 * @example
 * const result = await env.exec(script);
 * assertExecResultSafe(result);
 */
export declare function assertExecResultSafe(result: {
    stdout?: string;
    stderr?: string;
}): void;
