import { Module } from '@nestjs/common';
import { VerifyService } from './verify/verify.service';
import { ResendService } from './resend/resend.service';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerifyTokensModule } from '../email-verify-tokens/email-verify-tokens.module';

@Module({
  imports: [EmailVerifyTokensModule],
  providers: [VerifyService, ResendService],
  controllers: [EmailVerificationController],
})
export class EmailVerificationModule {}
