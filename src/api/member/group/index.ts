import request from '@/config/axios'

export interface GroupVO {
  id: number
  name: string
  remark: string
  status: number
}

// Query user group list
export const getGroupPage = async (params: any) => {
  return await request.get({ url: `/member/group/page`, params })
}

// Query user group details
export const getGroup = async (id: number) => {
  return await request.get({ url: `/member/group/get?id=` + id })
}

// Add user groups
export const createGroup = async (data: GroupVO) => {
  return await request.post({ url: `/member/group/create`, data })
}

// Query user groups - Simplify the information list
export const getSimpleGroupList = async () => {
  return await request.get({ url: `/member/group/list-all-simple` })
}

// Modify user groups
export const updateGroup = async (data: GroupVO) => {
  return await request.put({ url: `/member/group/update`, data })
}

// Delete user group
export const deleteGroup = async (id: number) => {
  return await request.delete({ url: `/member/group/delete?id=` + id })
}
