import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { FindTransactionsDto } from './dto/find-transactions.dto';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { StatsService } from './stats/stats.service';
import { StatsDto } from './dto/stats.dto';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly statsService: StatsService,
  ) {}

  @Get()
  findAll(
    @Query() findTransactionsDto: FindTransactionsDto,
    @Req() req: Request & { user: User },
  ) {
    return this.transactionsService.findAll(findTransactionsDto, req);
  }

  @Get('stats')
  getStats(@Query() statsDto: StatsDto, @Req() req: Request & { user: User }) {
    return this.statsService.getStats(statsDto, req);
  }
}
