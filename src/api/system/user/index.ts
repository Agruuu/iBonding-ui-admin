import request from '@/config/axios'

export interface UserVO {
  id: number
  username: string
  nickname: string
  deptId: number
  postIds: string[]
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  status: number
  remark: string
  loginDate: Date
  createTime: Date
}

// Query user management list
export const getUserPage = (params: PageParam) => {
  return request.get({ url: '/system/user/page', params })
}

// Query all user lists
export const getAllUser = () => {
  return request.get({ url: '/system/user/all' })
}

// Query user details
export const getUser = (id: number) => {
  return request.get({ url: '/system/user/get?id=' + id })
}

// New User
export const createUser = (data: UserVO) => {
  return request.post({ url: '/system/user/create', data })
}

// Modify user
export const updateUser = (data: UserVO) => {
  return request.put({ url: '/system/user/update', data })
}

// delete user
export const deleteUser = (id: number) => {
  return request.delete({ url: '/system/user/delete?id=' + id })
}

// Export users
export const exportUser = (params) => {
  return request.download({ url: '/system/user/export', params })
}

// Download User Import Template
export const importUserTemplate = () => {
  return request.download({ url: '/system/user/get-import-template' })
}

// User password reset
export const resetUserPwd = (id: number, password: string) => {
  const data = {
    id,
    password
  }
  return request.put({ url: '/system/user/update-password', data: data })
}

// User status modification
export const updateUserStatus = (id: number, status: number) => {
  const data = {
    id,
    status
  }
  return request.put({ url: '/system/user/update-status', data: data })
}

// Get a condensed list of user information
export const getSimpleUserList = (): Promise<UserVO[]> => {
  return request.get({ url: '/system/user/simple-list' })
}
