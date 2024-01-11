import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users';
import {
  EmailVerifyToken,
  EmailVerifyTokensService,
} from '../../email-verify-tokens';
import { EmailVerificationParams } from '../email-verification.interface';
import { Transform } from '../../common';

@Injectable()
export class VerifyService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailVerifyTokensService: EmailVerifyTokensService,
  ) {}

  async verify(params: EmailVerificationParams): Promise<Transform<any>> {
    const { token } = params;

    const emailVerifyToken: EmailVerifyToken =
      await this.emailVerifyTokensService.findByToken(token);

    if (
      emailVerifyToken.isUsed ||
      emailVerifyToken.isExpired() ||
      emailVerifyToken.user.isVerified
    ) {
      return {
        status: 'success',
        message: 'Your email has been verified. You can now login.',
        data: null,
      };
    }

    await this.emailVerifyTokensService.markAsUsed(emailVerifyToken);
    await this.usersService.markAsVerified(emailVerifyToken.user);

    return {
      status: 'success',
      message: 'Your email has been verified. You can now login.',
      data: null,
    };
  }
}
