import { reactive, ref } from 'vue'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { usePassword } from '@/stores/password.store'
import { ForgotPasswordSchema } from '@/common/schemas'

export const useForgotPasswordHelper = () => {
  const password = usePassword()
  const { forgotPassword } = password

  const isSubmitting = ref(false)

  const validationSchema = toTypedSchema(ForgotPasswordSchema)
  const { errors, defineField, handleReset, handleSubmit } = useForm({
    validationSchema
  })
  const [email, emailAttrs] = defineField('email')

  const formValues = reactive({
    email,
    emailAttrs
  })

  const setSubmitting = (value: boolean) => (isSubmitting.value = value)

  const onSubmitHandler = handleSubmit(async (values) => {
    setSubmitting(true)
    await forgotPassword(values)
    setSubmitting(false)
    handleReset()
  })

  return {
    formValues,
    errors,
    isSubmitting,
    onSubmitHandler
  }
}
