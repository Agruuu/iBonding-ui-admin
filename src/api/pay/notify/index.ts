import request from '@/config/axios'

// Get payment notification details
export const getNotifyTaskDetail = (id) => {
  return request.get({
    url: '/pay/notify/get-detail?id=' + id
  })
}

// Get payment notification pagination
export const getNotifyTaskPage = (query) => {
  return request.get({
    url: '/pay/notify/page',
    params: query
  })
}
