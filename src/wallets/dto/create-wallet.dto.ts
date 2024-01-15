import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExists } from '../../shared/validation/is-exists';
import { Currency } from '../../currencies/entities/currency.entity';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDecimal()
  @IsNotEmpty()
  balance: number;

  @IsOptional()
  description?: string;

  @IsExists(Currency, 'id')
  @IsNumber()
  @IsNotEmpty()
  currencyId: number;
}
