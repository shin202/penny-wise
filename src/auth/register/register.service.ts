import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { EmailVerifyToken } from '../../email-verify-tokens/entities/email-verify-token.entity';
import { EmailVerifyTokensService } from '../../email-verify-tokens/email-verify-tokens.service';
import { Transform } from 'src/common/interceptors/transform.interface';
import { EmailVerifyPayload } from '../../common/mail/mail.interface';
import { MailFactory } from '../../common/mail/mail-factory/mail.factory';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailVerifyTokenService: EmailVerifyTokensService,
    private readonly mailFactory: MailFactory,
  ) {}

  async register(
    createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<Transform<any>> {
    const user: User = await this.userService.create(createUserDto);

    const emailVerifyToken: EmailVerifyToken =
      await this.emailVerifyTokenService.create({
        userId: user.id,
      });

    const { username, email } = user;
    const { token } = emailVerifyToken;
    const payload: EmailVerifyPayload = { username, email, token };

    const mailService = this.mailFactory.create('email-verification');
    await mailService.send(req, payload);

    return {
      status: 'success',
      message:
        'Thanks for registering! Please check your email to verify your account.',
      data: null,
    };
  }
}
