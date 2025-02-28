import request from '@/config/axios'

export interface AppVO {
  id: number
  appKey: string
  name: string
  status: number
  remark: string
  payNotifyUrl: string
  refundNotifyUrl: string
  transferNotifyUrl: string
  merchantId: number
  merchantName: string
  createTime: Date
}

export interface AppPageReqVO extends PageParam {
  name?: string
  status?: number
  remark?: string
  payNotifyUrl?: string
  refundNotifyUrl?: string
  transferNotifyUrl?: string
  merchantName?: string
  createTime?: Date[]
}

export interface AppUpdateStatusReqVO {
  id: number
  status: number
}

// Query List Payment Application
export const getAppPage = (params: AppPageReqVO) => {
  return request.get({ url: '/pay/app/page', params })
}

// Search for details on payment applications
export const getApp = (id: number) => {
  return request.get({ url: '/pay/app/get?id=' + id })
}

// Add payment application
export const createApp = (data: AppVO) => {
  return request.post({ url: '/pay/app/create', data })
}

// Modify payment application
export const updateApp = (data: AppVO) => {
  return request.put({ url: '/pay/app/update', data })
}

// Payment application information status modification
export const changeAppStatus = (data: AppUpdateStatusReqVO) => {
  return request.put({ url: '/pay/app/update-status', data: data })
}

// Delete payment application
export const deleteApp = (id: number) => {
  return request.delete({ url: '/pay/app/delete?id=' + id })
}

// Get a list of payment applications
export const getAppList = () => {
  return request.get({
    url: '/pay/app/list'
  })
}
