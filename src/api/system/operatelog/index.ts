import request from '@/config/axios'

export type OperateLogVO = {
  id: number
  traceId: string
  userType: number
  userId: number
  userName: string
  type: string
  subType: string
  bizId: number
  action: string
  extra: string
  requestMethod: string
  requestUrl: string
  userIp: string
  userAgent: string
  creator: string
  creatorName: string
  createTime: Date
}

// Query operation log list
export const getOperateLogPage = (params: PageParam) => {
  return request.get({ url: '/system/operate-log/page', params })
}
// Export operation log
export const exportOperateLog = (params: any) => {
  return request.download({ url: '/system/operate-log/export', params })
}
