import request from '@/config/axios'

export interface SignInConfigVO {
  id?: number
  day?: number
  point?: number
  experience?: number
  status?: number
}

// Query the list of points check-in rules
export const getSignInConfigList = async () => {
  return await request.get({ url: `/member/sign-in/config/list` })
}

// Query the details of the points check-in rules
export const getSignInConfig = async (id: number) => {
  return await request.get({ url: `/member/sign-in/config/get?id=` + id })
}

// Add points sign in rule
export const createSignInConfig = async (data: SignInConfigVO) => {
  return await request.post({ url: `/member/sign-in/config/create`, data })
}

// Modify the points check-in rules
export const updateSignInConfig = async (data: SignInConfigVO) => {
  return await request.put({ url: `/member/sign-in/config/update`, data })
}

// Delete points check-in rule
export const deleteSignInConfig = async (id: number) => {
  return await request.delete({ url: `/member/sign-in/config/delete?id=` + id })
}
