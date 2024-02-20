import { computed, onBeforeMount, reactive, ref } from 'vue'
import { CreateTransactionSchema, UpdateTransactionSchema } from '@/common/schemas'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import dayjs from 'dayjs'
import { useExpense } from '@/stores/expense.store'
import { useIncome } from '@/stores/income.store'

export const useTransactionHelper = (
  formType: 'create' | 'update',
  transactionType: 'expense' | 'income',
  transactionId?: number
) => {
  const { createExpense, updateExpense } = useExpense()
  const { createIncome, updateIncome } = useIncome()
  const isSubmitting = ref<boolean>(false)
  const errorMessages = ref()

  const schema = computed(() => {
    return formType === 'create' ? CreateTransactionSchema : UpdateTransactionSchema
  })
  const validationSchema = toTypedSchema(schema.value)

  const { handleSubmit, handleReset, errors, defineField } = useForm({
    validationSchema,
    initialValues: {
      transactionDate: dayjs().toDate()
    }
  })

  const validationErrors = computed(() => {
    return {
      walletId: errors.value.walletId || errorMessages.value.walletId,
      currencyId: errors.value.currencyId || errorMessages.value.currencyId,
      categoryId: errors.value.categoryId || errorMessages.value.categoryId,
      amount: errors.value.amount || errorMessages.value.amount,
      transactionDate: errors.value.transactionDate || errorMessages.value.transactionDate,
      notes: errors.value.notes || errorMessages.value.notes,
      imageNames: errors.value.imageNames || errorMessages.value.imageNames
    }
  })

  const [walletId, walletIdAttrs] = defineField('walletId')
  const [currencyId, currencyIdAttrs] = defineField('currencyId')
  const [categoryId, categoryIdAttrs] = defineField('categoryId')
  const [amount, amountAttrs] = defineField('amount')
  const [transactionDate, transactionDateAttrs] = defineField('transactionDate')
  const [notes, notesAttrs] = defineField('notes')
  const [imageNames, imageNamesAttrs] = defineField('imageNames')

  const formValues = reactive({
    walletId,
    walletIdAttrs,
    currencyId,
    currencyIdAttrs,
    categoryId,
    categoryIdAttrs,
    amount,
    amountAttrs,
    transactionDate,
    transactionDateAttrs,
    notes,
    notesAttrs,
    imageNames,
    imageNamesAttrs
  })

  const setSubmitting = (value: boolean) => (isSubmitting.value = value)

  const initErrorMessages = () => {
    errorMessages.value = {
      walletId: '',
      currencyId: '',
      categoryId: '',
      amount: '',
      transactionDate: '',
      notes: '',
      imageNames: ''
    }
  }

  const setErrorMessage = (field: string, message: string) => (errorMessages.value[field] = message)

  const validatedErrorHandler = (result: any) => {
    if (result.isSuccess) return

    if (result.errors) {
      result.errors.forEach((err: any) => {
        setErrorMessage(err.property, err.message)
      })
    }
  }

  const createExpenseHandler = async (formValues: any) => {
    const result = await createExpense(formValues)
    validatedErrorHandler(result)
  }

  const createIncomeHandler = async (formValues: any) => {
    const result = await createIncome(formValues)
    validatedErrorHandler(result)
  }

  const updateExpenseHandler = async (formValues: any) => {
    const result = await updateExpense(transactionId!, formValues)
    validatedErrorHandler(result)
  }

  const updateIncomeHandler = async (formValues: any) => {
    const result = await updateIncome(transactionId!, formValues)
    validatedErrorHandler(result)
  }

  const upsertTransactionHandler = async (formValues: any) => {
    const isCreateExpense = formType === 'create' && transactionType === 'expense'
    const isUpdateExpense = formType === 'update' && transactionType === 'expense'
    const isCreateIncome = formType === 'create' && transactionType === 'income'
    const isUpdateIncome = formType === 'update' && transactionType === 'income'

    isCreateExpense && (await createExpenseHandler(formValues))
    isUpdateExpense && (await updateExpenseHandler(formValues))

    isCreateIncome && (await createIncomeHandler(formValues))
    isUpdateIncome && (await updateIncomeHandler(formValues))
  }

  const onSubmitHandler = handleSubmit(async (values) => {
    setSubmitting(true)
    await upsertTransactionHandler(values)
    setSubmitting(false)
    onResetHandler()
  })

  const onResetHandler = () => {
    handleReset()
    initErrorMessages()
  }

  onBeforeMount(() => {
    initErrorMessages()
  })

  return {
    isSubmitting,
    validationErrors,
    formValues,
    onSubmitHandler,
    onResetHandler
  }
}
