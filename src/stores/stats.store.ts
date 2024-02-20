import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth.store'
import { StatsService } from '@/services/stats.service'
import { ref } from 'vue'
import { useSettings } from '@/stores/settings.store'
import type {
  ILastSevenDaysReport,
  ISummaryStats,
  ITotalBalanceStats,
  ITransactionReport
} from '@/common/interfaces'
import { TransactionType } from '@/common/constants'

export const useStats = defineStore('stats', () => {
  const auth = useAuth()
  const settings = useSettings()
  const statsService = new StatsService(auth.accessToken)
  const summaryStats = ref<ISummaryStats>({
    transactionCount: 0,
    expenseTransaction: {
      totalAmount: 0,
      currencyCode: settings.baseCurrency
    },
    incomeTransaction: {
      totalAmount: 0,
      currencyCode: settings.baseCurrency
    },
    totalTransactionsByType: []
  })
  const totalBalanceStats = ref<ITotalBalanceStats>({
    currencyCode: settings.baseCurrency,
    totalBalance: 0
  })
  const lastSevenDaysExpense = ref<ILastSevenDaysReport>({
    amountByCategory: [],
    amountByDate: []
  })
  const lastSevenDaysIncome = ref<ILastSevenDaysReport>({
    amountByCategory: [],
    amountByDate: []
  })

  const setSummaryStats = (data: ISummaryStats) => {
    summaryStats.value = data
  }

  const setLastSevenDaysExpense = (data: ILastSevenDaysReport) => {
    lastSevenDaysExpense.value = data
  }

  const setLastSevenDaysIncome = (data: ILastSevenDaysReport) => {
    lastSevenDaysIncome.value = data
  }

  const loadSummaryStats = async () => {
    const { data } = await statsService.getSummaryStats(settings.baseCurrency)
    setSummaryStats(data)
  }

  const loadTotalBalanceStats = async () => {
    const { data } = await statsService.getTotalBalanceStats(settings.baseCurrency)
    totalBalanceStats.value = data
  }

  const loadLastSevenDaysExpense = async (transactionReportDto: ITransactionReport) => {
    const { data } = await statsService.getLastSevenDaysReport({
      ...transactionReportDto,
      transactionType: TransactionType.EXPENSE,
      baseCurrency: settings.baseCurrency
    })
    setLastSevenDaysExpense(data)
  }

  const loadLastSevenDaysIncome = async (transactionReportDto: ITransactionReport) => {
    const { data } = await statsService.getLastSevenDaysReport({
      ...transactionReportDto,
      transactionType: TransactionType.INCOME,
      baseCurrency: settings.baseCurrency
    })
    setLastSevenDaysIncome(data)
  }

  return {
    summaryStats,
    totalBalanceStats,
    lastSevenDaysExpense,
    lastSevenDaysIncome,
    loadSummaryStats,
    loadTotalBalanceStats,
    loadLastSevenDaysExpense,
    loadLastSevenDaysIncome
  }
})
