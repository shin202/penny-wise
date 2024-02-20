import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import dayjs from 'dayjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errMessage =
      (exception.getResponse() as any).message || exception.message;

    return res.status(status).json({
      statusCode: status,
      status: 'error',
      message: errMessage,
      timestamp: dayjs().toISOString(),
    });
  }
}
