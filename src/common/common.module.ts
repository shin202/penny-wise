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
import { UsersModule } from '../users/users.module';
import { ImagesModule } from '../images/images.module';
import { TransformQueryParamsProvider } from './providers/transform-query-params.provider';
import { ConvertCurrencyProvider } from './providers/convert-currency.provider';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AbilityFactoryProvider } from './providers/ability-factory.provider';
import { DateProvider } from './providers/date.provider';

@Global()
@Module({
  imports: [
    UsersModule,
    MailModule,
    EmailVerifyTokensModule,
    ImagesModule,
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('http'),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
  ],
  providers: [
    TransformQueryParamsProvider,
    ConvertCurrencyProvider,
    AbilityFactoryProvider,
    DateProvider,
  ],
  exports: [
    JwtModule,
    MailModule,
    UsersModule,
    ImagesModule,
    TransformQueryParamsProvider,
    ConvertCurrencyProvider,
    AbilityFactoryProvider,
    DateProvider,
  ],
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
