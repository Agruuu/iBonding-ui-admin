import request from '@/config/axios'

export interface LoginLogVO {
  id: number
  logType: number
  traceId: number
  userId: number
  userType: number
  username: string
  result: number
  status: number
  userIp: string
  userAgent: string
  createTime: Date
}

// Query login log list
export const getLoginLogPage = (params: PageParam) => {
  return request.get({ url: '/system/login-log/page', params })
}

// Export login logs
export const exportLoginLog = (params) => {
  return request.download({ url: '/system/login-log/export', params })
}
