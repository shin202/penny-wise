import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

import { CreateUserDto, User, UsersService } from '../../users';
import {
  EmailVerifyToken,
  EmailVerifyTokensService,
} from '../../email-verify-tokens';
import { MailService, Transform, VerificationTokenPayload } from '../../common';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailVerifyTokensService: EmailVerifyTokensService,
    private readonly mailService: MailService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<Transform<any>> {
    const user: User = await this.usersService.create(createUserDto);

    const emailVerifyToken: EmailVerifyToken =
      await this.emailVerifyTokensService.create({
        userId: user.id,
      });

    const { username, email } = user;
    const { token } = emailVerifyToken;
    const payload: VerificationTokenPayload = { username, email, token };

    await this.mailService.sendVerificationEmail(req, payload);

    return {
      status: 'success',
      message:
        'Thanks for registering! Please check your email to verify your account.',
      data: null,
    };
  }
}
