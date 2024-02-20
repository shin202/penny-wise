import { object, string, type TypeOf } from 'zod'

export const CreateUserSchema = object({
  username: string({
    required_error: 'Username is required'
  }).refine((data) => data.length >= 4 && data.length <= 20, {
    message: 'Username must be between 4 and 20 characters long'
  }),
  email: string({
    required_error: 'Email is required'
  }).email({
    message: 'Email is invalid'
  }),
  password: string({
    required_error: 'Password is required'
  }).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*.,])[A-Za-z0-9!@#$%^&*.,]{8,}$/, {
    message:
      'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
  }),
  passwordConfirmation: string({
    required_error: 'Password confirmation is required'
  })
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords must match'
})

export type CreateUserDto = TypeOf<typeof CreateUserSchema>
