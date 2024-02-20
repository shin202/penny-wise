import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ExpenseTransactionService } from './expense-transaction/expense-transaction.service';
import { IncomeTransactionService } from './income-transaction/income-transaction.service';
import { WalletsModule } from '../wallets/wallets.module';
import { CalculateTotalAmountService } from './transaction-report/calculate-total-amount.service';
import { SummaryReportService } from './transaction-report/summary-report.service';
import { CountTransactionService } from './transaction-report/count-transaction.service';
import { LastSevenDaysReportService } from './transaction-report/last-seven-days-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), WalletsModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    ExpenseTransactionService,
    IncomeTransactionService,
    CalculateTotalAmountService,
    CountTransactionService,
    SummaryReportService,
    LastSevenDaysReportService,
  ],
})
export class TransactionsModule {}
