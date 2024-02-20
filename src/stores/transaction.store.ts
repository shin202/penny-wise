import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useAuth } from '@/stores/auth.store'
import type { IFindTransaction, IPageMeta, ITransaction } from '@/common/interfaces'
import { TransactionService } from '@/services/transaction.service'
import { ApiResponseHandlerUtils } from '@/utils'

export const useTransaction = defineStore('transaction', () => {
  const auth = useAuth()
  const transactionService = new TransactionService(auth.accessToken)
  const transactionWithPagination = reactive<{ transactions: ITransaction[]; meta?: IPageMeta }>({
    transactions: []
  })

  const setTransactions = (data: ITransaction[]) => (transactionWithPagination.transactions = data)

  const setPageMeta = (data: IPageMeta) => (transactionWithPagination.meta = data)

  const loadTransactions = async (params: IFindTransaction, clearCache?: boolean) => {
    try {
      const {
        data: { transactions, meta },
        message
      } = await transactionService.findAll(params, clearCache)
      setTransactions(transactions)
      setPageMeta(meta)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to load transactions. Please try again later.'
      )
    }
  }

  return {
    transactionWithPagination,
    loadTransactions
  }
})
