import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ExpenseService } from './expense/expense.service';
import { IncomeService } from './income/income.service';
import { StatsService } from './stats/stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [TransactionsService, ExpenseService, IncomeService, StatsService],
})
export class TransactionsModule {}
