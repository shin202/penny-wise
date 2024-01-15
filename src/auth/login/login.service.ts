import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Transform } from '../../common/interceptors/transform.interface';
import { TokenPayload } from '../auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginService {
  private readonly REFRESH_TOKEN_TTL: number;
  private readonly REFRESH_TOKEN_TTL_IN_MS: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.REFRESH_TOKEN_TTL = this.configService.get<number>('refreshTokenTtl');
    this.REFRESH_TOKEN_TTL_IN_MS = this.REFRESH_TOKEN_TTL * 1000;
  }

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

    const payload: TokenPayload = {
      username: user.username,
      sub: { id: user.id },
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.REFRESH_TOKEN_TTL,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_TTL_IN_MS,
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
