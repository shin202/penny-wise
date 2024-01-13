import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { VerifyTemporaryUrlMiddleware } from './middlewares/verify-temporary-url.middleware';
import { EmailVerificationController } from '../email-verification/email-verification.controller';
import { EmailVerifyTokensModule } from '../email-verify-tokens/email-verify-tokens.module';
import { PasswordResetsController } from '../password-resets/password-resets.controller';

@Global()
@Module({
  imports: [MailModule, EmailVerifyTokensModule],
  exports: [MailModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(VerifyTemporaryUrlMiddleware)
      .exclude(
        {
          version: '1',
          path: 'email/resend',
          method: RequestMethod.POST,
        },
        {
          version: '1',
          path: 'password/forgot',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(EmailVerificationController, PasswordResetsController);
  }
}
