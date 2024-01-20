export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface AggregateParams {
  amount: number;
  currencyCode: string;
  walletCurrencySymbol: string;
  walletCurrencyCode: string;
  [key: string]: any;
}
