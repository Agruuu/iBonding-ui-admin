import request from '@/config/axios'

/**
 * Get redis Monitoring information
 */
export const getCache = () => {
  return request.get({ url: '/infra/redis/get-monitor-info' })
}
