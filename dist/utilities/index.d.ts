export declare function timeout(milliseconds: number): Promise<void>;
export declare function waitForCondition(condition: Function, intervalMs: number, maxAttempts?: number, earlyExitCondition?: Function): Promise<void>;
/**
 * Generates 12 random hex digits
 */
export declare function generateRandomHexId(): string;
