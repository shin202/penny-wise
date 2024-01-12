import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { MailType } from '../mail.interface';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { PasswordResetService } from './password-reset/password-reset.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailFactory {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  create(type: MailType) {
    switch (type) {
      case 'email-verification':
        return new EmailVerificationService(
          this.mailerService,
          this.configService,
        );

      case 'password-reset':
        return new PasswordResetService(this.mailerService, this.configService);

      default:
        throw new Error(`Mail type ${type} is not supported.`);
    }
  }
}
