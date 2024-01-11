import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { VerifyEmailTokenMiddleware } from './middlewares/verify-email-token.middleware';
import { VerifyTemporaryUrlMiddleware } from './middlewares/verify-temporary-url.middleware';
import { EmailVerificationController } from '../email-verification/email-verification.controller';
import { EmailVerifyTokensModule } from '../email-verify-tokens/email-verify-tokens.module';

@Global()
@Module({
  imports: [MailModule, EmailVerifyTokensModule],
  providers: [MailService],
  exports: [MailService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(VerifyTemporaryUrlMiddleware, VerifyEmailTokenMiddleware)
      .forRoutes(EmailVerificationController);
  }
}
