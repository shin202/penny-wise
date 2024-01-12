import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Version,
} from '@nestjs/common';
import { EmailVerificationParams } from './email-verification.interface';
import { VerifyService } from './verify/verify.service';
import { ResendService } from './resend/resend.service';
import { Request } from 'express';
import { ResendEmailVerificationDto } from './dto/resend-email-verification.dto';

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

  @Post('resend')
  @Version('1')
  @HttpCode(200)
  resend(
    @Body() resendEmailVerificationDto: ResendEmailVerificationDto,
    @Req() req: Request,
  ) {
    return this.resendService.resend(resendEmailVerificationDto, req);
  }
}
