import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DateProvider } from './date.provider';

@Injectable()
export class ConvertCurrencyProvider {
  private cache: Map<string, { amount: number; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60 * 1000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly dateProvider: DateProvider,
  ) {}

  async convert(
    from: string,
    to: string,
    amount: number,
    digits: number = 2,
  ): Promise<number> {
    if (from === to) return Number(amount);

    let convertedAmount: number;
    const cacheKey = `${from}-${to}`;

    if (
      this.cache.has(cacheKey) &&
      this.dateProvider.today.valueOf() - this.cache.get(cacheKey).timestamp <
        this.CACHE_TTL
    ) {
      convertedAmount = this.cache.get(cacheKey).amount;
    } else {
      convertedAmount = await this.getConvert(from, to, amount, digits);
      this.cache.set(cacheKey, {
        amount: convertedAmount,
        timestamp: this.dateProvider.today.valueOf(),
      });
    }

    return convertedAmount;
  }

  private async getConvert(
    from: string,
    to: string,
    amount: number,
    digits: number = 2,
  ): Promise<number> {
    const res = await this.httpService.axiosRef.get(
      `https://api.currencybeacon.com/v1/convert`,
      {
        params: {
          from,
          to,
          amount,
          api_key: this.configService.get('currencyBeaconApiKey'),
        },
      },
    );
    return parseFloat(res.data.value.toFixed(digits));
  }
}
