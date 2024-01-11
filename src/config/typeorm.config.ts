import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  logging: ['query', 'error'],
});

export const typeormConfig = registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => config(),
);
export default new DataSource({
  ...(config() as DataSourceOptions),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
