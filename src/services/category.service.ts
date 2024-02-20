import { httpRequest } from '@/utils'
import type { CreateCategoryDto, UpdateCategoryDto } from 'src/common/schemas'
import type { IApiResponse, ICategory } from '@/common/interfaces'

export class CategoryService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  public create(createCategoryDto: CreateCategoryDto): Promise<IApiResponse<ICategory>> {
    return httpRequest.post('/categories', createCategoryDto)
  }

  public findAll(): Promise<IApiResponse<ICategory[]>> {
    return httpRequest.get('/categories')
  }

  public findOne(id: number): Promise<IApiResponse<ICategory>> {
    return httpRequest.get(`/categories/${id}`)
  }

  public update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<IApiResponse<null>> {
    return httpRequest.patch(`/categories/${id}`, updateCategoryDto)
  }

  public delete(id: number): Promise<IApiResponse<null>> {
    return httpRequest.delete(`/categories/${id}`)
  }
}
