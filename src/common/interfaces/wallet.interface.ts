export interface IWallet {
  id: number
  name: string
  balance: number
  status: string
  description?: string
  currency: {
    name: string
    symbol: string
    code: string
  }
  image: {
    name: string
  }
  createdAt: string | Date
  updatedAt: string | Date
}
