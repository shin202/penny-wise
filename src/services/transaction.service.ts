import { httpRequest } from '@/utils'
import type {
  IApiResponseWithPagination,
  IFindTransaction,
  ITransaction
} from '@/common/interfaces'

export class TransactionService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  public findAll(
    params: IFindTransaction,
    clearCache?: boolean
  ): Promise<IApiResponseWithPagination<{ transactions: ITransaction[] }>> {
    if (clearCache) httpRequest.storage.remove('list-transactions')

    return httpRequest.get('/transactions', {
      params,
      id: 'list-transactions'
    })
  }
}
