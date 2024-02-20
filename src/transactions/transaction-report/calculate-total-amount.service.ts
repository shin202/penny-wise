import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ConvertCurrencyDto } from '../../common/dto/convert-currency.dto';
import { TransactionType } from '../transaction.interface';
import { Request } from 'express';
import { Transaction } from '../entities/transaction.entity';
import { ConvertCurrencyProvider } from '../../common/providers/convert-currency.provider';

@Injectable()
export class CalculateTotalAmountService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly convertCurrencyProvider: ConvertCurrencyProvider,
  ) {}

  async calculateTotalAmount(
    convertCurrencyDto: ConvertCurrencyDto,
    req: Request & { user: User },
    transactionType: TransactionType,
  ): Promise<number> {
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    queryBuilder
      .andWhere('user.id = :userId', { userId: req.user.id })
      .andWhere('transaction.transactionType = :type', {
        type: transactionType,
      })
      .leftJoin('transaction.user', 'user')
      .leftJoin('transaction.currency', 'currency')
      .select([
        `CAST(transaction.amount AS DECIMAL(10, 2)) AS amount`,
        'currency.code AS currencyCode',
      ]);

    const queryResult: {
      amount: string;
      currencyCode: string;
    }[] = await queryBuilder.getRawMany();

    const { baseCurrency } = convertCurrencyDto;
    const convertCurrencyPromises: Promise<number>[] = queryResult.map(
      (each) => {
        const { amount, currencyCode } = each;

        return this.convertCurrencyProvider.convert(
          currencyCode,
          baseCurrency,
          Number(amount),
        );
      },
    );

    const convertedAmounts: number[] = await Promise.all(
      convertCurrencyPromises,
    );

    return convertedAmounts.reduce((acc, curr) => acc + curr, 0);
  }
}
