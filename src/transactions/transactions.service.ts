import { Injectable } from '@nestjs/common';
import { Expense } from '../expenses/entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionType } from './transaction.interface';
import { Income } from '../incomes/entities/income.entity';
import { PageMetaDto } from '../common/dto';
import { TransformQueryParamsProvider } from '../common/providers/transform-query-params.provider';
import { FindTransactionsDto } from './dto/find-transactions.dto';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly transformQueryParamsService: TransformQueryParamsProvider,
  ) {}

  create(
    payload: Expense | Income,
    transactionType: TransactionType,
  ): Promise<Transaction> {
    const transactionPayload = this.buildTransactionPayload(
      payload,
      transactionType,
    );
    const transaction = this.transactionRepository.create(transactionPayload);
    return this.transactionRepository.save(transaction);
  }

  async findAll(
    findTransactionsDto: FindTransactionsDto,
    req: Request & { user: User },
  ) {
    const queryBuilder = this.buildFindAllQuery(findTransactionsDto, req);
    const itemCount = await queryBuilder.getCount();
    const transactions = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({
      queryOptionsDto: findTransactionsDto,
      itemCount,
    });

    return {
      status: 'success',
      message: 'Transactions retrieved successfully',
      data: {
        transactions,
        meta: pageMetaDto,
      },
    };
  }

  update(payload: Expense | Income, transactionType: TransactionType) {
    const transactionPayload = this.buildTransactionPayload(
      payload,
      transactionType,
    );

    return this.transactionRepository.update(
      {
        transactionType,
        transactionId: payload.id,
      },
      transactionPayload,
    );
  }

  remove(id: number, transactionType: TransactionType) {
    return this.transactionRepository.delete({
      transactionType,
      transactionId: id,
    });
  }

  private buildTransactionPayload(
    payload: Expense | Income,
    transactionType: TransactionType,
  ) {
    return {
      user: payload.user,
      wallet: payload.wallet,
      category: payload.category,
      currency: payload.currency,
      amount: payload.amount,
      transactionDate: payload.transactionDate,
      transactionType,
      transactionId: payload.id,
    };
  }

  private buildFindAllQuery(
    findTransactionsDto: FindTransactionsDto,
    req: Request & { user: User },
  ) {
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    const orderBy = this.transformQueryParamsService.transformOrder(
      'transaction',
      findTransactionsDto.order,
    );

    if (findTransactionsDto.date) {
      queryBuilder.andWhere(`DATE(transaction.transactionDate) = :date`, {
        date: findTransactionsDto.date,
      });
    }

    if (findTransactionsDto.startDate && findTransactionsDto.endDate) {
      queryBuilder.andWhere(
        `DATE(transaction.transactionDate) BETWEEN :startDate AND :endDate`,
        {
          startDate: findTransactionsDto.startDate,
          endDate: findTransactionsDto.endDate,
        },
      );
    }

    if (findTransactionsDto.wallet) {
      queryBuilder.andWhere('wallet.id = :walletId', {
        walletId: findTransactionsDto.wallet,
      });
    }

    if (findTransactionsDto.category) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: findTransactionsDto.category,
      });
    }

    if (findTransactionsDto.currency) {
      queryBuilder.andWhere('currency.id = :currencyId', {
        currencyId: findTransactionsDto.currency,
      });
    }

    if (findTransactionsDto.type) {
      queryBuilder.andWhere('transaction.transactionType = :type', {
        type: findTransactionsDto.type,
      });
    }

    queryBuilder
      .andWhere('user.id = :userId', {
        userId: req.user.id,
      })
      .leftJoin('transaction.user', 'user')
      .leftJoin('transaction.wallet', 'wallet')
      .leftJoin('transaction.category', 'category')
      .leftJoin('transaction.currency', 'currency')
      .select([
        'transaction',
        'category.id',
        'category.name',
        'currency.id',
        'currency.symbol',
        'currency.code',
        'wallet.id',
        'wallet.name',
      ])
      .orderBy(orderBy)
      .skip(findTransactionsDto.skip)
      .take(findTransactionsDto.limit);

    return queryBuilder;
  }
}
