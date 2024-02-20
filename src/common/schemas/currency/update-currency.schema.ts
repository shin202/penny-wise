import { CreateCurrencySchema } from '@/common/schemas/currency/create-currency.schema'
import type { TypeOf } from 'zod'

export const UpdateCurrencySchema = CreateCurrencySchema.partial()

export type UpdateCurrencyDto = TypeOf<typeof UpdateCurrencySchema>
