import request from '@/config/axios'

export interface ApiErrorLogVO {
  id: number
  traceId: string
  userId: number
  userType: number
  applicationName: string
  requestMethod: string
  requestParams: string
  requestUrl: string
  userIp: string
  userAgent: string
  exceptionTime: Date
  exceptionName: string
  exceptionMessage: string
  exceptionRootCauseMessage: string
  exceptionStackTrace: string
  exceptionClassName: string
  exceptionFileName: string
  exceptionMethodName: string
  exceptionLineNumber: number
  processUserId: number
  processStatus: number
  processTime: Date
  resultCode: number
  createTime: Date
}

// Query ListAPI Access logs
export const getApiErrorLogPage = (params: PageParam) => {
  return request.get({ url: '/infra/api-error-log/page', params })
}

// to update API Processing status of error logs
export const updateApiErrorLogPage = (id: number, processStatus: number) => {
  return request.put({
    url: '/infra/api-error-log/update-status?id=' + id + '&processStatus=' + processStatus
  })
}

// export API Access logs
export const exportApiErrorLog = (params) => {
  return request.download({
    url: '/infra/api-error-log/export-excel',
    params
  })
}
