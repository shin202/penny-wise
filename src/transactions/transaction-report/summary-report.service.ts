import { Injectable } from '@nestjs/common';
import { CountTransactionService } from './count-transaction.service';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { CalculateTotalAmountService } from './calculate-total-amount.service';
import { ConvertCurrencyDto } from '../../common/dto/convert-currency.dto';
import { TransactionType } from '../transaction.interface';
import { Transform } from '../../common/interceptors/transform.interface';

@Injectable()
export class SummaryReportService {
  constructor(
    private readonly countTransactionService: CountTransactionService,
    private readonly calculateTotalAmountService: CalculateTotalAmountService,
  ) {}

  async generateSummaryReport(
    convertCurrencyDto: ConvertCurrencyDto,
    req: Request & { user: User },
  ): Promise<Transform<any>> {
    const { baseCurrency } = convertCurrencyDto;

    const totalTransactions = await this.countTransactionService.getCount(req);
    const totalExpenseAmount =
      await this.calculateTotalAmountService.calculateTotalAmount(
        convertCurrencyDto,
        req,
        TransactionType.EXPENSE,
      );

    const totalIncomeAmount =
      await this.calculateTotalAmountService.calculateTotalAmount(
        convertCurrencyDto,
        req,
        TransactionType.INCOME,
      );

    return {
      status: 'success',
      message: 'Summary stats data of transactions fetched successfully.',
      data: {
        ...totalTransactions,
        expenseTransaction: {
          totalAmount: totalExpenseAmount,
          currencyCode: baseCurrency,
        },
        incomeTransaction: {
          totalAmount: totalIncomeAmount,
          currencyCode: baseCurrency,
        },
      },
    };
  }
}
