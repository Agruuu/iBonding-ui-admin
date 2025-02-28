import request from '@/config/axios'

export interface MailTemplateVO {
  id: number
  name: string
  code: string
  accountId: number
  nickname: string
  title: string
  content: string
  params: string
  status: number
  remark: string
}

export interface MailSendReqVO {
  mail: string
  templateCode: string
  templateParams: Map<String, Object>
}

// Query email template list
export const getMailTemplatePage = async (params: PageParam) => {
  return await request.get({ url: '/system/mail-template/page', params })
}

// Query email template details
export const getMailTemplate = async (id: number) => {
  return await request.get({ url: '/system/mail-template/get?id=' + id })
}

// Add email template
export const createMailTemplate = async (data: MailTemplateVO) => {
  return await request.post({ url: '/system/mail-template/create', data })
}

// Modify email template
export const updateMailTemplate = async (data: MailTemplateVO) => {
  return await request.put({ url: '/system/mail-template/update', data })
}

// Delete email template
export const deleteMailTemplate = async (id: number) => {
  return await request.delete({ url: '/system/mail-template/delete?id=' + id })
}

// Send an email
export const sendMail = (data: MailSendReqVO) => {
  return request.post({ url: '/system/mail-template/send-mail', data })
}
