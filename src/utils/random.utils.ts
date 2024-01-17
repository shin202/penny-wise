import { randomBytes } from 'crypto';

export class RandomUtils {
  static generateRandomHex(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  static randomArrayElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
