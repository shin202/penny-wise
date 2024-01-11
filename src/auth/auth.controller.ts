import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { RegisterService } from './register';
import { CreateUserDto, User } from '../users';
import { Transform } from '../common';
import { LoginCredentialsDto } from './login/dto';
import { LoginService } from './login';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  @Post('register')
  @Version('1')
  register(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<Transform<User>> {
    return this.registerService.register(createUserDto, req);
  }

  @Post('login')
  @HttpCode(200)
  @Version('1')
  login(
    @Body() loginCredentials: LoginCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Transform<any>> {
    return this.loginService.login(loginCredentials, res);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  @Version('1')
  logout(@Res({ passthrough: true }) res: Response): Transform<any> {
    res.clearCookie('refreshToken');

    return {
      status: 'success',
      message: 'You have been successfully logged out',
      data: null,
    };
  }
}
