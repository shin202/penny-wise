import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions.service';
import { OnEvent } from '@nestjs/event-emitter';
import {
  INCOME_CREATED,
  INCOME_DELETED,
  INCOME_UPDATED,
} from '../../common/constants';
import { Income } from '../../incomes/entities/income.entity';
import { TransactionType } from '../transaction.interface';

@Injectable()
export class IncomeTransactionService {
  constructor(private readonly transactionService: TransactionsService) {}

  @OnEvent(INCOME_CREATED)
  private handleIncomeCreatedEvent(income: Income) {
    return this.transactionService.create(income, TransactionType.INCOME);
  }

  @OnEvent(INCOME_UPDATED)
  private handleIncomeUpdatedEvent(income: Income) {
    return this.transactionService.update(income, TransactionType.INCOME);
  }

  @OnEvent(INCOME_DELETED)
  private handleIncomeDeletedEvent(id: number) {
    return this.transactionService.remove(id, TransactionType.INCOME);
  }
}
