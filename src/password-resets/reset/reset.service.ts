import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { PasswordResetsService } from '../password-resets.service';
import { PasswordResetParams } from '../password-resets.interface';
import { PasswordReset } from '../entities/password-reset.entity';
import { User } from '../../users/entities/user.entity';
import { PasswordResetDto } from '../dto/password-reset.dto';
import { Transform } from '../../common/interceptors/transform.interface';

@Injectable()
export class ResetService {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordResetService: PasswordResetsService,
  ) {}

  async reset(
    passwordResetParams: PasswordResetParams,
    passwordResetDto: PasswordResetDto,
  ): Promise<Transform<any>> {
    const { token } = passwordResetParams;

    const passwordReset: PasswordReset =
      await this.passwordResetService.findByToken(token);

    if (!passwordReset) {
      throw new HttpException('Invalid token', 400);
    }

    const user: User = await this.userService.findByEmail(passwordReset.email);

    if (!user) {
      throw new HttpException('Invalid token', 400);
    }

    const { password } = passwordResetDto;

    await this.userService.updatePassword(user, password);
    await this.passwordResetService.deleteAllByEmail(passwordReset.email);

    return {
      status: 'success',
      message:
        'Password reset successfully. Please login with your new password.',
      data: null,
    };
  }
}
