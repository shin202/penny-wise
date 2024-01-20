import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConvertCurrencyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async convert(
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
