import { IsISO4217CurrencyCode, IsNotEmpty } from 'class-validator';

export class ConvertCurrencyDto {
  @IsISO4217CurrencyCode()
  @IsNotEmpty()
  readonly baseCurrency: string;
}
