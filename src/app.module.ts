import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { globalConfig } from './config/global.config';
import { jwtConfig } from './config/jwt.config';
import { mailerConfig } from './config/mailer.config';
import { typeormConfig } from './config/typeorm.config';
import { IsExistsConstraint } from './shared/validation/is-exists.constraint';
import { IsUniqueConstraint } from './shared/validation/is-unique.constraint';
import { EmailVerificationModule } from './email-verification/email-verification.module';

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
  ],
  controllers: [],
  providers: [Logger, IsUniqueConstraint, IsExistsConstraint],
})
export class AppModule {}
