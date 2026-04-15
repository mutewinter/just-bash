/**
 * DOS Oracle
 *
 * Detects denial-of-service conditions in fuzz results.
 */
/**
 * Oracle for detecting denial-of-service conditions.
 */
export class DOSOracle {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Check a fuzz result for DOS conditions.
     */
    check(result) {
        const issues = [];
        // Check for timeout
        if (result.timedOut) {
            issues.push({
                type: "timeout",
                description: `Execution timed out after ${result.durationMs}ms`,
                value: result.durationMs,
                threshold: this.config.timeoutMs,
            });
        }
        // Check for high CPU usage (close to timeout)
        const cpuThreshold = this.config.timeoutMs * (this.config.cpuThresholdPercent / 100);
        if (!result.timedOut && result.durationMs > cpuThreshold) {
            issues.push({
                type: "cpu_spike",
                description: `High CPU usage: ${result.durationMs}ms (${Math.round((result.durationMs / this.config.timeoutMs) * 100)}% of timeout)`,
                value: result.durationMs,
                threshold: cpuThreshold,
            });
        }
        // Check for memory growth
        const memoryThreshold = this.config.memoryLimitBytes * (this.config.memoryThresholdPercent / 100);
        if (result.memoryDeltaBytes > memoryThreshold) {
            issues.push({
                type: "memory_exhaustion",
                description: `High memory usage: ${Math.round(result.memoryDeltaBytes / 1024 / 1024)}MB growth`,
                value: result.memoryDeltaBytes,
                threshold: memoryThreshold,
            });
        }
        // Check for stack overflow
        if (result.error?.message.includes("Maximum call stack size exceeded") ||
            result.error?.message.includes("stack")) {
            issues.push({
                type: "stack_overflow",
                description: `Stack overflow: ${result.error.message}`,
            });
        }
        // Check for graceful limit handling
        const handledGracefully = result.hitLimit ||
            (result.stderr?.includes("maximum") ?? false) ||
            (result.stderr?.includes("limit") ?? false) ||
            (result.stderr?.includes("exceeded") ?? false) ||
            (result.stderr?.includes("too many") ?? false);
        if (handledGracefully && issues.length > 0) {
            // Convert issues to limit_exceeded if handled gracefully
            const limitIssue = {
                type: "limit_exceeded",
                description: "Execution hit limits and was terminated gracefully",
            };
            return {
                dosDetected: true,
                handledGracefully: true,
                issues: [limitIssue],
            };
        }
        // Check for unhandled infinite loop (no limit hit, no error, but high duration)
        if (!result.timedOut && !handledGracefully && result.durationMs > 500) {
            issues.push({
                type: "unhandled_infinite_loop",
                description: `Possible unhandled loop: ${result.durationMs}ms execution without limit hit`,
                value: result.durationMs,
            });
        }
        return {
            dosDetected: issues.length > 0,
            handledGracefully,
            issues,
        };
    }
    /**
     * Check if result indicates graceful limit handling.
     */
    isGracefulTermination(result) {
        // Graceful termination means limits were hit and reported
        if (result.hitLimit)
            return true;
        if (result.exitCode === 126)
            return true;
        const stderr = result.stderr || "";
        return (stderr.includes("maximum") ||
            stderr.includes("limit") ||
            stderr.includes("exceeded") ||
            stderr.includes("too many"));
    }
    /**
     * Check if execution time is acceptable.
     */
    isAcceptableTime(result) {
        const threshold = this.config.timeoutMs * (this.config.cpuThresholdPercent / 100);
        return result.durationMs < threshold;
    }
    /**
     * Check if memory usage is acceptable.
     */
    isAcceptableMemory(result) {
        const threshold = this.config.memoryLimitBytes * (this.config.memoryThresholdPercent / 100);
        return result.memoryDeltaBytes < threshold;
    }
    /**
     * Get a summary of issues.
     */
    summarize(result) {
        if (!result.dosDetected) {
            return "No DOS condition detected";
        }
        if (result.handledGracefully) {
            return "DOS condition detected and handled gracefully";
        }
        const summary = result.issues
            .map((i) => {
            let msg = `- ${i.type}: ${i.description}`;
            if (i.value !== undefined && i.threshold !== undefined) {
                msg += ` (value: ${i.value}, threshold: ${i.threshold})`;
            }
            return msg;
        })
            .join("\n");
        return `DOS condition detected:\n${summary}`;
    }
}
