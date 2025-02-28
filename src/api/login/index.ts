import request from '@/config/axios'
import type { RegisterVO, UserLoginVO } from './types'

export interface SmsCodeVO {
  mobile: string
  scene: number
}

export interface SmsLoginVO {
  mobile: string
  code: string
}

// Sign in
export const login = (data: UserLoginVO) => {
  return request.post({ url: '/system/auth/login', data })
}

// register
export const register = (data: RegisterVO) => {
  return request.post({ url: '/system/auth/register', data })
}

// Log out
export const loginOut = () => {
  return request.post({ url: '/system/auth/logout' })
}

// Get user permission information
export const getInfo = () => {
  return request.get({ url: '/system/auth/get-permission-info' })
}

// Get login verification code
export const sendSmsCode = (data: SmsCodeVO) => {
  return request.post({ url: '/system/auth/send-sms-code', data })
}

// SMS verification code login
export const smsLogin = (data: SmsLoginVO) => {
  return request.post({ url: '/system/auth/sms-login', data })
}

// Social Quick Login，use code Authorization code
export function socialLogin(type: string, code: string, state: string) {
  return request.post({
    url: '/system/auth/social-login',
    data: {
      type,
      code,
      state
    }
  })
}

// Social authorization redirection
export const socialAuthRedirect = (type: number, redirectUri: string) => {
  return request.get({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
// Get verification images and token
export const getCode = (data: any) => {
  debugger
  return request.postOriginal({ url: 'system/captcha/get', data })
}

// Swipe or click to verify
export const reqCheck = (data: any) => {
  return request.postOriginal({ url: 'system/captcha/check', data })
}

// Reset password via SMS
export const smsResetPassword = (data: any) => {
  return request.post({ url: '/system/auth/reset-password', data })
}
