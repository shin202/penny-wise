import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Version,
} from '@nestjs/common';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { Request } from 'express';
import { ForgotService } from './forgot/forgot.service';
import { Transform } from '../common/interceptors/transform.interface';
import { PasswordResetParams } from './password-resets.interface';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ResetService } from './reset/reset.service';

@Controller('password')
export class PasswordResetsController {
  constructor(
    private readonly forgotService: ForgotService,
    private readonly resetService: ResetService,
  ) {}

  @Post('/forgot')
  @Version('1')
  @HttpCode(200)
  forgot(
    @Body() createPasswordResetDto: CreatePasswordResetDto,
    @Req() req: Request,
  ): Promise<Transform<any>> {
    return this.forgotService.forgot(createPasswordResetDto, req);
  }

  @Put('/reset/:token/:hash')
  @Version('1')
  @HttpCode(200)
  reset(
    @Param() passwordResetParams: PasswordResetParams,
    @Body() passwordResetDto: PasswordResetDto,
  ): Promise<Transform<any>> {
    return this.resetService.reset(passwordResetParams, passwordResetDto);
  }
}
