import type { ICategory } from '@/common/interfaces/category.interface'
import type { ICurrency } from '@/common/interfaces/currency.interface'
import type { IWallet } from '@/common/interfaces/wallet.interface'
import { TransactionType } from '@/common/constants'

export interface ITransaction {
  id: number
  amount: number
  transactionDate: Date | string
  transactionId: number
  transactionType: TransactionType
  category: ICategory
  currency: ICurrency
  wallet: IWallet
  createdAt: Date | string
  updatedAt: Date | string
}
