import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import loggerConfig from '../config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig()),
  });

  const appService = app.get(ConfigService);
  const port = appService.get<number>('PORT');

  await app.listen(port);
}

bootstrap();
