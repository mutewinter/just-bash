/**
 * Coverage Tracker
 *
 * Aggregates coverage across multiple fuzz runs and identifies
 * newly discovered features.
 */
import { ALL_KNOWN_FEATURES, FEATURE_CATEGORIES } from "./known-features.js";
/**
 * Tracks cumulative feature coverage across multiple fuzz runs.
 */
export class CoverageTracker {
    knownFeatures;
    cumulativeCoverage = new Set();
    corpus = [];
    constructor(knownFeatures = ALL_KNOWN_FEATURES) {
        this.knownFeatures = new Set(knownFeatures);
    }
    /**
     * Record a run's coverage snapshot.
     * Returns array of newly-discovered features (empty if no new coverage).
     */
    recordRun(snapshot, script) {
        const newFeatures = [];
        for (const feature of snapshot.features) {
            if (!this.cumulativeCoverage.has(feature)) {
                this.cumulativeCoverage.add(feature);
                newFeatures.push(feature);
            }
        }
        if (newFeatures.length > 0) {
            this.corpus.push({ script, newFeatures });
        }
        return newFeatures;
    }
    /**
     * Get scripts that discovered new coverage.
     */
    getCorpus() {
        return this.corpus;
    }
    /**
     * Get cumulative covered features.
     */
    getCoveredFeatures() {
        return this.cumulativeCoverage;
    }
    /**
     * Generate a coverage report with per-category breakdown.
     */
    report() {
        const categories = [];
        for (const [category, features] of Object.entries(FEATURE_CATEGORIES)) {
            const covered = features.filter((f) => this.cumulativeCoverage.has(f)).length;
            const total = features.length;
            const uncovered = features.filter((f) => !this.cumulativeCoverage.has(f));
            categories.push({
                category,
                covered,
                total,
                percent: total > 0 ? (covered / total) * 100 : 100,
                uncovered,
            });
        }
        const totalCovered = this.cumulativeCoverage.size;
        const totalKnown = this.knownFeatures.size;
        return {
            totalCovered,
            totalKnown,
            totalPercent: totalKnown > 0 ? (totalCovered / totalKnown) * 100 : 100,
            categories,
            corpus: this.corpus,
        };
    }
    /**
     * Reset all tracked coverage.
     */
    reset() {
        this.cumulativeCoverage.clear();
        this.corpus = [];
    }
}
