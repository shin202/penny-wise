import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { RegisterService } from './register/register.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailVerifyTokensModule } from '../email-verify-tokens/email-verify-tokens.module';

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
