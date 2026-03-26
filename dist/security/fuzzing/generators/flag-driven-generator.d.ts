/**
 * Flag-Driven Fuzzer Generator
 *
 * Consumes CommandFuzzInfo metadata from command files to automatically
 * generate commands with random flag subsets and appropriate arguments.
 * This covers all ~70 commands without hand-coded generators.
 */
import fc from "fast-check";
/** Generates commands from all commands that have flags defined */
export declare const flagDrivenCommand: fc.Arbitrary<string>;
/** Generates batch scripts exercising all flags for groups of commands */
export declare const flagBatchCommand: fc.Arbitrary<string>;
