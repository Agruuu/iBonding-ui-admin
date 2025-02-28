import request from '@/config/axios'

// AI Chat Role VO
export interface ChatRoleVO {
  id: number // Role Number
  modelId: number // Model number
  name: string // Role Name
  avatar: string // Character avatar
  category: string // Role category
  sort: number // Character sorting
  description: string // Role description
  systemMessage: string // Role setting
  welcomeMessage: string // Role setting
  publicStatus: boolean // Is it publicly available
  status: number // state
}

// AI Chat Role Page request vo
export interface ChatRolePageReqVO {
  name?: string // Role Name
  category?: string // Role category
  publicStatus: boolean // Is it publicly available
  pageNo: number // Is it publicly available
  pageSize: number // Is it publicly available
}

// AI Chat Role API
export const ChatRoleApi = {
  // Query chat role pagination
  getChatRolePage: async (params: any) => {
    return await request.get({ url: `/ai/chat-role/page`, params })
  },

  // Query chat character details
  getChatRole: async (id: number) => {
    return await request.get({ url: `/ai/chat-role/get?id=` + id })
  },

  // Add chat character
  createChatRole: async (data: ChatRoleVO) => {
    return await request.post({ url: `/ai/chat-role/create`, data })
  },

  // Change chat role
  updateChatRole: async (data: ChatRoleVO) => {
    return await request.put({ url: `/ai/chat-role/update`, data })
  },

  // Delete chat character
  deleteChatRole: async (id: number) => {
    return await request.delete({ url: `/ai/chat-role/delete?id=` + id })
  },

  // ======= chat chat

  // get my role
  getMyPage: async (params: ChatRolePageReqVO) => {
    return await request.get({ url: `/ai/chat-role/my-page`, params})
  },

  // get role classification
  getCategoryList: async () => {
    return await request.get({ url: `/ai/chat-role/category-list`})
  },

  // Create a role
  createMy: async (data: ChatRoleVO) => {
    return await request.post({ url: `/ai/chat-role/create-my`, data})
  },

  // Update Role
  updateMy: async (data: ChatRoleVO) => {
    return await request.put({ url: `/ai/chat-role/update-my`, data})
  },

  // Delete Role my
  deleteMy: async (id: number) => {
    return await request.delete({ url: `/ai/chat-role/delete-my?id=` + id })
  },
}
