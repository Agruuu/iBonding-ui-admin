import request from '@/config/axios'

export interface UserVO {
  id: number
  avatar: string | undefined
  birthday: number | undefined
  createTime: number | undefined
  loginDate: number | undefined
  loginIp: string
  mark: string
  mobile: string
  name: string | undefined
  nickname: string | undefined
  registerIp: string
  sex: number
  status: number
  areaId: number | undefined
  areaName: string | undefined
  levelName: string | null
  point: number | undefined | null
  totalPoint: number | undefined | null
  experience: number | null | undefined
}

// Query the list of member users
export const getUserPage = async (params) => {
  return await request.get({ url: `/member/user/page`, params })
}

// Query member user details
export const getUser = async (id: number) => {
  return await request.get({ url: `/member/user/get?id=` + id })
}

// Modify member users
export const updateUser = async (data: UserVO) => {
  return await request.put({ url: `/member/user/update`, data })
}

// Modify member user level
export const updateUserLevel = async (data: any) => {
  return await request.put({ url: `/member/user/update-level`, data })
}

// Modify member user points
export const updateUserPoint = async (data: any) => {
  return await request.put({ url: `/member/user/update-point`, data })
}
