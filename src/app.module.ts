import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import globalConfig from '../config/global.config';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [globalConfig],
    }),
    TypeOrmModule.forRoot(databaseConfig()),
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
