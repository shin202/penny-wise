import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions.service';
import { OnEvent } from '@nestjs/event-emitter';
import {
  INCOME_CREATED,
  INCOME_DELETED,
  INCOME_UPDATED,
} from '../../common/constants/events.constant';
import { Income } from '../../incomes/entities/income.entity';

@Injectable()
export class IncomeService {
  constructor(private readonly transactionService: TransactionsService) {}

  @OnEvent(INCOME_CREATED)
  private handleIncomeCreatedEvent(income: Income) {
    return this.transactionService.create(income);
  }

  @OnEvent(INCOME_UPDATED)
  private handleIncomeUpdatedEvent(income: Income) {
    return this.transactionService.update(income);
  }

  @OnEvent(INCOME_DELETED)
  private handleIncomeDeletedEvent(income: Income) {
    return this.transactionService.remove(income);
  }
}
