import request from '@/config/axios'

export interface RefundVO {
  id: number
  merchantId: number
  appId: number
  channelId: number
  channelCode: string
  orderId: string
  tradeNo: string
  merchantOrderId: string
  merchantRefundNo: string
  notifyUrl: string
  notifyStatus: number
  status: number
  type: number
  payAmount: number
  refundAmount: number
  reason: string
  userIp: string
  channelOrderNo: string
  channelRefundNo: string
  channelErrorCode: string
  channelErrorMsg: string
  channelExtras: string
  expireTime: Date
  successTime: Date
  notifyTime: Date
  createTime: Date
}

export interface RefundPageReqVO extends PageParam {
  merchantId?: number
  appId?: number
  channelId?: number
  channelCode?: string
  orderId?: string
  tradeNo?: string
  merchantOrderId?: string
  merchantRefundNo?: string
  notifyUrl?: string
  notifyStatus?: number
  status?: number
  type?: number
  payAmount?: number
  refundAmount?: number
  reason?: string
  userIp?: string
  channelOrderNo?: string
  channelRefundNo?: string
  channelErrorCode?: string
  channelErrorMsg?: string
  channelExtras?: string
  expireTime?: Date[]
  successTime?: Date[]
  notifyTime?: Date[]
  createTime?: Date[]
}

export interface PayRefundExportReqVO {
  merchantId?: number
  appId?: number
  channelId?: number
  channelCode?: string
  orderId?: string
  tradeNo?: string
  merchantOrderId?: string
  merchantRefundNo?: string
  notifyUrl?: string
  notifyStatus?: number
  status?: number
  type?: number
  payAmount?: number
  refundAmount?: number
  reason?: string
  userIp?: string
  channelOrderNo?: string
  channelRefundNo?: string
  channelErrorCode?: string
  channelErrorMsg?: string
  channelExtras?: string
  expireTime?: Date[]
  successTime?: Date[]
  notifyTime?: Date[]
  createTime?: Date[]
}

// Query List Refund Orders
export const getRefundPage = (params: RefundPageReqVO) => {
  return request.get({ url: '/pay/refund/page', params })
}

// Query Details Refund Order
export const getRefund = (id: number) => {
  return request.get({ url: '/pay/refund/get?id=' + id })
}

// Add refund order
export const createRefund = (data: RefundVO) => {
  return request.post({ url: '/pay/refund/create', data })
}

// Modify refund order
export const updateRefund = (data: RefundVO) => {
  return request.put({ url: '/pay/refund/update', data })
}

// Delete refund order
export const deleteRefund = (id: number) => {
  return request.delete({ url: '/pay/refund/delete?id=' + id })
}

// Export refund order
export const exportRefund = (params: PayRefundExportReqVO) => {
  return request.download({ url: '/pay/refund/export-excel', params })
}
