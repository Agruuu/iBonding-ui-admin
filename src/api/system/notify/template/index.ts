import request from '@/config/axios'

export interface NotifyTemplateVO {
  id?: number
  name: string
  nickname: string
  code: string
  content: string
  type?: number
  params: string
  status: number
  remark: string
}

export interface NotifySendReqVO {
  userId: number | null
  templateCode: string
  templateParams: Map<String, Object>
}

// Query the list of internal message templates
export const getNotifyTemplatePage = async (params: PageParam) => {
  return await request.get({ url: '/system/notify-template/page', params })
}

// Query the details of the internal message template
export const getNotifyTemplate = async (id: number) => {
  return await request.get({ url: '/system/notify-template/get?id=' + id })
}

// Add internal message template
export const createNotifyTemplate = async (data: NotifyTemplateVO) => {
  return await request.post({ url: '/system/notify-template/create', data })
}

// Modify the internal message template
export const updateNotifyTemplate = async (data: NotifyTemplateVO) => {
  return await request.put({ url: '/system/notify-template/update', data })
}

// Delete internal message template
export const deleteNotifyTemplate = async (id: number) => {
  return await request.delete({ url: '/system/notify-template/delete?id=' + id })
}

// Send an internal message
export const sendNotify = (data: NotifySendReqVO) => {
  return request.post({ url: '/system/notify-template/send-notify', data })
}
