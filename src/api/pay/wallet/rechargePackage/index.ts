import request from '@/config/axios'

export interface WalletRechargePackageVO {
  id: number
  name: string
  payPrice: number
  bonusPrice: number
  status: number
}

// Query the recharge list of packages
export const getWalletRechargePackagePage = async (params) => {
  return await request.get({ url: '/pay/wallet-recharge-package/page', params })
}

// Query package recharge details
export const getWalletRechargePackage = async (id: number) => {
  return await request.get({ url: '/pay/wallet-recharge-package/get?id=' + id })
}

// New package recharge
export const createWalletRechargePackage = async (data: WalletRechargePackageVO) => {
  return await request.post({ url: '/pay/wallet-recharge-package/create', data })
}

// Modify package recharge
export const updateWalletRechargePackage = async (data: WalletRechargePackageVO) => {
  return await request.put({ url: '/pay/wallet-recharge-package/update', data })
}

// Delete package recharge
export const deleteWalletRechargePackage = async (id: number) => {
  return await request.delete({ url: '/pay/wallet-recharge-package/delete?id=' + id })
}
