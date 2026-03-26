/**
 * Fuzzing Framework
 *
 * Property-based fuzzing for security testing of just-bash.
 */
export { createDefaultProgressLogger, createFcOptions, createFuzzConfig, createProgressReporter, createProgressTracker, DEFAULT_FUZZ_CONFIG, type FuzzingConfig, type FuzzProgress, type FuzzProgressCallback, } from "./config.js";
export { ARITHMETIC_ATTACKS, type AttackCase, DOS_ATTACKS, getAttacksByCategory, getAttacksByExpected, INJECTION_ATTACKS, KNOWN_ATTACK_CORPUS, POLLUTION_ATTACKS, SANDBOX_ESCAPES, } from "./corpus/known-attacks.js";
export * from "./generators/index.js";
export { assertExecResultSafe, assertNoNativeCode, assertNoPollutionIndicators, assertOutputSafe, checkForNativeCode, checkForPollutionIndicators, checkOutputSecurity, type SecurityCheckResult, } from "./oracles/assertions.js";
export { type DOSIssue, DOSOracle, type DOSOracleResult, } from "./oracles/dos-oracle.js";
export { type SandboxIssue, SandboxOracle, type SandboxOracleResult, } from "./oracles/sandbox-oracle.js";
export { type FuzzResult, FuzzRunner } from "./runners/fuzz-runner.js";
