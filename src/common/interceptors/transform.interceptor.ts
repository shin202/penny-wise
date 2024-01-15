import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Transform } from './transform.interface';
import { instanceToPlain } from 'class-transformer';
import * as dayjs from 'dayjs';
import { Request } from 'express';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Transform<any>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Transform<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const isGetRequest = request.method === 'GET';
    const imagePathRegex = /images\/(\w+\.\w+)$/;

    if (isGetRequest && request.url.match(imagePathRegex)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        status: data.status,
        message: data.message,
        data: instanceToPlain(data.data),
        timestamp: dayjs().valueOf(),
      })),
    );
  }
}
