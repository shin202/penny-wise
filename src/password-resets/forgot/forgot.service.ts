import { Injectable } from '@nestjs/common';
import { CreatePasswordResetDto } from '../dto/create-password-reset.dto';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { Transform } from '../../common/interceptors/transform.interface';
import { PasswordResetsService } from '../password-resets.service';
import { MailFactory } from '../../common/mail/mail-factory/mail.factory';
import { PasswordReset } from '../entities/password-reset.entity';
import { Request } from 'express';
import { PasswordResetPayload } from '../../common/mail/mail.interface';

@Injectable()
export class ForgotService {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordResetService: PasswordResetsService,
    private readonly mailFactory: MailFactory,
  ) {}

  async forgot(
    createPasswordResetDto: CreatePasswordResetDto,
    req: Request,
  ): Promise<Transform<any>> {
    const { email } = createPasswordResetDto;

    const user: User = await this.userService.findByEmail(email);

    if (!user) {
      return {
        status: 'success',
        message:
          'If your email address is valid, you will receive an email shortly.',
        data: null,
      };
    }

    const passwordReset: PasswordReset = await this.passwordResetService.create(
      createPasswordResetDto,
    );

    const payload: PasswordResetPayload = {
      username: user.username,
      email,
      token: passwordReset.token,
    };

    const mailService = this.mailFactory.create('password-reset');
    await mailService.send(req, payload);

    return {
      status: 'success',
      message:
        'If your email address is valid, you will receive an email shortly.',
      data: null,
    };
  }
}
