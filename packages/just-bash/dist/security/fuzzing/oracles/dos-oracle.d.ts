/**
 * DOS Oracle
 *
 * Detects denial-of-service conditions in fuzz results.
 */
import type { FuzzingConfig } from "../config.js";
import type { FuzzResult } from "../runners/fuzz-runner.js";
/**
 * Result of DOS oracle check.
 */
export interface DOSOracleResult {
    /** Whether a DOS condition was detected */
    dosDetected: boolean;
    /** Whether the DOS was handled gracefully */
    handledGracefully: boolean;
    /** Specific issues detected */
    issues: DOSIssue[];
}
/**
 * A specific DOS issue detected.
 */
export interface DOSIssue {
    /** Type of issue */
    type: "timeout" | "memory_exhaustion" | "cpu_spike" | "unhandled_infinite_loop" | "stack_overflow" | "limit_exceeded";
    /** Description of the issue */
    description: string;
    /** Measured value (if applicable) */
    value?: number;
    /** Threshold that was exceeded */
    threshold?: number;
}
/**
 * Oracle for detecting denial-of-service conditions.
 */
export declare class DOSOracle {
    private config;
    constructor(config: FuzzingConfig);
    /**
     * Check a fuzz result for DOS conditions.
     */
    check(result: FuzzResult): DOSOracleResult;
    /**
     * Check if result indicates graceful limit handling.
     */
    isGracefulTermination(result: FuzzResult): boolean;
    /**
     * Check if execution time is acceptable.
     */
    isAcceptableTime(result: FuzzResult): boolean;
    /**
     * Check if memory usage is acceptable.
     */
    isAcceptableMemory(result: FuzzResult): boolean;
    /**
     * Get a summary of issues.
     */
    summarize(result: DOSOracleResult): string;
}
