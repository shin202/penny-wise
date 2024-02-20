import { httpRequest } from '@/utils'
import type { ForgotPasswordDto } from '@/common/schemas'
import type { IApiResponse } from '@/common/interfaces'

export class PasswordService {
  static async forgot(passwordForgotDto: ForgotPasswordDto): Promise<IApiResponse<null>> {
    return httpRequest.post('/password/forgot', passwordForgotDto)
  }
}
