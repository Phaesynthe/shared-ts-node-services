import { promisify } from "util";

export const nextTick = promisify(process.nextTick)

export async function timeout(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function waitForCondition(
    condition: Function,
    intervalMs: number,
    maxAttempts?: number,
    earlyExitCondition?: Function
): Promise<void> {
    let attemptCount: number = 0;
    while (condition() === false) {
        if (earlyExitCondition && earlyExitCondition()) {
            break;
        }
        ++attemptCount;
        if (maxAttempts && attemptCount >= maxAttempts) {
            throw new Error('waitForCondition(): exceeded maximum attempt count');
        }
        await timeout(intervalMs);
    }
}

/**
 * Generates n characters of random hex digits. Default is 12 or 2.8147498e+14 max value. So, 281 trillion in number-space.
 */
export function generateRandomHex(length: number = 12) {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}
