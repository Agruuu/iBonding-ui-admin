import request from '@/config/axios'

export interface WalletTransactionVO {
  id: number
  walletId: number
  title: string
  price: number
  balance: number
}

// Query the member wallet transaction list
export const getWalletTransactionPage = async (params) => {
  return await request.get({ url: `/pay/wallet-transaction/page`, params })
}
