import request from '@/config/axios'

export interface SmsLogVO {
  id: number | null
  channelId: number | null
  channelCode: string
  templateId: number | null
  templateCode: string
  templateType: number | null
  templateContent: string
  templateParams: Map<string, object> | null
  apiTemplateId: string
  mobile: string
  userId: number | null
  userType: number | null
  sendStatus: number | null
  sendTime: Date | null
  apiSendCode: string
  apiSendMsg: string
  apiRequestId: string
  apiSerialNo: string
  receiveStatus: number | null
  receiveTime: Date | null
  apiReceiveCode: string
  apiReceiveMsg: string
  createTime: Date | null
}

// Query SMS log list
export const getSmsLogPage = (params: PageParam) => {
  return request.get({ url: '/system/sms-log/page', params })
}

// Export SMS logs
export const exportSmsLog = (params) => {
  return request.download({ url: '/system/sms-log/export-excel', params })
}
