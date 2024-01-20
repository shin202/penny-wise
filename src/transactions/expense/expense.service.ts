import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions.service';
import {
  EXPENSE_CREATED,
  EXPENSE_DELETED,
  EXPENSE_UPDATED,
} from '../../common/constants/events.constant';
import { OnEvent } from '@nestjs/event-emitter';
import { Expense } from '../../expenses/entities/expense.entity';

@Injectable()
export class ExpenseService {
  constructor(private readonly transactionService: TransactionsService) {}

  @OnEvent(EXPENSE_CREATED)
  private handleExpenseCreatedEvent(expense: Expense) {
    return this.transactionService.create(expense);
  }

  @OnEvent(EXPENSE_UPDATED)
  private handleExpenseUpdatedEvent(expense: Expense) {
    return this.transactionService.update(expense);
  }

  @OnEvent(EXPENSE_DELETED)
  private handleExpenseDeletedEvent(expense: Expense) {
    return this.transactionService.remove(expense);
  }
}
