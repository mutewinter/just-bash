/**
 * Malformed Script Generator
 *
 * Generates intentionally broken bash scripts to stress-test
 * parser error recovery and interpreter robustness.
 *
 * 7 categories of broken scripts:
 * 1. Truncated - valid scripts cut at random point
 * 2. Unclosed quotes - unterminated string literals
 * 3. Unclosed parens - unterminated grouping constructs
 * 4. Missing keywords - incomplete compound commands
 * 5. Invalid operators - nonsensical operator sequences
 * 6. Byte-injected - random bytes inserted into valid scripts
 * 7. Degenerate - empty, whitespace-only, bare operators
 */
import fc from "fast-check";
/** Valid script cut at a random point */
declare const truncatedScript: fc.Arbitrary<string>;
declare const unclosedQuote: fc.Arbitrary<string>;
declare const unclosedParen: fc.Arbitrary<string>;
declare const missingKeyword: fc.Arbitrary<string>;
declare const invalidOperator: fc.Arbitrary<string>;
/** Random bytes inserted into valid scripts */
declare const byteInjectedScript: fc.Arbitrary<string>;
declare const degenerateScript: fc.Arbitrary<string>;
declare const mutatedCompound: fc.Arbitrary<string>;
/** Combined malformed script generator with weighted categories */
export declare const malformedScript: fc.Arbitrary<string>;
/** Export individual generators for targeted testing */
export { truncatedScript, unclosedQuote, unclosedParen, missingKeyword, invalidOperator, byteInjectedScript, degenerateScript, mutatedCompound, };
