import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth.store'
import { IncomeService } from '@/services/income.service'
import { ApiResponseHandlerUtils } from '@/utils'
import { useGlobal } from '@/stores/global.store'
import { ref } from 'vue'
import type { IIncome } from '@/common/interfaces'
import type { CreateTransactionDto, UpdateTransactionDto } from '@/common/schemas'

export const useIncome = defineStore('income', () => {
  const { showToastSuccess, showToastError, showConfirmDialog } = useGlobal()
  const auth = useAuth()
  const incomeService = new IncomeService(auth.accessToken)
  const incomeDetails = ref<IIncome>()

  const setIncomeDetails = (income: IIncome) => (incomeDetails.value = income)

  const loadIncome = async (id: number) => {
    try {
      const { data, message } = await incomeService.findOne(id)
      setIncomeDetails(data)
      showToastSuccess(message)
    } catch (e) {
      showToastError('Failed to load income. Please try again later.')
    }
  }

  const createIncome = async (createIncomeDto: CreateTransactionDto) => {
    try {
      const { message } = await incomeService.create(createIncomeDto)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to create income. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const updateIncome = async (id: number, updateIncomeDto: UpdateTransactionDto) => {
    try {
      const { message } = await incomeService.update(id, updateIncomeDto)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to update income. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const deleteIncome = async (id: number) => {
    showConfirmDialog({
      message: 'This will permanently delete the income. You cannot undo this action.',
      header: 'Delete Income?',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      accept: () => onAcceptDeleteIncome(id)
    })
  }

  const onAcceptDeleteIncome = async (id: number) => {
    try {
      const { message } = await incomeService.delete(id)
      showToastSuccess(message)
    } catch (e) {
      showToastError('Failed to delete income. Please try again later.')
    }
  }

  return {
    incomeDetails,
    loadIncome,
    createIncome,
    updateIncome,
    deleteIncome
  }
})
