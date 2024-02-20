import { Injectable } from '@nestjs/common';
import { CalculateTotalBalanceService } from './calculate-total-balance.service';
import { ConvertCurrencyDto } from '../../common/dto/convert-currency.dto';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { Transform } from '../../common/interceptors/transform.interface';

@Injectable()
export class WalletReportService {
  constructor(
    private readonly calculateTotalBalanceService: CalculateTotalBalanceService,
  ) {}

  async generateReport(
    convertCurrencyDto: ConvertCurrencyDto,
    req: Request & { user: User },
  ): Promise<Transform<any>> {
    const totalBalance =
      await this.calculateTotalBalanceService.calculateTotalBalance(
        convertCurrencyDto,
        req,
      );

    return {
      status: 'success',
      message: 'Total balance fetched successfully',
      data: {
        ...totalBalance,
      },
    };
  }
}
