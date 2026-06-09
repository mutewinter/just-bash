/**
 * Fuzz Runner
 *
 * Core executor for fuzz tests with timeout and memory monitoring.
 */
import type { BashExecResult } from "../../../types.js";
import type { SecurityViolation } from "../../types.js";
import { type FuzzingConfig } from "../config.js";
import { type CoverageSnapshot } from "../coverage/feature-coverage.js";
/**
 * Result of a fuzz test execution.
 */
export interface FuzzResult {
    /** The script that was executed */
    script: string;
    /** Whether execution completed without timeout */
    completed: boolean;
    /** Whether execution timed out */
    timedOut: boolean;
    /** Execution duration in milliseconds */
    durationMs: number;
    /** Memory delta during execution in bytes */
    memoryDeltaBytes: number;
    /** The bash execution result (if completed) */
    bashResult?: BashExecResult;
    /** Any error that occurred */
    error?: Error;
    /** Defense-in-depth violations detected */
    violations: SecurityViolation[];
    /** Whether the execution hit a limit gracefully */
    hitLimit: boolean;
    /** Exit code from bash (if available) */
    exitCode?: number;
    /** Stderr output (if available) */
    stderr?: string;
    /** Stdout output (if available) */
    stdout?: string;
    /** Feature coverage snapshot (if coverage enabled) */
    coverage?: CoverageSnapshot;
}
/**
 * Fuzz runner that executes bash scripts with timeout and memory monitoring.
 */
export declare class FuzzRunner {
    private config;
    private scriptCount;
    constructor(config?: Partial<FuzzingConfig>);
    /**
     * Log script at start of execution (in case test times out).
     */
    private logScriptStart;
    /**
     * Log script completion status.
     */
    private logScriptEnd;
    /**
     * Run a fuzz test with the given script.
     */
    run(script: string): Promise<FuzzResult>;
    /**
     * Run multiple scripts and collect results.
     */
    runBatch(scripts: string[]): Promise<FuzzResult[]>;
    /**
     * Get the current configuration.
     */
    getConfig(): FuzzingConfig;
    /**
     * Log a test failure to the failure log file.
     * Call this when an assertion fails to record the failing script.
     */
    logFailure(result: FuzzResult, reason: string): void;
}
