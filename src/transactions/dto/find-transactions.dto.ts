import { QueryOptionsDto } from '../../common/dto';
import { TransactionType } from '../transaction.interface';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { IsExists } from '../../shared/validation/is-exists';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Category } from '../../categories/entities/category.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { Type } from 'class-transformer';

export class FindTransactionsDto extends QueryOptionsDto {
  @Type(() => Number)
  @IsExists(Wallet, 'id')
  @IsInt()
  @IsOptional()
  readonly wallet?: number;

  @Type(() => Number)
  @IsExists(Category, 'id')
  @IsInt()
  @IsOptional()
  readonly category?: number;

  @Type(() => Number)
  @IsExists(Currency, 'id')
  @IsInt()
  @IsOptional()
  readonly currency?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  readonly type?: TransactionType;

  @IsDateString()
  @IsOptional()
  readonly date?: Date;

  @IsDateString()
  @IsOptional()
  readonly startDate?: Date;

  @IsDateString()
  @IsOptional()
  readonly endDate?: Date;
}
