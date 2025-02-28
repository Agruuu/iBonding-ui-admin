import request from '@/config/axios'

export interface SignInRecordVO {
  id: number
  userId: number
  day: number
  point: number
}

// Query the list of user check-in points
export const getSignInRecordPage = async (params) => {
  return await request.get({ url: `/member/sign-in/record/page`, params })
}
