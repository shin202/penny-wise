import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LoginService } from './login';
import { LogoutService } from './logout';
import { RegisterService } from './register';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users';
import { EmailVerifyTokensModule } from '../email-verify-tokens';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
    UsersModule,
    EmailVerifyTokensModule,
  ],
  providers: [LoginService, LogoutService, RegisterService],
  controllers: [AuthController],
})
export class AuthModule {}
