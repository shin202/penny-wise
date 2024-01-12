import { Body, Controller, HttpCode, Post, Req, Version } from '@nestjs/common';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { Request } from 'express';
import { ForgotService } from './forgot/forgot.service';
import { Transform } from '../common/interceptors/transform.interface';

@Controller('password')
export class PasswordResetsController {
  constructor(private readonly forgotService: ForgotService) {}

  @Post('/forgot')
  @Version('1')
  @HttpCode(200)
  forgot(
    @Body() createPasswordResetDto: CreatePasswordResetDto,
    @Req() req: Request,
  ): Promise<Transform<any>> {
    return this.forgotService.forgot(createPasswordResetDto, req);
  }
}
