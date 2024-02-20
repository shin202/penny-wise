import { httpRequest } from '@/utils'
import type { CreateUserDto, LoginCredentialsDto } from 'src/common/schemas'
import type { IApiResponse, IToken } from '@/common/interfaces'

export class AuthService {
  static async login(loginCredentials: LoginCredentialsDto): Promise<IApiResponse<IToken>> {
    return await httpRequest.post('/auth/login', loginCredentials)
  }

  static async logout(accessToken: string) {
    const { data } = await httpRequest.get('/auth/logout', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return data
  }

  static async register(createUserDto: CreateUserDto): Promise<IApiResponse<null>> {
    return await httpRequest.post('/auth/register', createUserDto)
  }
}
