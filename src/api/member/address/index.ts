import request from '@/config/axios'

export interface AddressVO {
  id: number
  name: string
  mobile: string
  areaId: number
  detailAddress: string
  defaultStatus: boolean
}

// Query the user's mailing address list
export const getAddressList = async (params) => {
  return await request.get({ url: `/member/address/list`, params })
}
