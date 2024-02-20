import type { IPageMeta } from '@/common/interfaces/page-meta.interface'

export interface IApiResponse<T> {
  statusCode: number
  status: 'success' | 'error'
  message: string
  data: T
  timestamp?: Date | number
}

export interface IApiResponseWithPagination<T> extends IApiResponse<T> {
  data: T & { meta: IPageMeta }
}
