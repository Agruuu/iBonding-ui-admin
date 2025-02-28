import request from '@/config/axios'

export interface JobVO {
  id: number
  name: string
  status: number
  handlerName: string
  handlerParam: string
  cronExpression: string
  retryCount: number
  retryInterval: number
  monitorTimeout: number
  createTime: Date
}

// task list
export const getJobPage = (params: PageParam) => {
  return request.get({ url: '/infra/job/page', params })
}

// Task Details
export const getJob = (id: number) => {
  return request.get({ url: '/infra/job/get?id=' + id })
}

// New Task
export const createJob = (data: JobVO) => {
  return request.post({ url: '/infra/job/create', data })
}

// Modify scheduled task scheduling
export const updateJob = (data: JobVO) => {
  return request.put({ url: '/infra/job/update', data })
}

// Delete scheduled task scheduling
export const deleteJob = (id: number) => {
  return request.delete({ url: '/infra/job/delete?id=' + id })
}

// Export scheduled task scheduling
export const exportJob = (params) => {
  return request.download({ url: '/infra/job/export-excel', params })
}

// Task status modification
export const updateJobStatus = (id: number, status: number) => {
  const params = {
    id,
    status
  }
  return request.put({ url: '/infra/job/update-status', params })
}

// Execute scheduled tasks immediately once
export const runJob = (id: number) => {
  return request.put({ url: '/infra/job/trigger?id=' + id })
}

// Get timed tasks n Secondary execution time
export const getJobNextTimes = (id: number) => {
  return request.get({ url: '/infra/job/get_next_times?id=' + id })
}
