import request from '@/config/axios'

export interface ConfigVO {
  id: number | undefined
  category: string
  name: string
  key: string
  value: string
  type: number
  visible: boolean
  remark: string
  createTime: Date
}

// Query parameter list
export const getConfigPage = (params: PageParam) => {
  return request.get({ url: '/infra/config/page', params })
}

// Query parameter details
export const getConfig = (id: number) => {
  return request.get({ url: '/infra/config/get?id=' + id })
}

// Query parameter values based on parameter key names
export const getConfigKey = (configKey: string) => {
  return request.get({ url: '/infra/config/get-value-by-key?key=' + configKey })
}

// Add new parameters
export const createConfig = (data: ConfigVO) => {
  return request.post({ url: '/infra/config/create', data })
}

// modify parameters
export const updateConfig = (data: ConfigVO) => {
  return request.put({ url: '/infra/config/update', data })
}

// Delete parameters
export const deleteConfig = (id: number) => {
  return request.delete({ url: '/infra/config/delete?id=' + id })
}

// Export parameters
export const exportConfig = (params) => {
  return request.download({ url: '/infra/config/export', params })
}
