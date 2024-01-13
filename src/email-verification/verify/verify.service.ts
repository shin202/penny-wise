import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { EmailVerifyToken } from '../../email-verify-tokens/entities/email-verify-token.entity';
import { EmailVerifyTokensService } from '../../email-verify-tokens/email-verify-tokens.service';
import { EmailVerificationParams } from '../email-verification.interface';
import { Transform } from '../../common/interceptors/transform.interface';

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

    if (!emailVerifyToken) {
      throw new HttpException(
        'We were unable to verify your account. Your verification link may have expired. Please click on resend for new verification link.',
        400,
      );
    }

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
