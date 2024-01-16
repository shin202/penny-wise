import { IsExists } from '../../shared/validation/is-exists';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { IsDecimal, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Currency } from '../../currencies/entities/currency.entity';
import { Category } from '../../categories/entities/category.entity';

export class CreateExpenseDto {
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

  @IsOptional()
  notes?: string;

  @IsOptional()
  imageNames?: string[];
}
