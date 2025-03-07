import request from '@/config/axios'
import qs from 'qs'

export interface NotifyMessageVO {
  id: number
  userId: number
  userType: number
  templateId: number
  templateCode: string
  templateNickname: string
  templateContent: string
  templateType: number
  templateParams: string
  readStatus: boolean
  readTime: Date
  createTime: Date
}

// Query the list of messages in the internal message system
export const getNotifyMessagePage = async (params: PageParam) => {
  return await request.get({ url: '/system/notify-message/page', params })
}

// Get my internal message page
export const getMyNotifyMessagePage = async (params: PageParam) => {
  return await request.get({ url: '/system/notify-message/my-page', params })
}

// Batch mark read
export const updateNotifyMessageRead = async (ids) => {
  return await request.put({
    url: '/system/notify-message/update-read?' + qs.stringify({ ids: ids }, { indices: false })
  })
}

// Mark all internal messages as read
export const updateAllNotifyMessageRead = async () => {
  return await request.put({ url: '/system/notify-message/update-all-read' })
}

// Get the latest internal message list of the current user
export const getUnreadNotifyMessageList = async () => {
  return await request.get({ url: '/system/notify-message/get-unread-list' })
}

// Get the number of unread internal messages for the current user
export const getUnreadNotifyMessageCount = async () => {
  return await request.get({ url: '/system/notify-message/get-unread-count' })
}
