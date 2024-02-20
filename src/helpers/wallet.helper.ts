import { computed, onBeforeMount, reactive, ref } from 'vue'
import { CreateWalletSchema, UpdateWalletSchema } from '@/common/schemas'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useWallet } from '@/stores/wallet.store'

export const useWalletHelper = (formType: 'create' | 'update', walletId?: number) => {
  const { createWallet, updateWallet } = useWallet()

  const isSubmitting = ref<boolean>(false)
  const errorMessages = ref()

  const schema = computed(() => {
    return formType === 'create' ? CreateWalletSchema : UpdateWalletSchema
  })
  const validationSchema = toTypedSchema(schema.value)

  const { handleSubmit, handleReset, errors, defineField } = useForm({
    validationSchema
  })

  const validationErrors = computed(() => {
    return {
      name: errors.value.name || errorMessages.value.name,
      balance: errors.value.balance || errorMessages.value.balance,
      currency: errors.value.currencyCode || errorMessages.value.currencyCode,
      imageName: errors.value.imageName || errorMessages.value.imageName
    }
  })

  const [name, nameAttrs] = defineField('name')
  const [balance, balanceAttrs] = defineField('balance')
  const [description, descriptionAttrs] = defineField('description')
  const [currencyCode, currencyCodeAttrs] = defineField('currencyCode')
  const [imageName, imageNameAttrs] = defineField('imageName')

  const formValues = reactive({
    name,
    nameAttrs,
    balance,
    balanceAttrs,
    description,
    descriptionAttrs,
    currencyCode,
    currencyCodeAttrs,
    imageName,
    imageNameAttrs
  })

  const setSubmitting = (value: boolean) => (isSubmitting.value = value)

  const initErrorMessages = () => {
    errorMessages.value = {
      name: '',
      balance: '',
      currencyCode: '',
      imageName: ''
    }
  }

  initErrorMessages()

  const setErrorMessage = (field: string, message: string) => (errorMessages.value[field] = message)

  const resultHandler = (result: any) => {
    if (result.isSuccess) return

    if (result.errors) {
      result.errors.forEach((err: any) => {
        setErrorMessage(err.property, err.message)
      })
    }
  }

  const createWalletHandler = async (formValues: any) => {
    const result = await createWallet(formValues)
    resultHandler(result)
  }

  const updateWalletHandler = async (formValues: any) => {
    const result = await updateWallet(walletId!, formValues)
    resultHandler(result)
  }

  const upsertWalletHandler = async (formValues: any) => {
    const isCreate = formType === 'create'
    const isUpdate = formType === 'update'

    isCreate && (await createWalletHandler(formValues))
    isUpdate && (await updateWalletHandler(formValues))
  }

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitting(true)
    await upsertWalletHandler(formValues)
    setSubmitting(false)
    onReset()
  })

  const onReset = () => {
    handleReset()
    initErrorMessages()
  }

  onBeforeMount(() => {
    initErrorMessages()
  })

  return {
    isSubmitting,
    formValues,
    validationErrors,
    onSubmit,
    onReset
  }
}
