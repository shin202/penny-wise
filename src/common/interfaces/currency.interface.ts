export interface ICurrency {
  id: number
  name: string
  symbol: string
  code: string
  decimalDigits: number
  rounding: number
  namePlural: string
  createdAt: Date | string
  updatedAt: Date | string
}
