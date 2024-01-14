import { Module } from '@nestjs/common';

import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { RegisterService } from './register/register.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailVerifyTokensModule } from '../email-verify-tokens/email-verify-tokens.module';

@Module({
  imports: [UsersModule, EmailVerifyTokensModule],
  providers: [LoginService, LogoutService, RegisterService],
  controllers: [AuthController],
})
export class AuthModule {}
