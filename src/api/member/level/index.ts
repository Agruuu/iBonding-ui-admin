import request from '@/config/axios'

export interface LevelVO {
  id: number
  name: string
  experience: number
  value: number
  discountPercent: number
  icon: string
  bgUrl: string
  status: number
}

// Query the membership level list
export const getLevelList = async (params) => {
  return await request.get({ url: `/member/level/list`, params })
}

// Query membership level details
export const getLevel = async (id: number) => {
  return await request.get({ url: `/member/level/get?id=` + id })
}

// Check membership level - Simplify the information list
export const getSimpleLevelList = async () => {
  return await request.get({ url: `/member/level/list-all-simple` })
}

// Add membership level
export const createLevel = async (data: LevelVO) => {
  return await request.post({ url: `/member/level/create`, data })
}

// Modify membership level
export const updateLevel = async (data: LevelVO) => {
  return await request.put({ url: `/member/level/update`, data })
}

// Delete membership level
export const deleteLevel = async (id: number) => {
  return await request.delete({ url: `/member/level/delete?id=` + id })
}
