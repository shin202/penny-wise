import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { useContainer } from 'class-validator';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { loggerConfig, validationPipeConfig } from './config';
import { HttpExceptionFilter, TransformInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig()),
  });

  app.useGlobalPipes(new ValidationPipe(validationPipeConfig()));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const appService = app.get(ConfigService);
  const port = appService.get<number>('port');

  await app.listen(port);
}

bootstrap();
