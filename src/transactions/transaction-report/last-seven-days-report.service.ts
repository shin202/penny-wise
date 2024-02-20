import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionReportDto } from '../dto/transaction-report.dto';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { ConvertCurrencyProvider } from '../../common/providers/convert-currency.provider';
import { DateProvider } from '../../common/providers/date.provider';
import { Transform } from '../../common/interceptors/transform.interface';

interface IQueryResult {
  amount: number;
  currencyCode: string;
  walletCurrencyCode: string;
  transactionDate: Date;
  categoryName: string;
  categoryId: number;
}

type AmountByCategory = Map<
  number,
  { id: number; name: string; amount: number }
>;

type AmountByLastSevenDays = Map<
  string,
  { date: string; amount: number; currencyCode: string }
>;

@Injectable()
export class LastSevenDaysReportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly convertCurrencyProvider: ConvertCurrencyProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async generateReport(
    transactionReport: TransactionReportDto,
    req: Request & { user: User },
  ): Promise<Transform<any>> {
    const queryBuilder = this.buildQuery(transactionReport, req);
    const queryResult: IQueryResult[] = await queryBuilder.getRawMany();

    const baseCurrency =
      transactionReport.baseCurrency || queryResult[0].walletCurrencyCode;

    const convertedAmounts: number[] = await this.getConvertedAmounts(
      queryResult,
      baseCurrency,
    );

    const amountByCategory: AmountByCategory = this.initAmountByCategory();
    const amountByLastSevenDays: AmountByLastSevenDays =
      this.initAmountByLastSevenDays(baseCurrency);

    queryResult.forEach((each, index) => {
      this.updateAmountByCategory(
        amountByCategory,
        each,
        index,
        convertedAmounts,
        baseCurrency,
      );
      this.updateAmountByLastSevenDays(
        amountByLastSevenDays,
        each,
        index,
        convertedAmounts,
      );
    });

    return {
      status: 'success',
      message: 'Last seven days report fetched successfully',
      data: {
        amountByCategory: Array.from(amountByCategory.values()),
        amountByDate: Array.from(amountByLastSevenDays.values()).reverse(),
      },
    };
  }

  private buildQuery = (
    transactionReport: TransactionReportDto,
    req: Request & { user: User },
  ) => {
    const { wallet, transactionType, isParent } = transactionReport;
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    const select: string[] = [
      `CAST(transaction.amount AS FLOAT) AS amount`,
      'currency.code AS currencyCode',
      'walletCurrency.code AS walletCurrencyCode',
      'transaction.transactionDate AS transactionDate',
    ];

    if (wallet) {
      queryBuilder.andWhere('wallet.id = :wallet', { wallet });
    }

    if (isParent) {
      queryBuilder
        .leftJoin('transaction.category', 'child')
        .leftJoin(Category, 'parent', 'child.parent_id = parent.id');

      select.push(
        `COALESCE(parent.name, child.name) AS categoryName`,
        `COALESCE(parent.id, child.id) AS categoryId`,
      );
    } else {
      queryBuilder.leftJoin('transaction.category', 'category');

      select.push('category.name AS categoryName', 'category.id AS categoryId');
    }

    return queryBuilder
      .andWhere('user.id = :userId', {
        userId: req.user.id,
      })
      .andWhere('transaction.transactionType = :type', {
        type: transactionType,
      })
      .andWhere(
        `DATE(transaction.transactionDate) BETWEEN :startDate AND :endDate`,
        {
          startDate: this.dateProvider.today
            .subtract(7, 'day')
            .format('YYYY-MM-DD'),
          endDate: this.dateProvider.today.format('YYYY-MM-DD'),
        },
      )
      .leftJoin('transaction.user', 'user')
      .leftJoin('transaction.wallet', 'wallet')
      .leftJoin('transaction.currency', 'currency')
      .leftJoin('wallet.currency', 'walletCurrency')
      .select(select);
  };

  private initAmountByCategory() {
    return new Map<number, { id: number; name: string; amount: number }>();
  }

  private initAmountByLastSevenDays(baseCurrency: string) {
    const amountByLastSevenDays = new Map<
      string,
      { date: string; amount: number; currencyCode: string }
    >();

    for (let i = 0; i < 7; i++) {
      const date = this.dateProvider.today
        .subtract(i, 'day')
        .format('YYYY-MM-DD');
      amountByLastSevenDays.set(date, {
        date,
        amount: 0,
        currencyCode: baseCurrency,
      });
    }

    return amountByLastSevenDays;
  }

  private updateAmountByCategory(
    amountByCategory: AmountByCategory,
    each: IQueryResult,
    index: number,
    convertedAmounts: number[],
    baseCurrency: string,
  ) {
    const category = amountByCategory.get(each.categoryId) || {
      id: each.categoryId,
      name: each.categoryName,
      amount: 0,
      currencyCode: baseCurrency,
    };
    category.amount += convertedAmounts[index];
    amountByCategory.set(each.categoryId, category);
  }

  private updateAmountByLastSevenDays(
    amountByLastSevenDays: AmountByLastSevenDays,
    each: IQueryResult,
    index: number,
    convertedAmounts: number[],
  ) {
    const transactionDate = this.dateProvider.format(
      each.transactionDate,
      'YYYY-MM-DD',
    );

    if (amountByLastSevenDays.has(transactionDate)) {
      const dateData = amountByLastSevenDays.get(transactionDate);
      dateData.amount += convertedAmounts[index];
      amountByLastSevenDays.set(transactionDate, dateData);
    }
  }

  private getConvertedAmounts(
    queryResult: IQueryResult[],
    baseCurrency: string,
  ) {
    const convertCurrencyPromises: Promise<number>[] = queryResult.map(
      (each) => {
        const { amount, currencyCode } = each;

        return this.convertCurrencyProvider.convert(
          currencyCode,
          baseCurrency,
          amount,
        );
      },
    );

    return Promise.all(convertCurrencyPromises);
  }
}
