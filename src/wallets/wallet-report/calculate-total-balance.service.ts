import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../entities/wallet.entity';
import { Repository } from 'typeorm';
import { ConvertCurrencyDto } from '../../common/dto/convert-currency.dto';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { ConvertCurrencyProvider } from '../../common/providers/convert-currency.provider';

@Injectable()
export class CalculateTotalBalanceService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly convertCurrencyProvider: ConvertCurrencyProvider,
  ) {}

  async calculateTotalBalance(
    convertCurrencyDto: ConvertCurrencyDto,
    req: Request & { user: User },
  ) {
    const queryBuilder = this.walletRepository.createQueryBuilder('wallet');

    queryBuilder
      .andWhere('user.id = :userId', { userId: req.user.id })
      .leftJoin('wallet.user', 'user')
      .leftJoin('wallet.currency', 'currency')
      .select([
        `CAST(wallet.balance AS DECIMAL(10, 2)) AS balance`,
        'currency.code AS currencyCode',
      ]);

    const queryResult: { balance: string; currencyCode: string }[] =
      await queryBuilder.getRawMany();

    const { baseCurrency } = convertCurrencyDto;
    const convertCurrencyPromises: Promise<number>[] = queryResult.map(
      (each) => {
        const { balance, currencyCode } = each;

        return this.convertCurrencyProvider.convert(
          currencyCode,
          baseCurrency,
          Number(balance),
        );
      },
    );

    const convertedBalances: number[] = await Promise.all(
      convertCurrencyPromises,
    );

    return {
      totalBalance: convertedBalances.reduce((acc, curr) => acc + curr, 0),
      currencyCode: baseCurrency,
    };
  }
}
