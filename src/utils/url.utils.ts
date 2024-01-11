import { SignOptions, SignUrl, VerifyOptions } from 'url-shield';
import * as dotenv from 'dotenv';

dotenv.config();

export class UrlUtils {
  public static signUrl: SignUrl = new SignUrl({
    key: process.env.TEMPORARY_URL_SIGNING_KEY,
  });

  public static createTemporaryUrl(url: string, options?: SignOptions): string {
    return this.signUrl.sign(url, options);
  }

  public static verifyTemporaryUrl(
    url: string,
    options?: VerifyOptions,
  ): boolean {
    return this.signUrl.verify(url, options);
  }
}
