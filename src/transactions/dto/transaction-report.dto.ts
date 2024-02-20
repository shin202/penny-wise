import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsExists } from '../../shared/validation/is-exists';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { TransactionType } from '../transaction.interface';

export class TransactionReportDto {
  @Type(() => Number)
  @IsExists(Wallet, 'id')
  @IsInt()
  @IsOptional()
  readonly wallet?: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  readonly transactionType: TransactionType;

  @ValidateIf((o) => !o.wallet)
  @IsISO4217CurrencyCode()
  @IsNotEmpty()
  readonly baseCurrency?: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  readonly isParent?: boolean = false;
}
