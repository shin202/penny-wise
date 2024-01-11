import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UrlUtils } from '../../utils';

@Injectable()
export class VerifyTemporaryUrlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const url = `${req.protocol}://${req.get('host')}${req.url}`;

    try {
      UrlUtils.verifyTemporaryUrl(url, {
        method: req.method,
      });
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }

    return next();
  }
}
