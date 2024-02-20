import { httpRequest } from '@/utils'
import type { CreateTransactionDto, UpdateTransactionDto } from 'src/common/schemas'
import type { IApiResponse, IIncome } from '@/common/interfaces'

export class IncomeService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  public create(createIncomeDto: CreateTransactionDto): Promise<IApiResponse<IIncome>> {
    return httpRequest.post('/incomes', createIncomeDto)
  }

  public findOne(id: number): Promise<IApiResponse<IIncome>> {
    return httpRequest.get(`/incomes/${id}`)
  }

  public update(id: number, updateIncomeDto: UpdateTransactionDto): Promise<IApiResponse<null>> {
    return httpRequest.patch(`/incomes/${id}`, updateIncomeDto)
  }

  public delete(id: number): Promise<IApiResponse<null>> {
    return httpRequest.delete(`/incomes/${id}`)
  }
}
