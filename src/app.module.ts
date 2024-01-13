import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { globalConfig, jwtConfig, mailerConfig, typeormConfig } from './config';
import { IsExistsConstraint } from './shared/validation/is-exists.constraint';
import { IsUniqueConstraint } from './shared/validation/is-unique.constraint';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { PasswordResetsModule } from './password-resets/password-resets.module';
import { IsEqualConstraint } from './shared/validation/is-equal.constraint';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig, typeormConfig, mailerConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    CommonModule,
    AuthModule,
    EmailVerificationModule,
    PasswordResetsModule,
  ],
  controllers: [],
  providers: [
    Logger,
    IsUniqueConstraint,
    IsExistsConstraint,
    IsEqualConstraint,
  ],
})
export class AppModule {}
