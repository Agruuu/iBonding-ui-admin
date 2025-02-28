import request from '@/config/axios'

export interface SmsTemplateVO {
  id?: number
  type?: number
  status: number
  code: string
  name: string
  content: string
  remark: string
  apiTemplateId: string
  channelId?: number
  channelCode?: string
  params?: string[]
  createTime?: Date
}

export interface SendSmsReqVO {
  mobile: string
  templateCode: string
  templateParams: Map<String, Object>
}

// Query SMS template list
export const getSmsTemplatePage = (params: PageParam) => {
  return request.get({ url: '/system/sms-template/page', params })
}

// Query SMS template details
export const getSmsTemplate = (id: number) => {
  return request.get({ url: '/system/sms-template/get?id=' + id })
}

// Add SMS template
export const createSmsTemplate = (data: SmsTemplateVO) => {
  return request.post({ url: '/system/sms-template/create', data })
}

// Modify SMS template
export const updateSmsTemplate = (data: SmsTemplateVO) => {
  return request.put({ url: '/system/sms-template/update', data })
}

// Delete SMS template
export const deleteSmsTemplate = (id: number) => {
  return request.delete({ url: '/system/sms-template/delete?id=' + id })
}

// Export SMS template
export const exportSmsTemplate = (params) => {
  return request.download({
    url: '/system/sms-template/export-excel',
    params
  })
}

// Send SMS
export const sendSms = (data: SendSmsReqVO) => {
  return request.post({ url: '/system/sms-template/send-sms', data })
}
