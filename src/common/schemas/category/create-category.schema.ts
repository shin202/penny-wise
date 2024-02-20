import { nativeEnum, number, object, string, type TypeOf } from 'zod'
import { CategoryType } from '@/common/constants'

export const CreateCategorySchema = object({
  name: string({
    required_error: 'Name is required'
  }),
  description: string().nullable().optional(),
  type: nativeEnum(CategoryType, {
    required_error: 'Type is required'
  }),
  parentId: object({
    id: number()
  })
    .nullable()
    .optional()
    .transform((value) => value?.id),
  imageName: string({
    required_error: 'Image name is required'
  })
})

export type CreateCategoryDto = TypeOf<typeof CreateCategorySchema>
