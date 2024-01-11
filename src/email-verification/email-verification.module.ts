import { Module } from '@nestjs/common';
import { VerifyService } from './verify';
import { ResendService } from './resend';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerifyTokensModule } from '../email-verify-tokens';
import { UsersModule } from '../users';

@Module({
  imports: [UsersModule, EmailVerifyTokensModule],
  providers: [VerifyService, ResendService],
  controllers: [EmailVerificationController],
})
export class EmailVerificationModule {}
