import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Request } from 'express';
import {
  EmailVerificationContext,
  EmailVerifyPayload,
} from '../../mail.interface';
import { TemplateUtils, UrlUtils } from '../../../../utils';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { MailService } from '../../mail.service';

@Injectable()
export class EmailVerificationService extends MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async send(req: Request, payload: EmailVerifyPayload): Promise<void> {
    const { email, username } = payload;

    await this.mailerService.sendMail({
      to: email,
      subject: `Welcome, ${username}! Unleash Financial Magic with Pennywise!`,
      html: TemplateUtils.loader<EmailVerificationContext>(
        'account-verification',
        {
          username,
          verificationLink: this.generateVerificationLink(req, payload),
        },
      ),
    });
  }

  private generateVerificationLink(
    req: Request,
    payload: EmailVerifyPayload,
  ): string {
    const { token, email } = payload;
    const protocol: string = req.protocol;
    const host: string = req.get('host');
    const verifyEndpoint: string = this.configService.get<string>(
      'emailVerifyEndpoint',
    );
    const hash: string = createHash('SHA256', {
      outputLength: 32,
    })
      .update(token)
      .update(email)
      .digest('hex');
    const now: number = dayjs().valueOf();
    const emailVerifyTtl: number = this.configService.get<number>(
      'emailVerifyTokenTtl',
    );

    const url: string = `${protocol}://${host}${verifyEndpoint}/${token}/${hash}?iat=${now}`;

    return UrlUtils.createTemporaryUrl(url, {
      method: 'GET',
      ttl: emailVerifyTtl,
    });
  }
}
