import { CategoryType } from '@/common/constants'

export interface ICategory {
  id: number
  name: string
  description?: string
  type: CategoryType
  parent?: {
    id: number
    name: string
  }
  image: {
    name: string
  }
  createdAt: Date | string
  updatedAt: Date | string
  children?: ICategory[]
}
