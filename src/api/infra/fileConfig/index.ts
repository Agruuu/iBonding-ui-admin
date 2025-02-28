import request from '@/config/axios'

export interface FileClientConfig {
  basePath: string
  host?: string
  port?: number
  username?: string
  password?: string
  mode?: string
  endpoint?: string
  bucket?: string
  accessKey?: string
  accessSecret?: string
  domain: string
}

export interface FileConfigVO {
  id: number
  name: string
  storage?: number
  master: boolean
  visible: boolean
  config: FileClientConfig
  remark: string
  createTime: Date
}

// Query file configuration list
export const getFileConfigPage = (params: PageParam) => {
  return request.get({ url: '/infra/file-config/page', params })
}

// Query file configuration details
export const getFileConfig = (id: number) => {
  return request.get({ url: '/infra/file-config/get?id=' + id })
}

// Update file configuration as the main configuration
export const updateFileConfigMaster = (id: number) => {
  return request.put({ url: '/infra/file-config/update-master?id=' + id })
}

// Add file configuration
export const createFileConfig = (data: FileConfigVO) => {
  return request.post({ url: '/infra/file-config/create', data })
}

// Modify file configuration
export const updateFileConfig = (data: FileConfigVO) => {
  return request.put({ url: '/infra/file-config/update', data })
}

// Delete file configuration
export const deleteFileConfig = (id: number) => {
  return request.delete({ url: '/infra/file-config/delete?id=' + id })
}

// Test file configuration
export const testFileConfig = (id: number) => {
  return request.get({ url: '/infra/file-config/test?id=' + id })
}
