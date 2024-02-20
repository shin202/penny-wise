import { unlink } from 'fs';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import dayjs from 'dayjs';

@Catch(BadRequestException)
export class DeleteFileOnFailFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const files = this.getFiles(request);

    files.forEach((file) => {
      unlink(file.path, (err) => {
        if (err) {
          console.log(err);
          return err;
        }
      });
    });

    return response.status(status).json({
      status: 'error',
      statusCode: status,
      message: exception.message,
      timestamp: dayjs().valueOf(),
    });
  }

  getFiles(request: Request) {
    if (!(request.files || request.file)) return [];
    if (Array.isArray(request.files)) return request.files;
    if (request.files) return Object.values(request.files);
    return [request.file];
  }
}
