import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { FindTransactionsDto } from './dto/find-transactions.dto';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { SummaryReportService } from './transaction-report/summary-report.service';
import { ConvertCurrencyDto } from '../common/dto/convert-currency.dto';
import { LastSevenDaysReportService } from './transaction-report/last-seven-days-report.service';
import { TransactionReportDto } from './dto/transaction-report.dto';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly summaryStatsService: SummaryReportService,
    private readonly lastSevenDayReportService: LastSevenDaysReportService,
  ) {}

  @Get()
  findAll(
    @Query() findTransactionsDto: FindTransactionsDto,
    @Req() req: Request & { user: User },
  ) {
    return this.transactionsService.findAll(findTransactionsDto, req);
  }

  @Get('stats/summary')
  getSummaryReport(
    @Query() convertCurrencyDto: ConvertCurrencyDto,
    @Req() req: Request & { user: User },
  ) {
    return this.summaryStatsService.generateSummaryReport(
      convertCurrencyDto,
      req,
    );
  }

  @Get('stats/last-seven-days')
  getLastSevenDaysReport(
    @Query() transactionReportDto: TransactionReportDto,
    @Req() req: Request & { user: User },
  ) {
    return this.lastSevenDayReportService.generateReport(
      transactionReportDto,
      req,
    );
  }
}
