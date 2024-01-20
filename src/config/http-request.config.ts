import { HttpModuleOptions } from '@nestjs/axios';
import { registerAs } from '@nestjs/config';

const httpRequestOptions: HttpModuleOptions = {
  timeout: 300000,
};

export const httpConfig = registerAs('http', () => httpRequestOptions);
