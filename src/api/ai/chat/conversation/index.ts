import request from '@/config/axios'

// AI Chat conversation VO
export interface ChatConversationVO {
  id: number // ID number
  userId: number // User ID
  title: string // Dialogue Title
  pinned: boolean // Is it placed on top
  roleId: number // Role Number
  modelId: number // Model number
  model: string // Model logo
  temperature: number // Temperature parameters
  maxTokens: number // The maximum number of single replies Token quantity
  maxContexts: number // The maximum context Message quantity
  createTime?: Date // Creation time
  // Additional fields
  systemMessage?: string // Role setting
  modelName?: string // Model Name
  roleAvatar?: string // Character avatar
  modelMaxTokens?: string // The maximum number of Tokens for a single reply from the model.
  modelMaxContexts?: string // The maximum number of Messages in the model's context.
}

// AI Chat conversation API
export const ChatConversationApi = {
  // get【my】Chat conversation
  getChatConversationMy: async (id: number) => {
    return await request.get({ url: `/ai/chat/conversation/get-my?id=${id}` })
  },

  // newly added【my】Chat conversation
  createChatConversationMy: async (data?: ChatConversationVO) => {
    return await request.post({ url: `/ai/chat/conversation/create-my`, data })
  },

  // to update【my】Chat conversation
  updateChatConversationMy: async (data: ChatConversationVO) => {
    return await request.put({ url: `/ai/chat/conversation/update-my`, data })
  },

  // delete【my】Chat conversation
  deleteChatConversationMy: async (id: string) => {
    return await request.delete({ url: `/ai/chat/conversation/delete-my?id=${id}` })
  },

  // delete【my】All conversations，Except for top placement
  deleteChatConversationMyByUnpinned: async () => {
    return await request.delete({ url: `/ai/chat/conversation/delete-by-unpinned` })
  },

  // get【my】Chat conversation list
  getChatConversationMyList: async () => {
    return await request.get({ url: `/ai/chat/conversation/my-list` })
  },

  // Get conversation pagination
  getChatConversationPage: async (params: any) => {
    return await request.get({ url: `/ai/chat/conversation/page`, params })
  },

  // Administrator deletes message
  deleteChatConversationByAdmin: async (id: number) => {
    return await request.delete({ url: `/ai/chat/conversation/delete-by-admin?id=${id}` })
  }
}
