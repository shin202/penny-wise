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

import { RegisterService } from './register/register.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { Transform } from '../common/interceptors/transform.interface';
import { LoginCredentialsDto } from './login/dto/login-credentials.dto';
import { LoginService } from './login/login.service';
import { AuthGuard } from './auth.guard';
import { RefreshService } from './refresh/refresh.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly refreshService: RefreshService,
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
  @Version('1')
  @HttpCode(200)
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

  @Get('refresh')
  @Version('1')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.refreshService.refreshToken(req, res);
  }
}
