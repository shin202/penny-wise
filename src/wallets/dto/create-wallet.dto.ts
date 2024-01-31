import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsExists } from '../../shared/validation/is-exists';
import { Currency } from '../../currencies/entities/currency.entity';
import { Image } from '../../images/entities/image.entity';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDecimal()
  @IsNotEmpty()
  balance: number;

  @IsOptional()
  description?: string;

  @IsExists(Currency, 'code')
  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @IsExists(Image, 'name')
  @IsString()
  @IsNotEmpty()
  imageName: string;
}
