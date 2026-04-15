/**
 * Fuzzing Configuration
 *
 * Centralized configuration for security fuzzing tests.
 */
/**
 * Default fuzzing configuration.
 * Uses restrictive limits to quickly detect issues.
 */
export const DEFAULT_FUZZ_CONFIG = {
    timeoutMs: 1000,
    memoryLimitBytes: 100 * 1024 * 1024, // 100MB
    numRuns: Number(process.env.FUZZ_RUNS) || 100,
    executionLimits: {
        maxLoopIterations: 100,
        maxCommandCount: 100,
        maxCallDepth: 20,
        maxSubstitutionDepth: 10,
        maxArrayElements: 1000,
        maxStringLength: 100000, // 100KB
        maxHeredocSize: 100000, // 100KB
        maxGlobOperations: 1000,
        maxAwkIterations: 100,
        maxSedIterations: 100,
        maxJqIterations: 100,
    },
    // Defense-in-depth disabled by default in fuzzing tests because it
    // patches process.env which interferes with vitest's test runner
    defenseInDepth: false,
    cpuThresholdPercent: 90,
    memoryThresholdPercent: 80,
};
/**
 * Create a fuzzing config with custom overrides.
 */
export function createFuzzConfig(overrides) {
    const config = {
        ...DEFAULT_FUZZ_CONFIG,
        ...overrides,
        executionLimits: {
            ...DEFAULT_FUZZ_CONFIG.executionLimits,
            ...overrides?.executionLimits,
        },
    };
    // Auto-enable progress logging for large runs if not explicitly set
    if (config.numRuns >= 100 && !config.onProgress && config.verbose !== false) {
        config.onProgress = createDefaultProgressLogger();
        config.progressInterval =
            config.progressInterval ?? Math.min(100, Math.ceil(config.numRuns / 10));
    }
    return config;
}
/**
 * Create a default progress logger that prints to console.
 */
export function createDefaultProgressLogger() {
    return (progress) => {
        const elapsed = (progress.elapsedMs / 1000).toFixed(1);
        const rate = progress.current / (progress.elapsedMs / 1000);
        const eta = rate > 0 ? ((progress.total - progress.current) / rate).toFixed(1) : "?";
        console.log(`[Fuzz] ${progress.current}/${progress.total} (${progress.percent.toFixed(1)}%) | ` +
            `${elapsed}s elapsed | ${rate.toFixed(1)} tests/s | ETA: ${eta}s | ` +
            `failures: ${progress.failures}`);
    };
}
/**
 * Create a progress tracker for use in tests.
 */
export function createProgressTracker(config) {
    const startTime = Date.now();
    let current = 0;
    let failures = 0;
    const interval = config.progressInterval ?? Math.min(100, Math.ceil(config.numRuns / 10));
    return {
        report: () => {
            current++;
            if (config.onProgress && current % interval === 0) {
                config.onProgress({
                    current,
                    total: config.numRuns,
                    percent: (current / config.numRuns) * 100,
                    failures,
                    elapsedMs: Date.now() - startTime,
                });
            }
        },
        recordFailure: () => {
            failures++;
        },
    };
}
/**
 * Create fast-check options.
 * Progress reporting is handled via createProgressReporter().
 *
 * Note: endOnFailure=true disables shrinking, which means we see the original
 * failing input instead of a "simplified" version that may actually pass.
 */
export function createFcOptions(config) {
    return {
        numRuns: config.numRuns,
        endOnFailure: true, // Disable shrinking - show original failure
    };
}
/**
 * Create a progress reporter function to call after each test iteration.
 * Call this at the start of your test, then call reporter() after each run.
 */
export function createProgressReporter(config, testName) {
    const startTime = Date.now();
    let current = 0;
    let lastReport = 0;
    const interval = config.progressInterval ?? Math.min(100, Math.ceil(config.numRuns / 10));
    // No-op for small runs without explicit progress callback
    if (config.numRuns < 100 && !config.onProgress) {
        return () => {
            current++;
        };
    }
    return () => {
        current++;
        if (current - lastReport >= interval || current === config.numRuns) {
            lastReport = current;
            const elapsedMs = Date.now() - startTime;
            const progress = {
                current,
                total: config.numRuns,
                percent: (current / config.numRuns) * 100,
                failures: 0,
                elapsedMs,
            };
            if (config.onProgress) {
                config.onProgress(progress);
            }
            else {
                const elapsed = (elapsedMs / 1000).toFixed(1);
                const rate = current / (elapsedMs / 1000);
                const eta = rate > 0 ? ((config.numRuns - current) / rate).toFixed(1) : "?";
                const prefix = testName ? `[${testName}] ` : "";
                console.log(`${prefix}${current}/${config.numRuns} (${progress.percent.toFixed(0)}%) | ` +
                    `${elapsed}s | ${rate.toFixed(0)}/s | ETA: ${eta}s`);
            }
        }
    };
}
