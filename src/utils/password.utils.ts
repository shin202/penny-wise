import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export class PasswordUtils {
  private static readonly SALT_ROUNDS: number = 10;

  public static hashPassword(password: string): string {
    const salt: string = genSaltSync(this.SALT_ROUNDS);
    return hashSync(password, salt);
  }

  public static comparePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
