import request from '@/config/axios'

export interface RoleVO {
  id: number
  name: string
  code: string
  sort: number
  status: number
  type: number
  dataScope: number
  dataScopeDeptIds: number[]
  createTime: Date
}

export interface UpdateStatusReqVO {
  id: number
  status: number
}

// Query role list
export const getRolePage = async (params: PageParam) => {
  return await request.get({ url: '/system/role/page', params })
}

// Search for roles（Simplify)list
export const getSimpleRoleList = async (): Promise<RoleVO[]> => {
  return await request.get({ url: '/system/role/simple-list' })
}

// Query role details
export const getRole = async (id: number) => {
  return await request.get({ url: '/system/role/get?id=' + id })
}

// Add new role
export const createRole = async (data: RoleVO) => {
  return await request.post({ url: '/system/role/create', data })
}

// Change role
export const updateRole = async (data: RoleVO) => {
  return await request.put({ url: '/system/role/update', data })
}

// Modify role status
export const updateRoleStatus = async (data: UpdateStatusReqVO) => {
  return await request.put({ url: '/system/role/update-status', data })
}

// Delete Role
export const deleteRole = async (id: number) => {
  return await request.delete({ url: '/system/role/delete?id=' + id })
}

// Export Role
export const exportRole = (params) => {
  return request.download({
    url: '/system/role/export-excel',
    params
  })
}
