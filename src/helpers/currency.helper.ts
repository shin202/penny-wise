import { useCurrency } from '@/stores/currency.store'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { CreateCurrencySchema, UpdateCurrencySchema } from '@/common/schemas'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

export const useCurrencyHelper = (formType: 'create' | 'update', currencyId?: number) => {
  const currency = useCurrency()
  const { createCurrency, updateCurrency } = currency
  const isSubmitting = ref<boolean>(false)
  const errorMessages = ref()

  const schema = computed(() => {
    return formType === 'create' ? CreateCurrencySchema : UpdateCurrencySchema
  })
  const validationSchema = toTypedSchema(schema.value)

  const { handleSubmit, handleReset, errors, defineField } = useForm({
    validationSchema,
    initialValues: {
      rounding: 0,
      decimalDigits: 0
    }
  })

  const validationErrors = computed(() => {
    return {
      name: errors.value.name || errorMessages.value.name,
      namePlural: errors.value.namePlural || errorMessages.value.namePlural,
      symbol: errors.value.symbol || errorMessages.value.symbol,
      code: errors.value.code || errorMessages.value.code,
      decimalDigits: errors.value.decimalDigits || errorMessages.value.decimalDigits,
      rounding: errors.value.rounding || errorMessages.value.rounding
    }
  })

  const [name, nameAttrs] = defineField('name')
  const [namePlural, namePluralAttrs] = defineField('namePlural')
  const [symbol, symbolAttrs] = defineField('symbol')
  const [code, codeAttrs] = defineField('code')
  const [decimalDigits, decimalDigitsAttrs] = defineField('decimalDigits')
  const [rounding, roundingAttrs] = defineField('rounding')

  const formValues = reactive({
    name,
    nameAttrs,
    namePlural,
    namePluralAttrs,
    symbol,
    symbolAttrs,
    code,
    codeAttrs,
    decimalDigits,
    decimalDigitsAttrs,
    rounding,
    roundingAttrs
  })

  const setSubmitting = (value: boolean) => (isSubmitting.value = value)

  const initErrorMessages = () => {
    errorMessages.value = {
      name: '',
      namePlural: '',
      symbol: '',
      code: '',
      decimalDigits: '',
      rounding: ''
    }
  }

  const setErrorMessage = (field: string, message: string) => (errorMessages.value[field] = message)

  const validateErrorHandler = (result: any) => {
    if (result.isSuccess) return

    if (result.errors) {
      result.errors.forEach((err: any) => {
        setErrorMessage(err.property, err.message)
      })
    }
  }

  const createCurrencyHandler = async (formValues: any) => {
    const result = await createCurrency(formValues)
    validateErrorHandler(result)
  }

  const updateCurrencyHandler = async (formValues: any) => {
    const result = await updateCurrency(currencyId!, formValues)
    validateErrorHandler(result)
  }

  const upsertCurrencyHandler = async (values: any) => {
    const isCreate = formType === 'create'
    const isUpdate = formType === 'update'

    isCreate && (await createCurrencyHandler(values))
    isUpdate && (await updateCurrencyHandler(values))
  }

  const onSubmitHandler = handleSubmit(async (values: any) => {
    setSubmitting(true)
    await upsertCurrencyHandler(values)
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
    formValues,
    isSubmitting,
    validationErrors,
    onSubmitHandler,
    onResetHandler
  }
}
