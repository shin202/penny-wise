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

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Transform<Record<string, any>>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Transform<Record<string, any>>> {
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
