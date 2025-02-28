import request from '@/config/axios'

export interface ChannelVO {
  id: number
  code: string
  config: string
  status: number
  remark: string
  feeRate: number
  appId: number
  createTime: Date
}

// Query list of payment channels
export const getChannelPage = (params: PageParam) => {
  return request.get({ url: '/pay/channel/page', params })
}

// Search for details and payment channels
export const getChannel = (appId: string, code: string) => {
  const params = {
    appId: appId,
    code: code
  }
  return request.get({ url: '/pay/channel/get', params: params })
}

// Add new payment channels
export const createChannel = (data: ChannelVO) => {
  return request.post({ url: '/pay/channel/create', data })
}

// Modify payment channel
export const updateChannel = (data: ChannelVO) => {
  return request.put({ url: '/pay/channel/update', data })
}

// Delete payment channel
export const deleteChannel = (id: number) => {
  return request.delete({ url: '/pay/channel/delete?id=' + id })
}

// Export payment channels
export const exportChannel = (params) => {
  return request.download({ url: '/pay/channel/export-excel', params })
}
