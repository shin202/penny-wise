import { CreateWalletSchema } from '@/common/schemas/wallet/create-wallet.schema'
import type { TypeOf } from 'zod'

export const UpdateWalletSchema = CreateWalletSchema.partial()

export type UpdateWalletDto = TypeOf<typeof UpdateWalletSchema>
