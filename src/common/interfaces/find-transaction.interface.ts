import type { IQueryOptions } from '@/common/interfaces/query-options.interface'
import { TransactionType } from '@/common/constants'

export interface IFindTransaction extends IQueryOptions {
  wallet?: number
  category?: number
  currency?: number
  type?: TransactionType
  date?: Date | string
  startDate?: Date | string
  endDate?: Date | string
}
