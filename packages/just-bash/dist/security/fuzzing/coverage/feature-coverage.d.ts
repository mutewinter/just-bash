/**
 * Feature Coverage Collector
 *
 * Lightweight coverage tracking for fuzzing instrumentation.
 * Records which interpreter features a script exercises.
 */
import type { FeatureCoverageWriter } from "../../../types.js";
/**
 * Snapshot of coverage state at a point in time.
 */
export interface CoverageSnapshot {
    /** Set of feature strings that were hit */
    features: Set<string>;
    /** Hit count per feature */
    counts: Map<string, number>;
}
/**
 * Collects feature coverage hits during script execution.
 * Implements FeatureCoverageWriter for use in interpreter contexts.
 */
export declare class FeatureCoverage implements FeatureCoverageWriter {
    private features;
    private counts;
    hit(feature: string): void;
    /**
     * Returns a snapshot of coverage and resets internal state.
     */
    snapshot(): CoverageSnapshot;
    /**
     * Returns current features without resetting.
     */
    getFeatures(): ReadonlySet<string>;
    /**
     * Reset all coverage data.
     */
    reset(): void;
}
