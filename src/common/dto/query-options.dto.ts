import { IsInt, IsObject, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../constants';
import { Type } from 'class-transformer';

export class QueryOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Max(50)
  @Min(1)
  @IsOptional()
  readonly limit?: number = 10;

  @IsObject()
  @IsOptional()
  readonly order?: Record<string, Order> = { id: Order.ASC };

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
