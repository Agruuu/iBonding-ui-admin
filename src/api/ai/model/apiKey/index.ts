import request from '@/config/axios'

// AI API secret key VO
export interface ApiKeyVO {
  id: number // number
  name: string // name
  apiKey: string // secret key
  platform: string // platform
  url: string // custom API address
  status: number // state
}

// AI API secret key API
export const ApiKeyApi = {
  // query API Key pagination
  getApiKeyPage: async (params: any) => {
    return await request.get({ url: `/ai/api-key/page`, params })
  },

  // get API Key List
  getApiKeySimpleList: async () => {
    return await request.get({ url: `/ai/api-key/simple-list` })
  },

  // query API Key details
  getApiKey: async (id: number) => {
    return await request.get({ url: `/ai/api-key/get?id=` + id })
  },

  // add API secret key
  createApiKey: async (data: ApiKeyVO) => {
    return await request.post({ url: `/ai/api-key/create`, data })
  },

  // modify API secret key
  updateApiKey: async (data: ApiKeyVO) => {
    return await request.put({ url: `/ai/api-key/update`, data })
  },

  // delete API secret key
  deleteApiKey: async (id: number) => {
    return await request.delete({ url: `/ai/api-key/delete?id=` + id })
  }
}
