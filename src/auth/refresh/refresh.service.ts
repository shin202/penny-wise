import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../auth.interface';
import { ConfigService } from '@nestjs/config';
import { Transform } from '../../common/interceptors/transform.interface';

@Injectable()
export class RefreshService {
  private readonly REFRESH_TOKEN_TTL: number;
  private readonly REFRESH_TOKEN_TTL_IN_MS: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.REFRESH_TOKEN_TTL = this.configService.get<number>('refreshTokenTtl');
    this.REFRESH_TOKEN_TTL_IN_MS = this.REFRESH_TOKEN_TTL * 1000;
  }

  refreshToken(req: Request, res: Response): Transform<any> {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException();
    }

    try {
      const decodedToken: TokenPayload =
        this.jwtService.verify<TokenPayload>(refreshToken);

      const payload: TokenPayload = {
        username: decodedToken.username,
        sub: decodedToken.sub,
      };

      const accessToken = this.jwtService.sign(payload);
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: this.REFRESH_TOKEN_TTL,
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: this.REFRESH_TOKEN_TTL_IN_MS,
        sameSite: 'strict',
      });

      return {
        status: 'success',
        message: 'Refreshed successfully',
        data: {
          accessToken,
        },
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
