import request from '@/config/axios'

// Get Regional Trees
export const getAreaTree = async () => {
  return await request.get({ url: '/system/area/tree' })
}

// get IP Corresponding region name
export const getAreaByIp = async (ip: string) => {
  return await request.get({ url: '/system/area/get-by-ip?ip=' + ip })
}
