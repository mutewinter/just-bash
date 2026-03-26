/**
 * Coverage Tracker
 *
 * Aggregates coverage across multiple fuzz runs and identifies
 * newly discovered features.
 */
import type { CoverageSnapshot } from "./feature-coverage.js";
/**
 * Coverage report for a category.
 */
export interface CategoryReport {
    category: string;
    covered: number;
    total: number;
    percent: number;
    uncovered: string[];
}
/**
 * Full coverage report.
 */
export interface CoverageReport {
    totalCovered: number;
    totalKnown: number;
    totalPercent: number;
    categories: CategoryReport[];
    corpus: CorpusEntry[];
}
/**
 * A script in the corpus that discovered new coverage.
 */
export interface CorpusEntry {
    script: string;
    newFeatures: string[];
}
/**
 * Tracks cumulative feature coverage across multiple fuzz runs.
 */
export declare class CoverageTracker {
    private knownFeatures;
    private cumulativeCoverage;
    private corpus;
    constructor(knownFeatures?: readonly string[]);
    /**
     * Record a run's coverage snapshot.
     * Returns array of newly-discovered features (empty if no new coverage).
     */
    recordRun(snapshot: CoverageSnapshot, script: string): string[];
    /**
     * Get scripts that discovered new coverage.
     */
    getCorpus(): readonly CorpusEntry[];
    /**
     * Get cumulative covered features.
     */
    getCoveredFeatures(): ReadonlySet<string>;
    /**
     * Generate a coverage report with per-category breakdown.
     */
    report(): CoverageReport;
    /**
     * Reset all tracked coverage.
     */
    reset(): void;
}
