import request from '@/config/axios'

export interface DemoTransferVO {
  price: number
  type: number
  userName: string
  alipayLogonId: string
  openid: string
}

// Create a sample transfer order
export function createDemoTransfer(data: DemoTransferVO) {
  return request.post({
    url: '/pay/demo-transfer/create',
    data: data
  })
}

// Get sample order pagination
export function getDemoTransferPage(query: PageParam) {
  return request.get({
    url: '/pay/demo-transfer/page',
    params: query
  })
}
