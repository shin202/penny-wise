import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Wallet } from '../../wallets/entities/wallet.entity';

export class WalletSeeder implements Seeder {
  track?: boolean;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const walletFactory = factoryManager.get(Wallet);
    await walletFactory.saveMany(10);
  }
}
