import { httpRequest } from '@/utils'
import type { CreateWalletDto, UpdateWalletDto } from 'src/common/schemas'
import type { IApiResponse, IWallet } from '@/common/interfaces'

export class WalletService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  }

  public create = (createWalletDto: CreateWalletDto): Promise<IApiResponse<IWallet>> => {
    return httpRequest.post('/wallets', createWalletDto, {
      cache: {
        update: {
          'list-wallets': 'delete'
        }
      }
    })
  }

  public findAll = (): Promise<IApiResponse<IWallet[]>> => {
    return httpRequest.get('/wallets', {
      id: 'list-wallets'
    })
  }

  public findOne = (id: number): Promise<IApiResponse<IWallet>> => {
    return httpRequest.get(`/wallets/${id}`)
  }

  public update = (id: number, updateWalletDto: UpdateWalletDto): Promise<IApiResponse<null>> => {
    return httpRequest.patch(`/wallets/${id}`, updateWalletDto, {
      cache: {
        update: {
          'list-wallets': 'delete'
        }
      }
    })
  }

  public delete = (id: number): Promise<IApiResponse<null>> => {
    return httpRequest.delete(`/wallets/${id}`, {
      cache: {
        update: {
          'list-wallets': 'delete'
        }
      }
    })
  }

  public uploadImage = (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    return httpRequest.post('/wallets/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
