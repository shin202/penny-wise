import { Injectable } from '@nestjs/common';
import { StatsDto } from '../dto/stats.dto';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { TransactionType } from '../transaction.interface';
import { TransactionsService } from '../transactions.service';

@Injectable()
export class StatsService {
  constructor(private readonly transactionService: TransactionsService) {}

  async getStats(statsDto: StatsDto, req: Request & { user: User }) {
    const totalExpenses = await this.transactionService.statsTotalAmount(
      statsDto,
      req,
      TransactionType.EXPENSE,
    );
    const totalIncomes = await this.transactionService.statsTotalAmount(
      statsDto,
      req,
      TransactionType.INCOME,
    );
    const totalExpensesByCategory =
      await this.transactionService.statsAmountByCategory(
        statsDto,
        req,
        TransactionType.EXPENSE,
      );

    const totalIncomesByCategory =
      await this.transactionService.statsAmountByCategory(
        statsDto,
        req,
        TransactionType.INCOME,
      );

    return {
      status: 'success',
      message: 'Stats retrieved successfully',
      data: {
        totalExpenses,
        totalExpensesByCategory,
        totalIncomes,
        totalIncomesByCategory,
      },
    };
  }
}
