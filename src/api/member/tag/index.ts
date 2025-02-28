import request from '@/config/axios'

export interface TagVO {
  id: number
  name: string
}

// Query the list of member tags
export const getMemberTagPage = async (params: any) => {
  return await request.get({ url: `/member/tag/page`, params })
}

// Query member tag details
export const getMemberTag = async (id: number) => {
  return await request.get({ url: `/member/tag/get?id=` + id })
}

// Search for member tags - Simplify the information list
export const getSimpleTagList = async () => {
  return await request.get({ url: `/member/tag/list-all-simple` })
}

// Add a new member tag
export const createMemberTag = async (data: TagVO) => {
  return await request.post({ url: `/member/tag/create`, data })
}

// Modify member tags
export const updateMemberTag = async (data: TagVO) => {
  return await request.put({ url: `/member/tag/update`, data })
}

// Delete member tag
export const deleteMemberTag = async (id: number) => {
  return await request.delete({ url: `/member/tag/delete?id=` + id })
}
