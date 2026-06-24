/**
 * Coverage Boost Generators
 *
 * Targeted generators that exercise specific interpreter features
 * not well-covered by the general grammar generator. Each generator
 * focuses on a gap identified in coverage reports.
 */
import fc from "fast-check";
export declare const coverageBoost: fc.Arbitrary<string>;
