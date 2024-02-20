import { httpRequest } from '@/utils'
import type { IApiResponse, IImage } from '@/common/interfaces'

export class ImageService {
  constructor(accessToken: string) {
    httpRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  public upload(images: File[]): Promise<IApiResponse<IImage[]>> {
    const formData = new FormData()
    images.forEach((img) => formData.append('images', img))
    return httpRequest.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      cache: {
        update: {
          'list-icons': 'delete'
        }
      }
    })
  }

  public findAllIcons(): Promise<IApiResponse<IImage[]>> {
    return httpRequest.get('/images/icons', {
      id: 'list-icons'
    })
  }
}
