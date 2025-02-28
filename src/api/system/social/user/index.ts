import request from '@/config/axios'

export interface SocialUserVO {
  id: number
  type: number
  openid: string
  token: string
  rawTokenInfo: string
  nickname: string
  avatar: string
  rawUserInfo: string
  code: string
  state: string
}

// Query the list of social users
export const getSocialUserPage = async (params) => {
  return await request.get({ url: `/system/social-user/page`, params })
}

// Query social user details
export const getSocialUser = async (id: number) => {
  return await request.get({ url: `/system/social-user/get?id=` + id })
}
