import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Transform } from '../../common/interceptors/transform.interface';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginCredentials: LoginCredentialsDto,
    res: Response,
  ): Promise<Transform<any>> {
    const { usernameOrEmail, password } = loginCredentials;

    const user: User =
      await this.userService.findByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      throw new HttpException(
        'Invalid username or password. Please try again.',
        400,
      );
    }

    const isPasswordValid: boolean = user.validatePassword(password);

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid username or password. Please try again.',
        400,
      );
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'strict',
    });

    return {
      status: 'success',
      message: 'You have successfully logged in.',
      data: {
        accessToken,
      },
    };
  }
}
