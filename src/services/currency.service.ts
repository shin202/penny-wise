import { httpRequest } from '@/utils'
import type { CreateCurrencyDto, UpdateCurrencyDto } from 'src/common/schemas'
import type { IApiResponse, ICurrency } from '@/common/interfaces'

export class CurrencyService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  public create(createCurrencyDto: CreateCurrencyDto): Promise<IApiResponse<ICurrency>> {
    return httpRequest.post('/currencies', createCurrencyDto, {
      cache: {
        update: {
          'list-currencies': 'delete'
        }
      }
    })
  }

  public findAll(): Promise<IApiResponse<ICurrency[]>> {
    return httpRequest.get('/currencies', {
      id: 'list-currencies'
    })
  }

  public findOne(id: number): Promise<IApiResponse<ICurrency>> {
    return httpRequest.get(`/currencies/${id}`)
  }

  public update(id: number, updateCurrencyDto: UpdateCurrencyDto): Promise<IApiResponse<null>> {
    return httpRequest.patch(`/currencies/${id}`, updateCurrencyDto, {
      cache: {
        update: {
          'list-currencies': 'delete'
        }
      }
    })
  }

  public delete(id: number): Promise<IApiResponse<null>> {
    return httpRequest.delete(`/currencies/${id}`, {
      cache: {
        update: {
          'list-currencies': 'delete'
        }
      }
    })
  }
}
