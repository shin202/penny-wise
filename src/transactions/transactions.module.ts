import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ExpenseTransactionService } from './expense-transaction/expense-transaction.service';
import { IncomeTransactionService } from './income-transaction/income-transaction.service';
import { StatsService } from './stats/stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    ExpenseTransactionService,
    IncomeTransactionService,
    StatsService,
  ],
})
export class TransactionsModule {}
