import { Injectable } from '@nestjs/common';
import { Expense } from '../expenses/entities/expense.entity';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EXPENSE_CREATED,
  EXPENSE_DELETED,
  EXPENSE_UPDATED,
} from '../shared/events.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionType } from './transaction.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  @OnEvent(EXPENSE_CREATED)
  private handleExpenseCreatedEvent(expense: Expense) {
    const transactionPayload = {
      user: expense.user,
      wallet: expense.wallet,
      category: expense.category,
      currency: expense.currency,
      amount: expense.amount,
      transactionDate: expense.transactionDate,
      transactionType: TransactionType.EXPENSE,
      transactionId: expense.id,
    };

    const transaction: Transaction =
      this.transactionRepository.create(transactionPayload);

    return this.transactionRepository.save(transaction);
  }

  @OnEvent(EXPENSE_UPDATED)
  private handleExpenseUpdatedEvent(expense: Expense) {
    const transactionPayload = {
      user: expense.user,
      wallet: expense.wallet,
      category: expense.category,
      currency: expense.currency,
      amount: expense.amount,
      transactionDate: expense.transactionDate,
      transactionType: TransactionType.EXPENSE,
      transactionId: expense.id,
    };

    return this.transactionRepository.update(
      {
        transactionType: TransactionType.EXPENSE,
        transactionId: expense.id,
      },
      transactionPayload,
    );
  }

  @OnEvent(EXPENSE_DELETED)
  private handleExpenseDeletedEvent(id: number) {
    return this.transactionRepository.delete({
      transactionType: TransactionType.EXPENSE,
      transactionId: id,
    });
  }
}
