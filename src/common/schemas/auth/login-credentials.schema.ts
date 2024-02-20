import { object, string, type TypeOf } from 'zod'

export const LoginCredentialsSchema = object({
  usernameOrEmail: string({
    required_error: 'Username or email is required'
  }),
  password: string({
    required_error: 'Password is required'
  })
})

export type LoginCredentialsDto = TypeOf<typeof LoginCredentialsSchema>
