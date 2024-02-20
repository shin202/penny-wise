import { number, object, string, type TypeOf } from 'zod'

export const CreateWalletSchema = object({
  name: string({
    required_error: 'Name is required'
  }),
  balance: number({
    required_error: 'Balance is required'
  }).transform((val) => val.toString()),
  description: string().optional().nullable(),
  currencyCode: object(
    {
      code: string()
    },
    {
      required_error: 'Currency is required'
    }
  ).transform((value) => value.code),
  imageName: string({
    required_error: 'Image is required'
  })
})

export type CreateWalletDto = TypeOf<typeof CreateWalletSchema>
