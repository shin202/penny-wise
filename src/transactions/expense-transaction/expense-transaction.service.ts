import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions.service';
import {
  EXPENSE_CREATED,
  EXPENSE_DELETED,
  EXPENSE_UPDATED,
} from '../../common/constants';
import { OnEvent } from '@nestjs/event-emitter';
import { Expense } from '../../expenses/entities/expense.entity';
import { TransactionType } from '../transaction.interface';

@Injectable()
export class ExpenseTransactionService {
  constructor(private readonly transactionService: TransactionsService) {}

  @OnEvent(EXPENSE_CREATED)
  private handleExpenseCreatedEvent(expense: Expense) {
    return this.transactionService.create(expense, TransactionType.EXPENSE);
  }

  @OnEvent(EXPENSE_UPDATED)
  private handleExpenseUpdatedEvent(expense: Expense) {
    return this.transactionService.update(expense, TransactionType.EXPENSE);
  }

  @OnEvent(EXPENSE_DELETED)
  private handleExpenseDeletedEvent(id: number) {
    return this.transactionService.remove(id, TransactionType.EXPENSE);
  }
}
