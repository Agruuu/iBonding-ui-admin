import request from '@/config/axios'

export interface DataSourceConfigVO {
  id: number | undefined
  name: string
  url: string
  username: string
  password: string
  createTime?: Date
}

// Add data source configuration
export const createDataSourceConfig = (data: DataSourceConfigVO) => {
  return request.post({ url: '/infra/data-source-config/create', data })
}

// Modify data source configuration
export const updateDataSourceConfig = (data: DataSourceConfigVO) => {
  return request.put({ url: '/infra/data-source-config/update', data })
}

// Delete data source configuration
export const deleteDataSourceConfig = (id: number) => {
  return request.delete({ url: '/infra/data-source-config/delete?id=' + id })
}

// Query data source configuration details
export const getDataSourceConfig = (id: number) => {
  return request.get({ url: '/infra/data-source-config/get?id=' + id })
}

// Query the data source configuration list
export const getDataSourceConfigList = () => {
  return request.get({ url: '/infra/data-source-config/list' })
}
