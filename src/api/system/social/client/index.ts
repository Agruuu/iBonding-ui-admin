import request from '@/config/axios'

export interface SocialClientVO {
  id: number
  name: string
  socialType: number
  userType: number
  clientId: string
  clientSecret: string
  agentId: string
  status: number
}

// Query the list of social clients
export const getSocialClientPage = async (params) => {
  return await request.get({ url: `/system/social-client/page`, params })
}

// Query social client details
export const getSocialClient = async (id: number) => {
  return await request.get({ url: `/system/social-client/get?id=` + id })
}

// Add a new social client
export const createSocialClient = async (data: SocialClientVO) => {
  return await request.post({ url: `/system/social-client/create`, data })
}

// Modify social client
export const updateSocialClient = async (data: SocialClientVO) => {
  return await request.put({ url: `/system/social-client/update`, data })
}

// Delete social client
export const deleteSocialClient = async (id: number) => {
  return await request.delete({ url: `/system/social-client/delete?id=` + id })
}
