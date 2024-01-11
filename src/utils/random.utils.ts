import { randomBytes } from 'crypto';

export class RandomUtils {
  static generateRandomHex(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }
}
