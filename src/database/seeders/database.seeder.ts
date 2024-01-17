import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import * as dayjs from 'dayjs';
import { Category } from '../../categories/entities/category.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { PasswordUtils, RandomUtils } from '../../utils';

export class DatabaseSeeder implements Seeder {
  track?: boolean;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.save({
      username: 'test',
      email: 'test@gmail.com',
      password: PasswordUtils.hashPassword('123@qWwe'),
      isVerified: true,
      emailVerifiedAt: dayjs().toDate(),
    });

    const currencyRepository = dataSource.getRepository(Currency);

    const currencyArr = [
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

    const currencies: Currency[] = await currencyRepository.save(currencyArr);

    const categoryFactory = factoryManager.get(Category);
    const categories = await categoryFactory.saveMany(10);

    const walletFactory = factoryManager.get(Wallet);
    const wallets = await walletFactory.saveMany(10, {
      user,
      currency: RandomUtils.randomArrayElement(currencies),
    });

    const expenseFactory = factoryManager.get(Expense);
    await expenseFactory.saveMany(10, {
      user,
      currency: RandomUtils.randomArrayElement(currencies),
      wallet: RandomUtils.randomArrayElement(wallets),
      category: RandomUtils.randomArrayElement(categories),
    });
  }
}
