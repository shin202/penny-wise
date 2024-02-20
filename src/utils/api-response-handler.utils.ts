import type { IApiResponse, IResponse } from '@/common/interfaces'

export class ApiResponseHandlerUtils {
  public static errorHandler = (
    e: any,
    defaultMessage: string = 'Something went wrong. Please try again later.'
  ): IResponse<any> => {
    const err = <IApiResponse<any>>e
    return {
      isSuccess: false,
      errors:
        err.statusCode === 400
          ? (err.message as unknown as { property: string; message: string }[])
          : [],
      message: defaultMessage
    }
  }

  public static successHandler = <T>(message: string, data?: T): IResponse<T> => {
    return {
      isSuccess: true,
      message: message,
      data: data
    }
  }
}
