import { httpRequest } from '@/utils'
import type {
  IApiResponse,
  ICurrentTransactionReport,
  ILastSevenDaysReport,
  ISummaryStats,
  ITotalBalanceStats,
  ITransactionReport
} from '@/common/interfaces'

export class StatsService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  public getSummaryStats(baseCurrency: string): Promise<IApiResponse<ISummaryStats>> {
    return httpRequest.get('/transactions/stats/summary', {
      params: { baseCurrency }
    })
  }

  public getTotalBalanceStats(baseCurrency: string): Promise<IApiResponse<ITotalBalanceStats>> {
    return httpRequest.get('/wallets/stats/total-balance', {
      params: { baseCurrency }
    })
  }

  public getLastSevenDaysReport(
    transactionReportDto: ITransactionReport
  ): Promise<IApiResponse<ILastSevenDaysReport>> {
    return httpRequest.get('/transactions/stats/last-seven-days', {
      params: transactionReportDto
    })
  }
}
