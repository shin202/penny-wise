import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { IsExists } from '../../shared/validation/is-exists';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Type } from 'class-transformer';

export class StatsDto {
  @IsDateString()
  @IsOptional()
  readonly date?: Date;

  @ValidateIf((o) => o.endDate)
  @IsDateString()
  @IsNotEmpty()
  readonly startDate?: Date;

  @ValidateIf((o) => o.startDate)
  @IsDateString()
  @IsNotEmpty()
  readonly endDate?: Date;

  @Type(() => Number)
  @IsExists(Wallet, 'id')
  @IsInt()
  @IsOptional()
  readonly wallet?: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  readonly isParent?: boolean = false;

  @ValidateIf((o) => !o.wallet)
  @IsISO4217CurrencyCode()
  @IsNotEmpty()
  readonly baseCurrency?: string;
}
