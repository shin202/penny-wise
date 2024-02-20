import { TransactionType } from '@/common/constants'

export interface ISummaryStats {
  transactionCount: number
  totalTransactionsByType: {
    transactionType: TransactionType
    count: number
  }[]
  expenseTransaction: {
    totalAmount: number
    currencyCode: string
  }
  incomeTransaction: {
    totalAmount: number
    currencyCode: string
  }
}

export interface ITotalBalanceStats {
  totalBalance: number
  currencyCode: string
}

export interface ITransactionReport {
  wallet?: number
  transactionType?: TransactionType
  baseCurrency?: string
  isParent?: boolean
}

export interface ICurrentTransactionReport {
  totalAmount: number
  amountByCategory: { id: number; name: string; amount: number; currencyCode: string }[]
}

export interface ILastSevenDaysReport {
  amountByCategory: { id: number; name: string; amount: number; currencyCode: string }[]
  amountByDate: { date: string; amount: number; currencyCode: string }[]
}
