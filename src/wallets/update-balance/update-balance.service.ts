import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EXPENSE_CREATED, INCOME_CREATED } from '../../common/constants';
import { Expense } from '../../expenses/entities/expense.entity';
import { ConvertCurrencyProvider } from '../../common/providers/convert-currency.provider';
import { WalletsService } from '../wallets.service';
import { Wallet } from '../entities/wallet.entity';
import { CurrenciesService } from '../../currencies/currencies.service';
import { Currency } from '../../currencies/entities/currency.entity';
import { Income } from '../../incomes/entities/income.entity';

@Injectable()
export class UpdateBalanceService {
  constructor(
    private readonly walletService: WalletsService,
    private readonly currencyService: CurrenciesService,
    private readonly convertCurrencyService: ConvertCurrencyProvider,
  ) {}

  @OnEvent(EXPENSE_CREATED)
  private async decreaseBalance(payload: Expense) {
    await this.updateBalance(payload, 'decrease');
  }

  @OnEvent(INCOME_CREATED)
  private async increaseBalance(payload: Income) {
    await this.updateBalance(payload, 'increase');
  }

  private async updateBalance(
    payload: Expense | Income,
    operation: 'increase' | 'decrease',
  ) {
    const { wallet, currency } = payload;

    const walletToUpdate: Wallet = await this.walletService.findOrFail(
      wallet.id,
    );
    const walletCurrencyCode: string = walletToUpdate.currency.code;

    const currencyToConvert: Currency = await this.currencyService.findOne(
      currency.id,
    );
    const currencyToConvertCode: string = currencyToConvert.code;

    const amount = await this.convertCurrencyService.convert(
      currencyToConvertCode,
      walletCurrencyCode,
      payload.amount,
      walletToUpdate.currency.decimalDigits,
    );

    await this.updateWalletBalance(walletToUpdate, amount, operation);
  }

  private async updateWalletBalance(
    wallet: Wallet,
    amount: number,
    operation: 'increase' | 'decrease',
  ) {
    if (operation === 'increase') {
      wallet.balance = Number(wallet.balance) + Number(amount);
    } else {
      wallet.balance = Number(wallet.balance) - Number(amount);
    }
    await wallet.save();
  }
}
