import request from '@/config/axios'

export interface ConfigVO {
  id: number
  pointTradeDeductEnable: number
  pointTradeDeductUnitPrice: number
  pointTradeDeductMaxPrice: number
  pointTradeGivePoint: number
}

// Query the details of point settings
export const getConfig = async () => {
  return await request.get({ url: `/member/config/get` })
}

// Add and modify points settings
export const saveConfig = async (data: ConfigVO) => {
  return await request.put({ url: `/member/config/save`, data })
}
