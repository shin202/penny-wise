import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth.store'
import { ExpenseService } from '@/services/expense.service'
import type { IExpense } from '@/common/interfaces'
import { ref } from 'vue'
import { useGlobal } from '@/stores/global.store'
import type { CreateTransactionDto, UpdateTransactionDto } from 'src/common/schemas'
import { ApiResponseHandlerUtils } from '@/utils'

export const useExpense = defineStore('expense', () => {
  const { showToastSuccess, showToastError, showConfirmDialog } = useGlobal()
  const auth = useAuth()
  const expenseService = new ExpenseService(auth.accessToken)
  const expenseDetails = ref<IExpense>()

  const setExpenseDetails = (expense: IExpense) => (expenseDetails.value = expense)

  const loadExpense = async (id: number) => {
    try {
      const { data, message } = await expenseService.findOne(id)
      setExpenseDetails(data)
      showToastSuccess(message)
    } catch (e) {
      showToastError('Failed to load expense. Please try again later.')
    }
  }

  const createExpense = async (createTransactionDto: CreateTransactionDto) => {
    try {
      const { message } = await expenseService.create(createTransactionDto)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to create expense. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const updateExpense = async (id: number, updateTransactionDto: UpdateTransactionDto) => {
    try {
      const { message } = await expenseService.update(id, updateTransactionDto)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to update expense. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const deleteExpense = async (id: number) => {
    showConfirmDialog({
      message: 'This will permanently delete the expense. You cannot undo this action.',
      header: 'Delete Expense?',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      accept: () => onAcceptDeleteExpense(id)
    })
  }

  const onAcceptDeleteExpense = async (id: number) => {
    try {
      const { message } = await expenseService.delete(id)
      showToastSuccess(message)
    } catch (e) {
      showToastError('Failed to delete expense. Please try again later.')
    }
  }

  return {
    expenseDetails,
    loadExpense,
    createExpense,
    updateExpense,
    deleteExpense
  }
})
