import { IsExists } from '../../shared/validation/is-exists';
import { Wallet } from '../../wallets/entities/wallet.entity';
import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Currency } from '../../currencies/entities/currency.entity';
import { Category } from '../../categories/entities/category.entity';

export class CreateIncomeDto {
  @IsExists(Wallet, 'id')
  @IsNumber()
  @IsNotEmpty()
  walletId: number;

  @IsExists(Currency, 'id')
  @IsNumber()
  @IsNotEmpty()
  currencyId: number;

  @IsExists(Category, 'id')
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  transactionDate: Date;

  @IsOptional()
  notes: string;

  @IsOptional()
  imageNames?: string[] = [];
}
