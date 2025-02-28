import request from '@/config/axios'

export interface MailAccountVO {
  id: number
  mail: string
  username: string
  password: string
  host: string
  port: number
  sslEnable: boolean
  starttlsEnable: boolean
}

// Query the list of email accounts
export const getMailAccountPage = async (params: PageParam) => {
  return await request.get({ url: '/system/mail-account/page', params })
}

// Query email account details
export const getMailAccount = async (id: number) => {
  return await request.get({ url: '/system/mail-account/get?id=' + id })
}

// Add email account
export const createMailAccount = async (data: MailAccountVO) => {
  return await request.post({ url: '/system/mail-account/create', data })
}

// Modify email account
export const updateMailAccount = async (data: MailAccountVO) => {
  return await request.put({ url: '/system/mail-account/update', data })
}

// Delete email account
export const deleteMailAccount = async (id: number) => {
  return await request.delete({ url: '/system/mail-account/delete?id=' + id })
}

// Get a streamlined list of email accounts
export const getSimpleMailAccountList = async () => {
  return request.get({ url: '/system/mail-account/simple-list' })
}
