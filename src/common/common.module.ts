import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MailModule, MailService } from './mail';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  VerifyEmailTokenMiddleware,
  VerifyTemporaryUrlMiddleware,
} from './middlewares';
import { EmailVerificationController } from '../email-verification';
import { EmailVerifyTokensModule } from '../email-verify-tokens';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    MailModule,
    EmailVerifyTokensModule,
  ],
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
