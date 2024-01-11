import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';

export const loggerConfig = (): WinstonModuleOptions => ({
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
});
