import { CreateCategorySchema } from '@/common/schemas/category/create-category.schema'
import type { TypeOf } from 'zod'

export const UpdateCategorySchema = CreateCategorySchema.partial()

export type UpdateCategoryDto = TypeOf<typeof UpdateCategorySchema>
