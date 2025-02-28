export type UserLoginVO = {
  username: string
  password: string
  captchaVerification: string
  socialType?: string
  socialCode?: string
  socialState?: string
}

export type TokenType = {
  id: number // number
  accessToken: string // Access Token
  refreshToken: string // refresh token 
  userId: number // User ID
  userType: number //customer type
  clientId: string //Client ID
  expiresTime: number //Expiration date
}

export type UserVO = {
  id: number
  username: string
  nickname: string
  deptId: number
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  loginDate: string
}

export type RegisterVO = {
  username: string
  password: string
  captchaVerification: string
}
