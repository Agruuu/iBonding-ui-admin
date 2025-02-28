import request from '@/config/axios'

export interface SmsChannelVO {
  id: number
  code: string
  status: number
  signature: string
  remark: string
  apiKey: string
  apiSecret: string
  callbackUrl: string
  createTime: Date
}

// Query the list of SMS channels
export const getSmsChannelPage = (params: PageParam) => {
  return request.get({ url: '/system/sms-channel/page', params })
}

// Get a streamlined list of SMS channels
export function getSimpleSmsChannelList() {
  return request.get({ url: '/system/sms-channel/simple-list' })
}

// Query SMS channel details
export const getSmsChannel = (id: number) => {
  return request.get({ url: '/system/sms-channel/get?id=' + id })
}

// Add SMS channel
export const createSmsChannel = (data: SmsChannelVO) => {
  return request.post({ url: '/system/sms-channel/create', data })
}

// Modify SMS channel
export const updateSmsChannel = (data: SmsChannelVO) => {
  return request.put({ url: '/system/sms-channel/update', data })
}

// Delete SMS channel
export const deleteSmsChannel = (id: number) => {
  return request.delete({ url: '/system/sms-channel/delete?id=' + id })
}
