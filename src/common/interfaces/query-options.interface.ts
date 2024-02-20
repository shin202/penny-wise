import { Order } from '@/common/constants'

export interface IQueryOptions {
  page?: number
  limit?: number
  order?: Record<string, Order>
}
