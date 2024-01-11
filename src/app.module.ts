import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth';
import { CommonModule } from './common';
import { globalConfig, jwtConfig, mailerConfig, typeormConfig } from './config';
import { IsExistsConstraint, IsUniqueConstraint } from './shared';
import { EmailVerificationModule } from './email-verification';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig, typeormConfig, mailerConfig, jwtConfig],
    }),
    CommonModule,
    AuthModule,
    EmailVerificationModule,
  ],
  controllers: [],
  providers: [Logger, IsUniqueConstraint, IsExistsConstraint],
})
export class AppModule {}
