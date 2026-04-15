/**
 * Sandbox Oracle
 *
 * Detects sandbox escape attempts in fuzz results.
 */
import type { FuzzResult } from "../runners/fuzz-runner.js";
/**
 * Result of sandbox oracle check.
 */
export interface SandboxOracleResult {
    /** Whether the sandbox was potentially escaped */
    escaped: boolean;
    /** Specific issues detected */
    issues: SandboxIssue[];
}
/**
 * A specific sandbox issue detected.
 */
export interface SandboxIssue {
    /** Type of issue */
    type: "sensitive_file_leak" | "js_native_access" | "defense_violation" | "unexpected_file_access" | "environment_leak";
    /** Description of the issue */
    description: string;
    /** Evidence (matched content) */
    evidence?: string;
}
/**
 * Oracle for detecting sandbox escape attempts.
 */
export declare class SandboxOracle {
    /**
     * Check a fuzz result for sandbox escape indicators.
     */
    check(result: FuzzResult): SandboxOracleResult;
    /**
     * Check if output contains any sensitive patterns.
     */
    containsSensitiveData(output: string): boolean;
    /**
     * Check if output contains JavaScript native code indicators.
     */
    containsNativeCode(output: string): boolean;
    /**
     * Get a summary of issues.
     */
    summarize(result: SandboxOracleResult): string;
}
