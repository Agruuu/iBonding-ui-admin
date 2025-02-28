import request from '@/config/axios'

// Social binding，use code Authorization code
export const socialBind = (type, code, state) => {
  return request.post({
    url: '/system/social-user/bind',
    data: {
      type,
      code,
      state
    }
  })
}

// Cancel social binding
export const socialUnbind = (type, openid) => {
  return request.delete({
    url: '/system/social-user/unbind',
    data: {
      type,
      openid
    }
  })
}

// Social authorization redirection
export const socialAuthRedirect = (type, redirectUri) => {
  return request.get({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
