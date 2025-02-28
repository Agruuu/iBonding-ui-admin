import request from '@/config/axios'

// AI Chat Model VO
export interface ChatModelVO {
  id: number // number
  keyId: number // API Key number
  name: string // Model Name
  model: string // Model identification
  platform: string // Model platform
  sort: number // sort
  status: number // state
  temperature: number // Temperature parameters
  maxTokens: number // The maximum number of Tokens for a single reply
  maxContexts: number // The maximum number of Messages in the context
}

// AI Chat Model API
export const ChatModelApi = {
  // Query chat model pagination
  getChatModelPage: async (params: any) => {
    return await request.get({ url: `/ai/chat-model/page`, params })
  },

  // Get a list of chat models
  getChatModelSimpleList: async (status?: number) => {
    return await request.get({
      url: `/ai/chat-model/simple-list`,
      params: {
        status
      }
    })
  },

  // Query chat model details
  getChatModel: async (id: number) => {
    return await request.get({ url: `/ai/chat-model/get?id=` + id })
  },

  // Add chat model
  createChatModel: async (data: ChatModelVO) => {
    return await request.post({ url: `/ai/chat-model/create`, data })
  },

  // Modify chat model
  updateChatModel: async (data: ChatModelVO) => {
    return await request.put({ url: `/ai/chat-model/update`, data })
  },

  // Delete chat model
  deleteChatModel: async (id: number) => {
    return await request.delete({ url: `/ai/chat-model/delete?id=` + id })
  }
}
