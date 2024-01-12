import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Transform } from '../../common/interceptors/transform.interface';
import { MailFactory } from '../../common/mail/mail-factory/mail.factory';
import { EmailVerifyTokensService } from '../../email-verify-tokens/email-verify-tokens.service';
import { Request } from 'express';
import { EmailVerifyPayload } from '../../common/mail/mail.interface';
import { EmailVerifyToken } from '../../email-verify-tokens/entities/email-verify-token.entity';
import { User } from '../../users/entities/user.entity';
import { ResendEmailVerificationDto } from '../dto/resend-email-verification.dto';

@Injectable()
export class ResendService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailVerifyTokensService: EmailVerifyTokensService,
    private readonly mailFactory: MailFactory,
  ) {}

  async resend(
    resendEmailVerificationDto: ResendEmailVerificationDto,
    req: Request,
  ): Promise<Transform<any>> {
    const { email } = resendEmailVerificationDto;

    const user: User = await this.usersService.findByEmail(email);

    if (!user) {
      return {
        status: 'success',
        message:
          'If your email address is valid, you will receive an email shortly.',
        data: null,
      };
    }

    if (user.isVerified) {
      return {
        status: 'success',
        message: 'Your account is already verified.',
        data: null,
      };
    }

    await this.emailVerifyTokensService.deleteAllByUser(user);

    const verifyToken: EmailVerifyToken =
      await this.emailVerifyTokensService.create({
        userId: user.id,
      });

    const payload: EmailVerifyPayload = {
      username: user.username,
      email,
      token: verifyToken.token,
    };
    const mailService = this.mailFactory.create('email-verification');
    await mailService.send(req, payload);

    return {
      status: 'success',
      message:
        'If your email address is valid, you will receive an email shortly.',
      data: null,
    };
  }
}
