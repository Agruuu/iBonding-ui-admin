import request from '@/config/axios'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getAccessToken } from '@/utils/auth'
import { config } from '@/config/axios/config'

// chatVO
export interface ChatMessageVO {
  id: number // number
  conversationId: number // Dialogue Number
  type: string // Message type
  userId: string // User ID
  roleId: string // Role Number
  model: number // Model logo
  modelId: number // Model number
  content: string // Chat content
  tokens: number // consume Token quantity
  createTime: Date // Creation time
  roleAvatar: string // Character avatar
  userAvatar: string // Creation time
}

// AI chat chat
export const ChatMessageApi = {
  // Message List
  getChatMessageListByConversationId: async (conversationId: number | null) => {
    return await request.get({
      url: `/ai/chat/message/list-by-conversation-id?conversationId=${conversationId}`
    })
  },

  // send out Stream message
  // Why not use axios? Because it doesn't support SSE calls.
  sendChatMessageStream: async (
    conversationId: number,
    content: string,
    ctrl,
    enableContext: boolean,
    onMessage,
    onError,
    onClose
  ) => {
    const token = getAccessToken()
    return fetchEventSource(`${config.base_url}/ai/chat/message/send-stream`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      openWhenHidden: true,
      body: JSON.stringify({
        conversationId,
        content,
        useContext: enableContext
      }),
      onmessage: onMessage,
      onerror: onError,
      onclose: onClose,
      signal: ctrl.signal
    })
  },

  // removal message
  deleteChatMessage: async (id: string) => {
    return await request.delete({ url: `/ai/chat/message/delete?id=${id}` })
  },

  // Delete the message for the specified conversation
  deleteByConversationId: async (conversationId: number) => {
    return await request.delete({
      url: `/ai/chat/message/delete-by-conversation-id?conversationId=${conversationId}`
    })
  },

  // Get message pagination
  getChatMessagePage: async (params: any) => {
    return await request.get({ url: '/ai/chat/message/page', params })
  },

  // Administrator deletes message
  deleteChatMessageByAdmin: async (id: number) => {
    return await request.delete({ url: `/ai/chat/message/delete-by-admin?id=${id}` })
  }
}
