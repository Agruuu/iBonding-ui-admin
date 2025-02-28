import request from '@/config/axios'

export interface NoticeVO {
  id: number | undefined
  title: string
  type: number
  content: string
  status: number
  remark: string
  creator: string
  createTime: Date
}

// Search announcement list
export const getNoticePage = (params: PageParam) => {
  return request.get({ url: '/system/notice/page', params })
}

// Query announcement details
export const getNotice = (id: number) => {
  return request.get({ url: '/system/notice/get?id=' + id })
}

// New Announcement
export const createNotice = (data: NoticeVO) => {
  return request.post({ url: '/system/notice/create', data })
}

// Revise Announcement
export const updateNotice = (data: NoticeVO) => {
  return request.put({ url: '/system/notice/update', data })
}

// Delete Announcement
export const deleteNotice = (id: number) => {
  return request.delete({ url: '/system/notice/delete?id=' + id })
}

// Push Announcement
export const pushNotice = (id: number) => {
  return request.post({ url: '/system/notice/push?id=' + id })
}
