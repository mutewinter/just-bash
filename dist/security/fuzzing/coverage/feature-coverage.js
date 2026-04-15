/**
 * Feature Coverage Collector
 *
 * Lightweight coverage tracking for fuzzing instrumentation.
 * Records which interpreter features a script exercises.
 */
/**
 * Collects feature coverage hits during script execution.
 * Implements FeatureCoverageWriter for use in interpreter contexts.
 */
export class FeatureCoverage {
    features = new Set();
    counts = new Map();
    hit(feature) {
        this.features.add(feature);
        this.counts.set(feature, (this.counts.get(feature) || 0) + 1);
    }
    /**
     * Returns a snapshot of coverage and resets internal state.
     */
    snapshot() {
        const snap = {
            features: new Set(this.features),
            counts: new Map(this.counts),
        };
        this.features.clear();
        this.counts.clear();
        return snap;
    }
    /**
     * Returns current features without resetting.
     */
    getFeatures() {
        return this.features;
    }
    /**
     * Reset all coverage data.
     */
    reset() {
        this.features.clear();
        this.counts.clear();
    }
}
