/**
 * Known Attack Corpus
 *
 * Seed corpus of known attack patterns to ensure coverage.
 * These attacks should all be blocked or handled gracefully.
 */
export interface AttackCase {
    /** Name of the attack */
    name: string;
    /** The attack script */
    script: string;
    /** Category of attack */
    category: "sandbox_escape" | "dos" | "prototype_pollution" | "arithmetic" | "injection";
    /** Expected behavior: "blocked" means error/rejection, "limited" means gracefully hit limits */
    expected: "blocked" | "limited" | "safe";
    /** Optional description */
    description?: string;
}
/**
 * Known sandbox escape attempts.
 */
export declare const SANDBOX_ESCAPES: AttackCase[];
/**
 * Known DOS/resource exhaustion attacks.
 */
export declare const DOS_ATTACKS: AttackCase[];
/**
 * Known prototype pollution attacks.
 */
export declare const POLLUTION_ATTACKS: AttackCase[];
/**
 * Known arithmetic edge cases.
 */
export declare const ARITHMETIC_ATTACKS: AttackCase[];
/**
 * Known injection attacks.
 */
export declare const INJECTION_ATTACKS: AttackCase[];
/**
 * Complete corpus of known attacks.
 */
export declare const KNOWN_ATTACK_CORPUS: AttackCase[];
/**
 * Get attacks by category.
 */
export declare function getAttacksByCategory(category: AttackCase["category"]): AttackCase[];
/**
 * Get attacks by expected behavior.
 */
export declare function getAttacksByExpected(expected: AttackCase["expected"]): AttackCase[];
