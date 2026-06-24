/**
 * Grammar-Based Bash Syntax Generator
 *
 * Uses fc.letrec to generate random valid bash syntax based on the grammar.
 * This provides true fuzzing by exploring the syntax space systematically
 * rather than using predefined patterns.
 */
import fc from "fast-check";
/** Valid bash identifier (variable name) */
export declare const identifier: fc.Arbitrary<string>;
/** Strict pollution identifiers - only dangerous names, no regular identifiers */
export declare const strictPollutionIdentifier: fc.Arbitrary<string>;
/** Dangerous/special identifier names for prototype pollution testing */
export declare const dangerousIdentifier: fc.Arbitrary<string>;
/** Chained property paths for deep pollution attempts */
export declare const pollutionChain: fc.Arbitrary<string>;
/** Integer literal */
export declare const integerLiteral: fc.Arbitrary<string>;
/** Simple word (no special characters) */
export declare const simpleWord: fc.Arbitrary<string>;
/** Command name */
export declare const commandName: fc.Arbitrary<string>;
/** Grammar type for bash syntax generation */
export interface BashGrammarArbitraries {
    script: fc.Arbitrary<string>;
    statement: fc.Arbitrary<string>;
    pipeline: fc.Arbitrary<string>;
    command: fc.Arbitrary<string>;
    simpleCommand: fc.Arbitrary<string>;
    compoundCommand: fc.Arbitrary<string>;
    word: fc.Arbitrary<string>;
    expansion: fc.Arbitrary<string>;
    arithmeticExpr: fc.Arbitrary<string>;
}
/**
 * Create a grammar-based bash script generator.
 * @param _maxDepth - Maximum nesting depth (currently unused, for future depth control)
 */
export declare function createBashGrammar(_maxDepth?: number): BashGrammarArbitraries;
/** Generate a random bash script */
export declare const bashScript: fc.Arbitrary<string>;
/** Generate a random bash statement */
export declare const bashStatement: fc.Arbitrary<string>;
/** Generate a random bash command */
export declare const bashCommand: fc.Arbitrary<string>;
/** Generate a random bash word with possible expansions */
export declare const bashWord: fc.Arbitrary<string>;
/** Generate a random bash expansion */
export declare const bashExpansion: fc.Arbitrary<string>;
/** Generate a random arithmetic expression */
export declare const bashArithmetic: fc.Arbitrary<string>;
/** Generate a random compound command (control structure) */
export declare const bashCompound: fc.Arbitrary<string>;
/** Generate a random simple command */
export declare const bashSimpleCommand: fc.Arbitrary<string>;
/** Generate pollution-focused assignment statements (always uses strict pollution names) */
export declare const pollutionAssignment: fc.Arbitrary<string>;
/** Generate pollution-focused expansion patterns (always uses strict pollution names) */
export declare const pollutionExpansion: fc.Arbitrary<string>;
/** Generate complete pollution test scripts (always uses strict pollution names) */
export declare const pollutionScript: fc.Arbitrary<string>;
/** cat command variations */
export declare const catCommand: fc.Arbitrary<string>;
/** head/tail command variations */
export declare const headTailCommand: fc.Arbitrary<string>;
/** grep command variations */
export declare const grepCommand: fc.Arbitrary<string>;
/** sed command variations */
export declare const sedCommand: fc.Arbitrary<string>;
/** awk command variations */
export declare const awkCommand: fc.Arbitrary<string>;
/** sort command variations */
export declare const sortCommand: fc.Arbitrary<string>;
/** uniq command variations */
export declare const uniqCommand: fc.Arbitrary<string>;
/** wc command variations */
export declare const wcCommand: fc.Arbitrary<string>;
/** cut command variations */
export declare const cutCommand: fc.Arbitrary<string>;
/** tr command variations */
export declare const trCommand: fc.Arbitrary<string>;
/** ls command variations */
export declare const lsCommand: fc.Arbitrary<string>;
/** File manipulation commands */
export declare const fileManipCommand: fc.Arbitrary<string>;
/** stat/file commands */
export declare const statCommand: fc.Arbitrary<string>;
/** find command variations */
export declare const findCommand: fc.Arbitrary<string>;
/** jq command variations */
export declare const jqCommand: fc.Arbitrary<string>;
/** base64 command variations */
export declare const base64Command: fc.Arbitrary<string>;
/** gzip command variations */
export declare const gzipCommand: fc.Arbitrary<string>;
/** echo command variations */
export declare const echoCommand: fc.Arbitrary<string>;
/** printf command variations */
export declare const printfCommand: fc.Arbitrary<string>;
/** seq command variations */
export declare const seqCommand: fc.Arbitrary<string>;
/** expr command variations */
export declare const exprCommand: fc.Arbitrary<string>;
/** date command variations */
export declare const dateCommand: fc.Arbitrary<string>;
/** Environment commands */
export declare const envCommand: fc.Arbitrary<string>;
/** Path manipulation */
export declare const pathCommand: fc.Arbitrary<string>;
/** test command variations */
export declare const testCommand: fc.Arbitrary<string>;
/** xargs command variations */
export declare const xargsCommand: fc.Arbitrary<string>;
/** diff command variations */
export declare const diffCommand: fc.Arbitrary<string>;
/** Complete AWK program */
export declare const awkProgram: fc.Arbitrary<string>;
/** AWK command with program and optional input */
export declare const awkGrammarCommand: fc.Arbitrary<string>;
/** AWK pollution-focused program */
export declare const awkPollutionProgram: fc.Arbitrary<string>;
/** AWK pollution-focused command */
export declare const awkPollutionCommand: fc.Arbitrary<string>;
/** Complete SED program */
export declare const sedProgram: fc.Arbitrary<string>;
/** SED command with program and input */
export declare const sedGrammarCommand: fc.Arbitrary<string>;
/** SED pollution-focused program */
export declare const sedPollutionProgram: fc.Arbitrary<string>;
/** SED pollution-focused command */
export declare const sedPollutionCommand: fc.Arbitrary<string>;
/** Complete JQ filter */
export declare const jqFilter: fc.Arbitrary<string>;
/** JQ command with filter and JSON input */
export declare const jqGrammarCommand: fc.Arbitrary<string>;
/** JQ pollution-focused program */
export declare const jqPollutionFilter: fc.Arbitrary<string>;
/** JQ pollution-focused command */
export declare const jqPollutionCommand: fc.Arbitrary<string>;
/** Generate a random command from all supported commands */
export declare const supportedCommand: fc.Arbitrary<string>;
/** Generate a pipeline of supported commands */
export declare const commandPipeline: fc.Arbitrary<string>;
/** Generate a script using multiple supported commands */
export declare const commandScript: fc.Arbitrary<string>;
