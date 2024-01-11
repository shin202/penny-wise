import { JwtModuleOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

const config = (): JwtModuleOptions => ({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '30m' },
});

export const jwtConfig = registerAs('jwt', (): JwtModuleOptions => config());
