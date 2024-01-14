import { IsUnique } from '../../shared/validation/is-unique';
import { Currency } from '../entities/currency.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCurrencyDto {
  @IsUnique(Currency, 'name')
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(5)
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsUnique(Currency, 'code')
  @MaxLength(3)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  decimalDigits: number;

  @IsNumber()
  @IsNotEmpty()
  rounding: number;

  @IsString()
  @IsNotEmpty()
  namePlural: string;
}
