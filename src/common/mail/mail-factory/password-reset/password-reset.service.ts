import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  PasswordResetContext,
  PasswordResetPayload,
} from '../../mail.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { TemplateUtils, UrlUtils } from '../../../../utils';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { MailService } from '../../mail.service';

@Injectable()
export class PasswordResetService extends MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async send(req: Request, payload: PasswordResetPayload): Promise<void> {
    const { email, username } = payload;

    await this.mailerService.sendMail({
      to: email,
      subject: `Magical Password Reset for Your Pennywise Journey, ${username}!`,
      html: TemplateUtils.loader<PasswordResetContext>('password-reset', {
        username,
        passwordResetLink: this.generatePasswordResetLink(req, payload),
      }),
    });
  }

  private generatePasswordResetLink(
    req: Request,
    payload: PasswordResetPayload,
  ): string {
    const { token, email } = payload;
    const protocol: string = req.protocol;
    const host: string = req.get('host');
    const passwordResetEndpoint: string = this.configService.get<string>(
      'passwordResetEndpoint',
    );
    const hash: string = createHash('SHA256', {
      outputLength: 32,
    })
      .update(token)
      .update(email)
      .digest('hex');

    const now: number = dayjs().valueOf();
    const passwordResetTtl: number = this.configService.get<number>(
      'passwordResetTokenTtl',
    );

    const url: string = `${protocol}://${host}${passwordResetEndpoint}/${token}/${hash}?iat=${now}`;

    return UrlUtils.createTemporaryUrl(url, {
      method: 'PUT',
      ttl: passwordResetTtl,
    });
  }
}
