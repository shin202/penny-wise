export interface IResponse<T> {
  isSuccess: boolean
  message: string
  errors?: { property: string; message: string }[]
  data?: T
}
