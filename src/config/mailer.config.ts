import { MailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';

const config = (): MailerOptions => ({
  transport: {
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  defaults: {
    from: process.env.MAIL_FROM,
  },
  preview: true,
});

export const mailerConfig = registerAs('mailer', (): MailerOptions => config());
