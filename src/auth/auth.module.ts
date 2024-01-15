import { Module } from '@nestjs/common';

import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { RegisterService } from './register/register.service';
import { AuthController } from './auth.controller';
import { EmailVerifyTokensModule } from '../email-verify-tokens/email-verify-tokens.module';
import { RefreshService } from './refresh/refresh.service';

@Module({
  imports: [EmailVerifyTokensModule],
  providers: [LoginService, LogoutService, RegisterService, RefreshService],
  controllers: [AuthController],
})
export class AuthModule {}
