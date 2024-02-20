import { object, string, type TypeOf } from 'zod'

export const ForgotPasswordSchema = object({
  email: string({
    required_error: 'Email is required'
  }).email({
    message: 'Your email is not valid. Please try again.'
  })
})

export type ForgotPasswordDto = TypeOf<typeof ForgotPasswordSchema>
