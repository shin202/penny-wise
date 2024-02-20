import { date, number, object, string, type TypeOf } from 'zod'

export const CreateTransactionSchema = object({
  walletId: object(
    {
      id: number()
    },
    {
      required_error: 'Wallet is required'
    }
  ).transform((data) => data.id),
  currencyId: object(
    {
      id: number()
    },
    {
      required_error: 'Currency is required'
    }
  ).transform((data) => data.id),
  categoryId: object(
    {
      id: number()
    },
    {
      required_error: 'Category is required'
    }
  ).transform((data) => data.id),
  amount: number({
    required_error: 'Amount is required'
  }).transform((data) => data.toString()),
  notes: string().nullable().optional(),
  transactionDate: date({
    required_error: 'Transaction date is required'
  }).transform((data) => data.toISOString()),
  imageNames: string().array().nullable().optional()
})

export type CreateTransactionDto = TypeOf<typeof CreateTransactionSchema>
