import { httpRequest } from '@/utils'
import type { CreateTransactionDto, UpdateTransactionDto } from 'src/common/schemas'
import type { IApiResponse, IExpense } from '@/common/interfaces'

export class ExpenseService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  public create(createExpenseDto: CreateTransactionDto): Promise<IApiResponse<IExpense>> {
    return httpRequest.post('/expenses', createExpenseDto, {
      cache: {
        update: {
          'list-transactions': 'delete'
        }
      }
    })
  }

  public findOne(id: number): Promise<IApiResponse<IExpense>> {
    return httpRequest.get(`/expenses/${id}`)
  }

  public update(id: number, updateExpenseDto: UpdateTransactionDto): Promise<IApiResponse<null>> {
    return httpRequest.patch(`/expenses/${id}`, updateExpenseDto, {
      cache: {
        update: {
          'list-transactions': 'delete'
        }
      }
    })
  }

  public delete(id: number): Promise<IApiResponse<null>> {
    return httpRequest.delete(`/expenses/${id}`, {
      cache: {
        update: {
          'list-transactions': 'delete'
        }
      }
    })
  }
}
