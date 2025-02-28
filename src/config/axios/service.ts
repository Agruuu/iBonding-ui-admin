import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import qs from 'qs'
import { config } from '@/config/axios/config'
import { getAccessToken, getRefreshToken, removeToken, setToken } from '@/utils/auth'
import errorCode from './errorCode'

import { resetRouter } from '@/router'
import { deleteUserCache } from '@/hooks/web/useCache'

const { result_code, base_url, request_timeout } = config

// Tips to ignore。After ignoring，automatic Promise.reject('error')
const ignoreMsgs = [
  'Invalid refresh token', // When the refresh token is deleted，No need to prompt
  'Refresh token has expired' // Use Refresh Token，When refreshing to obtain a new access token，The result failed due to expiration，At this point, it is necessary to ignore。otherwise，Will lead to continued 401，Unable to jump to the logout interface
]
// Do you want to display're login '
export const isRelogin = { show: false }
// Axios unconscious refresh token，reference resources https://www.dashingdog.cn/article/11 With https://segmentfault.com/a/1190000020210980 realization
// Request queue
let requestList: any[] = []
// Is refreshing in progress
let isRefreshToken = false
// Request whitelist，need nottokenThe interface
const whiteList: string[] = ['/login', '/refresh-token']

// establishaxiosexample
const service: AxiosInstance = axios.create({
  baseURL: base_url, // api base_url
  timeout: request_timeout, // Request timeout period
  withCredentials: false, // Disable information such as cookies.
  // Custom parameter serialization function
  paramsSerializer: (params) => {
    return qs.stringify(params, { allowDots: true })
  }
})

// request interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Is it necessary to set the token
    let isToken = (config!.headers || {}).isToken === false
    whiteList.some((v) => {
      if (config.url && config.url.indexOf(v) > -1) {
        return (isToken = false)
      }
    })
    if (getAccessToken() && !isToken) {
      config.headers.Authorization = 'Bearer ' + getAccessToken() // Let each request carry a custom token
    }
    
    const method = config.method?.toUpperCase()
    // prevent GET request cache
    if (method === 'GET') {
      config.headers['Cache-Control'] = 'no-cache'
      config.headers['Pragma'] = 'no-cache'
    }
    // Custom parameter serialization function
    else if (method === 'POST') {
      const contentType = config.headers['Content-Type'] || config.headers['content-type']
      if (contentType === 'application/x-www-form-urlencoded') {
        if (config.data && typeof config.data !== 'string') {
          config.data = qs.stringify(config.data)
        }
      }
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    let { data } = response
    const config = response.config
    if (!data) {
      // return“[HTTP]Request did not return a value”;
      throw new Error()
    }
    const { t } = useI18n()
    // If no status code is set, it defaults to a successful status
    // Binary data is directly returned，For example, Excel export
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      // be careful：If the exported response is json，Indicating that it may have failed，Do not directly return for download
      if (response.data.type !== 'application/json') {
        return response.data
      }
      data = await new Response(response.data).json()
    }
    const code = data.code || result_code
    // Get error information
    const msg = data.msg || errorCode[code] || errorCode['default']
    if (ignoreMsgs.indexOf(msg) !== -1) {
      // If it is an ignored error code，Return directly msg abnormal
      return Promise.reject(msg)
    } else if (code === 401) {
      // If not authenticated，And the token has not been refreshed，Indicating that the access token may have expired
      if (!isRefreshToken) {
        isRefreshToken = true
        // 1. If the refresh token cannot be obtained，Then only the logout operation can be performed
        if (!getRefreshToken()) {
          return handleAuthorized()
        }
        // 2. Refresh access token
        try {
          const refreshTokenRes = await refreshToken()
          // 2.1 Refresh successful，The request to replay the queue + Current request
          setToken((await refreshTokenRes).data.data)
          config.headers!.Authorization = 'Bearer ' + getAccessToken()
          requestList.forEach((cb: any) => {
            cb()
          })
          requestList = []
          return service(config)
        } catch (e) {
          // Why do we need to catch exceptions? When the refresh fails, the request triggers an exception due to `Promise.reject`.
          // 2.2 refresh failed，Only replay requests from the queue
          requestList.forEach((cb: any) => {
            cb()
          })
          // Prompt whether to log out。Do not replay the current request！Otherwise, it will form recursion
          return handleAuthorized()
        } finally {
          requestList = []
          isRefreshToken = false
        }
      } else {
        // Add to queue，Waiting for refresh to obtain a new token
        return new Promise((resolve) => {
          requestList.push(() => {
            config.headers!.Authorization = 'Bearer ' + getAccessToken() // Let each request carry a customtoken Please make the necessary modifications based on the actual situation
            resolve(service(config))
          })
        })
      }
    } else if (code === 500) {
      ElMessage.error(t('sys.api.errMsg500'))
      return Promise.reject(new Error(msg))
    } else if (code === 901) {
      ElMessage.error({
        offset: 300,
        dangerouslyUseHTMLString: true,
        message:
          '<div> &nbsp; </div>' +
          '<div>reference resources http://ibonding.com</div>' +
          '<div> &nbsp; </div>'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      if (msg === 'Invalid refresh token') {
        // hard coding：Ignore this prompt，Log out directly
        console.log(msg)
        return handleAuthorized()
      } else {
        ElNotification.error({ title: msg })
      }
      return Promise.reject('error')
    } else {
      return data
    }
  },
  (error: AxiosError) => {
    console.log('err' + error) // for debug
    let { message } = error
    const { t } = useI18n()
    if (message === 'Network Error') {
      message = t('sys.api.errorMessage')
    } else if (message.includes('timeout')) {
      message = t('sys.api.apiTimeoutMessage')
    } else if (message.includes('Request failed with status code')) {
      message = t('sys.api.apiRequestFailed') + message.substr(message.length - 3)
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

const refreshToken = async () => {
  return await axios.post(base_url + '/system/auth/refresh-token?refreshToken=' + getRefreshToken())
}
const handleAuthorized = () => {
  const { t } = useI18n()
  if (!isRelogin.show) {
    isRelogin.show = true
    ElMessageBox.confirm(t('sys.api.timeoutMessage'), t('common.confirmTitle'), {
      showCancelButton: false,
      closeOnClickModal: false,
      showClose: false,
      closeOnPressEscape: false,
      confirmButtonText: t('login.relogin'),
      type: 'warning'
    }).then(() => {
      resetRouter() // Reset static routing table
      deleteUserCache() // Delete user cache
      removeToken()
      isRelogin.show = false
      // Delete the token and then navigate through the route again to trigger the verification in `router.beforeEach`.
      window.location.href = window.location.href
    })
  }
  return Promise.reject(t('sys.api.timeoutMessage'))
}
export { service }
