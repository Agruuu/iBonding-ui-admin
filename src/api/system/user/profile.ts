import request from '@/config/axios'

export interface ProfileVO {
  id: number
  username: string
  nickname: string
  dept: {
    id: number
    name: string
  }
  roles: {
    id: number
    name: string
  }[]
  posts: {
    id: number
    name: string
  }[]
  socialUsers: {
    type: number
    openid: string
  }[]
  email: string
  mobile: string
  sex: number
  avatar: string
  status: number
  remark: string
  loginIp: string
  loginDate: Date
  createTime: Date
}

export interface UserProfileUpdateReqVO {
  nickname: string
  email: string
  mobile: string
  sex: number
}

// Query user personal information
export const getUserProfile = () => {
  return request.get({ url: '/system/user/profile/get' })
}

// Modify user personal information
export const updateUserProfile = (data: UserProfileUpdateReqVO) => {
  return request.put({ url: '/system/user/profile/update', data })
}

// User password reset
export const updateUserPassword = (oldPassword: string, newPassword: string) => {
  return request.put({
    url: '/system/user/profile/update-password',
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
  })
}

// User avatar upload
export const uploadAvatar = (data) => {
  return request.upload({ url: '/system/user/profile/update-avatar', data: data })
}
