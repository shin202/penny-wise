import { Injectable } from '@nestjs/common';
import { Expense } from '../expenses/entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { AggregateParams, TransactionType } from './transaction.interface';
import { Income } from '../incomes/entities/income.entity';
import { PageMetaDto } from '../common/dto';
import { TransformQueryParamsService } from '../common/providers/transform-query-params.service';
import { FindTransactionsDto } from './dto/find-transactions.dto';
import { StatsDto } from './dto/stats.dto';
import { ConvertCurrencyService } from '../common/providers/convert-currency.service';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly transformQueryParamsService: TransformQueryParamsService,
    private readonly convertCurrencyService: ConvertCurrencyService,
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

  async statsTotalAmount(
    statsDto: StatsDto,
    req: Request & { user: User },
    type: TransactionType,
  ) {
    const queryBuilder = this.buildBaseQuery(statsDto, req, type);
    const results: AggregateParams[] = await queryBuilder.getRawMany();
    const baseCurrency =
      statsDto.baseCurrency || results[0]?.walletCurrencyCode;
    const currencySymbol = statsDto.baseCurrency
      ? ''
      : results[0]?.walletCurrencySymbol;
    const totalAmount: number = await this.calculateTotalAmount(
      results,
      baseCurrency,
    );

    return {
      totalAmount,
      currency: {
        symbol: currencySymbol,
        code: baseCurrency,
      },
    };
  }

  async statsAmountByCategory(
    statsDto: StatsDto,
    req: Request & { user: User },
    type: TransactionType,
  ) {
    const results = await this.buildStatsAmountByCategoryQuery(
      statsDto,
      req,
      type,
    );
    const baseCurrency =
      statsDto.baseCurrency || results[0]?.walletCurrencyCode;

    return this.calculateSumAmountByCategory(results, baseCurrency);
  }

  private buildStatsAmountByCategoryQuery(
    statsDto: StatsDto,
    req: Request & { user: User },
    type: TransactionType,
  ): Promise<AggregateParams[]> {
    const queryBuilder = this.buildBaseQuery(statsDto, req, type);
    if (statsDto.isParent === true) {
      queryBuilder
        .leftJoin('transaction.category', 'child')
        .leftJoin(Category, 'parent', 'child.parent_id = parent.id')
        .addSelect(`COALESCE(parent.name, child.name)`, 'categoryName')
        .addSelect(`COALESCE(parent.id, child.id)`, 'categoryId');
    } else {
      queryBuilder
        .leftJoin('transaction.category', 'category')
        .addSelect('category.name', 'categoryName')
        .addSelect('category.id', 'categoryId');
    }

    return queryBuilder.getRawMany();
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

  private buildBaseQuery(
    statsDto: StatsDto,
    req: Request & { user: User },
    type: TransactionType,
  ) {
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    if (statsDto.date) {
      queryBuilder.andWhere(`DATE(transaction.transactionDate) = :date`, {
        date: statsDto.date,
      });
    }

    if (statsDto.startDate && statsDto.endDate) {
      queryBuilder.andWhere(
        `DATE(transaction.transactionDate) BETWEEN :startDate AND :endDate`,
        {
          startDate: statsDto.startDate,
          endDate: statsDto.endDate,
        },
      );
    }

    if (statsDto.wallet) {
      queryBuilder.andWhere('wallet.id = :walletId', {
        walletId: statsDto.wallet,
      });
    }

    queryBuilder
      .andWhere('user.id = :userId', {
        userId: req.user.id,
      })
      .andWhere('transaction.transactionType = :type', {
        type,
      })
      .leftJoin('transaction.user', 'user')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoin('transaction.currency', 'currency')
      .leftJoin('wallet.currency', 'walletCurrency')
      .select('CAST(transaction.amount AS FLOAT)', 'amount')
      .addSelect('currency.code', 'currencyCode')
      .addSelect('walletCurrency.symbol', 'walletCurrencySymbol')
      .addSelect('walletCurrency.code', 'walletCurrencyCode');

    return queryBuilder;
  }

  private async calculateSumAmountByCategory(
    results: AggregateParams[],
    baseCurrency: string,
  ) {
    const categories = new Map<
      number,
      { id: number; name: string; amount: number }
    >();

    for (const result of results) {
      const amount = await this.convertCurrency(result, baseCurrency);
      const category = categories.get(result.categoryId) || {
        id: result.categoryId,
        name: result.categoryName,
        amount: 0,
      };
      category.amount += amount;
      categories.set(result.categoryId, category);
    }

    return Array.from(categories.values());
  }

  private async convertCurrency(result: AggregateParams, baseCurrency: string) {
    if (result.currencyCode !== baseCurrency) {
      result.amount = await this.convertCurrencyService.convert(
        result.currencyCode,
        baseCurrency,
        result.amount,
      );
    }

    return result.amount;
  }

  private async calculateTotalAmount(
    results: AggregateParams[],
    baseCurrency: string,
  ) {
    let totalAmount: number = 0;

    for (const result of results) {
      const amount = await this.convertCurrency(result, baseCurrency);
      totalAmount += amount;
    }

    return parseFloat(totalAmount.toFixed(2));
  }
}
