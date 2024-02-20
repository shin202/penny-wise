import { number, object, string, type TypeOf } from 'zod'

export const CreateCurrencySchema = object({
  name: string({
    required_error: 'Name is required'
  }),
  symbol: string({
    required_error: 'Symbol is required'
  }).refine((value) => value.length >= 1 && value.length <= 5, {
    message: 'Symbol must be between 1 and 5 characters'
  }),
  code: string({
    required_error: 'Code is required'
  }).refine((value) => value.length === 3, {
    message: 'Code must be 3 characters'
  }),
  decimalDigits: number({
    required_error: 'Decimal digits is required'
  }),
  rounding: number({
    required_error: 'Rounding is required'
  }),
  namePlural: string({
    required_error: 'Name plural is required'
  })
})

export type CreateCurrencyDto = TypeOf<typeof CreateCurrencySchema>
