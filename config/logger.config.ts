import { registerAs } from '@nestjs/config';
import * as winston from 'winston';
import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

export default registerAs(
  'logger',
  (): WinstonModuleOptions => ({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('Penny-Wise', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  }),
);
