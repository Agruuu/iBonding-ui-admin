import request from '@/config/axios'

/** User wallet query parameters */
export interface PayWalletUserReqVO {
  userId: number
}

/** wallet VO */
export interface WalletVO {
  id: number
  userId: number
  userType: number
  balance: number
  totalExpense: number
  totalRecharge: number
  freezePrice: number
}

/** Query user wallet details */
export const getWallet = async (params: PayWalletUserReqVO) => {
  return await request.get<WalletVO>({ url: `/pay/wallet/get`, params })
}

/** Search for member wallet list */
export const getWalletPage = async (params: any) => {
  return await request.get({ url: `/pay/wallet/page`, params })
}

/** Modify member wallet balance */
export const updateWalletBalance = async (data: any) => {
  return await request.put({ url: `/pay/wallet/update-balance`, data })
}
