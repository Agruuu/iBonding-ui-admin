import request from '@/config/axios'

export interface JobLogVO {
  id: number
  jobId: number
  handlerName: string
  handlerParam: string
  cronExpression: string
  executeIndex: string
  beginTime: Date
  endTime: Date
  duration: string
  status: number
  createTime: string
  result: string
}

// Task log list
export const getJobLogPage = (params: PageParam) => {
  return request.get({ url: '/infra/job-log/page', params })
}

// Task log details
export const getJobLog = (id: number) => {
  return request.get({ url: '/infra/job-log/get?id=' + id })
}

// Export scheduled task logs
export const exportJobLog = (params) => {
  return request.download({
    url: '/infra/job-log/export-excel',
    params
  })
}
