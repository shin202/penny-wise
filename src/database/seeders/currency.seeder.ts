import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Currency } from '../../currencies/entities/currency.entity';

export default class CurrencySeeder implements Seeder {
  track?: boolean;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Currency);

    const currencies: Partial<Currency>[] = [
      {
        symbol: '$',
        name: 'US Dollar',
        decimalDigits: 2,
        rounding: 0,
        code: 'USD',
        namePlural: 'US dollars',
      },
      {
        symbol: '₫',
        name: 'Vietnamese Dong',
        decimalDigits: 0,
        rounding: 0,
        code: 'VND',
        namePlural: 'Vietnamese dong',
      },
    ];

    await repository.insert(currencies);
  }
}
