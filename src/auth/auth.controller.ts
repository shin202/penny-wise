import { Body, Controller, Post, Req, Version } from '@nestjs/common';
import { Request } from 'express';

import { RegisterService } from './register';
import { CreateUserDto, User } from '../users';
import { Transform } from '../common';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @Version('1')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<Transform<User>> {
    return this.registerService.register(createUserDto, req);
  }
}
