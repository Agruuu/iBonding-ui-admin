import request from '@/config/axios'

export interface TransferVO {
  appId: number
  channelCode: string
  merchantTransferId: string
  type: number
  price: number
  subject: string
  userName: string
  alipayLogonId: string
  openid: string
}

// Add transfer order
export const createTransfer = async (data: TransferVO) => {
  return await request.post({ url: `/pay/transfer/create`, data })
}

// Query the list of transfer orders
export const getTransferPage = async (params) => {
  return await request.get({ url: `/pay/transfer/page`, params })
}

export const getTransfer = async (id: number) => {
  return await request.get({ url: '/pay/transfer/get?id=' + id })
}
