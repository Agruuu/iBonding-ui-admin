import request from '@/config/axios'

export interface DemoOrderVO {
  spuId: number
  createTime: Date
}

// Create a sample order
export function createDemoOrder(data: DemoOrderVO) {
  return request.post({
    url: '/pay/demo-order/create',
    data: data
  })
}

// Get sample orders
export function getDemoOrder(id: number) {
  return request.get({
    url: '/pay/demo-order/get?id=' + id
  })
}

// Get sample order pagination
export function getDemoOrderPage(query: PageParam) {
  return request.get({
    url: '/pay/demo-order/page',
    params: query
  })
}

// Refund Example Order
export function refundDemoOrder(id) {
  return request.put({
    url: '/pay/demo-order/refund?id=' + id
  })
}
