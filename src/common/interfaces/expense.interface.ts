import type { IWallet } from '@/common/interfaces/wallet.interface'
import type { ICurrency } from '@/common/interfaces/currency.interface'
import type { ICategory } from '@/common/interfaces/category.interface'
import type { IImage } from '@/common/interfaces/image.interface'

export interface IExpense {
  id: number
  wallet: IWallet
  currency: ICurrency
  category: ICategory
  images?: IImage[]
  amount: number
  transactionDate: Date | string
  notes?: string
  createdAt: Date | string
  updatedAt: Date | string
}
