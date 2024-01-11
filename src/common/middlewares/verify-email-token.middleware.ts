import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EmailVerifyTokensService } from '../../email-verify-tokens/email-verify-tokens.service';
import { EmailVerificationParams } from '../../email-verification/email-verification.interface';

@Injectable()
export class VerifyEmailTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly emailVerifyTokensService: EmailVerifyTokensService,
  ) {}

  async use(
    req: Request<EmailVerificationParams>,
    res: Response,
    next: NextFunction,
  ) {
    const { token } = req.params;

    const isTokenValid: boolean =
      await this.emailVerifyTokensService.existsByToken(token);

    if (!isTokenValid) {
      throw new HttpException(
        'We were unable to verify your account. Your verification link may have expired. Please click on resend for new verification link.',
        400,
      );
    }

    return next();
  }
}
