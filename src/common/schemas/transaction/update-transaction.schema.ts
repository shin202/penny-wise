import { CreateTransactionSchema } from '@/common/schemas/transaction/create-transaction.schema'
import type { TypeOf } from 'zod'

export const UpdateTransactionSchema = CreateTransactionSchema.partial()
export type UpdateTransactionDto = TypeOf<typeof UpdateTransactionSchema>
