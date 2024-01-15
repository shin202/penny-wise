import { JwtModuleOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

const config = (): JwtModuleOptions => ({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: +process.env.ACCESS_TOKEN_TTL || 1800 },
});

export const jwtConfig = registerAs('jwt', (): JwtModuleOptions => config());
