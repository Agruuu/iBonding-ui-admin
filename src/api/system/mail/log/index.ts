import request from '@/config/axios'

export interface MailLogVO {
  id: number
  userId: number
  userType: number
  toMail: string
  accountId: number
  fromMail: string
  templateId: number
  templateCode: string
  templateNickname: string
  templateTitle: string
  templateContent: string
  templateParams: string
  sendStatus: number
  sendTime: Date
  sendMessageId: string
  sendException: string
}

// Query email log list
export const getMailLogPage = async (params: PageParam) => {
  return await request.get({ url: '/system/mail-log/page', params })
}

// Query email log details
export const getMailLog = async (id: number) => {
  return await request.get({ url: '/system/mail-log/get?id=' + id })
}
