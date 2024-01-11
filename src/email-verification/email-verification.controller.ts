import { Controller, Get, Param, Version } from '@nestjs/common';
import { EmailVerificationParams } from './email-verification.interface';
import { VerifyService } from './verify/verify.service';
import { ResendService } from './resend/resend.service';

@Controller('email')
export class EmailVerificationController {
  constructor(
    private readonly verifyService: VerifyService,
    private readonly resendService: ResendService,
  ) {}

  @Get('verify/:token/:hash')
  @Version('1')
  verify(@Param() params: EmailVerificationParams) {
    return this.verifyService.verify(params);
  }
}
