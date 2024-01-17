import { setSeederFactory } from 'typeorm-extension';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { WalletStatus } from '../../wallets/wallet.interface';

export default setSeederFactory(Wallet, (faker) => {
  const wallet = new Wallet();

  wallet.name = faker.lorem.word(5);
  wallet.balance = Number(faker.finance.amount(100000, 1000000, 2));
  wallet.description = faker.lorem.sentence(3);
  wallet.status = faker.helpers.enumValue(WalletStatus);

  return wallet;
});
