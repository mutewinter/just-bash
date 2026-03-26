/**
 * Fuzzing Configuration
 *
 * Centralized configuration for security fuzzing tests.
 */
import type { ExecutionLimits } from "../../limits.js";
/**
 * Progress callback for logging fuzzing progress.
 */
export type FuzzProgressCallback = (progress: FuzzProgress) => void;
/**
 * Progress information for fuzzing.
 */
export interface FuzzProgress {
    /** Current test case number */
    current: number;
    /** Total number of test cases */
    total: number;
    /** Percentage complete */
    percent: number;
    /** Number of failures so far */
    failures: number;
    /** Elapsed time in milliseconds */
    elapsedMs: number;
}
/**
 * Configuration for fuzz testing.
 */
export interface FuzzingConfig {
    /** Maximum time per test case in milliseconds */
    timeoutMs: number;
    /** Maximum memory growth allowed in bytes */
    memoryLimitBytes: number;
    /** Number of test cases to run per property */
    numRuns: number;
    /** Execution limits for the Bash interpreter during fuzzing */
    executionLimits: ExecutionLimits;
    /** Whether to enable defense-in-depth during fuzzing */
    defenseInDepth: boolean;
    /** Threshold for CPU time usage (percentage of timeout) */
    cpuThresholdPercent: number;
    /** Threshold for memory growth (percentage of limit) */
    memoryThresholdPercent: number;
    /** Progress callback for logging (called every progressInterval runs) */
    onProgress?: FuzzProgressCallback;
    /** How often to call onProgress (default: every 10% or 100 runs, whichever is smaller) */
    progressInterval?: number;
    /** Whether to enable verbose logging */
    verbose?: boolean;
    /** Path to log tested scripts (git-ignored, useful for debugging) */
    scriptLogFile?: string;
    /** Path to log failed tests (git-ignored, useful for debugging) */
    failureLogFile?: string;
    /** Whether to enable feature coverage tracking */
    enableCoverage?: boolean;
}
/**
 * Default fuzzing configuration.
 * Uses restrictive limits to quickly detect issues.
 */
export declare const DEFAULT_FUZZ_CONFIG: FuzzingConfig;
/**
 * Create a fuzzing config with custom overrides.
 */
export declare function createFuzzConfig(overrides?: Partial<FuzzingConfig>): FuzzingConfig;
/**
 * Create a default progress logger that prints to console.
 */
export declare function createDefaultProgressLogger(): FuzzProgressCallback;
/**
 * Create a progress tracker for use in tests.
 */
export declare function createProgressTracker(config: FuzzingConfig): {
    report: () => void;
    recordFailure: () => void;
};
/**
 * Create fast-check options.
 * Progress reporting is handled via createProgressReporter().
 *
 * Note: endOnFailure=true disables shrinking, which means we see the original
 * failing input instead of a "simplified" version that may actually pass.
 */
export declare function createFcOptions(config: FuzzingConfig): {
    numRuns: number;
    endOnFailure: boolean;
};
/**
 * Create a progress reporter function to call after each test iteration.
 * Call this at the start of your test, then call reporter() after each run.
 */
export declare function createProgressReporter(config: FuzzingConfig, testName?: string): () => void;
