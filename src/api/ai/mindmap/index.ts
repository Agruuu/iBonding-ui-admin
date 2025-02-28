import { getAccessToken } from '@/utils/auth'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { config } from '@/config/axios/config'
import request from '@/config/axios' // AI Mind map VO

// AI Mind map VO
export interface MindMapVO {
  id: number // number
  userId: number // User ID
  prompt: string // Generate content prompts
  generatedContent: string // Generated mind map content
  platform: string // platform
  model: string // Model
  errorMessage: string // error message
}

// AI Mind map generation VO
export interface AiMindMapGenerateReqVO {
  prompt: string
}

export const AiMindMapApi = {
  generateMindMap: ({
    data,
    onClose,
    onMessage,
    onError,
    ctrl
  }: {
    data: AiMindMapGenerateReqVO
    onMessage?: (res: any) => void
    onError?: (...args: any[]) => void
    onClose?: (...args: any[]) => void
    ctrl: AbortController
  }) => {
    const token = getAccessToken()
    return fetchEventSource(`${config.base_url}/ai/mind-map/generate-stream`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      openWhenHidden: true,
      body: JSON.stringify(data),
      onmessage: onMessage,
      onerror: onError,
      onclose: onClose,
      signal: ctrl.signal
    })
  },

  // Query mind map pagination
  getMindMapPage: async (params: any) => {
    return await request.get({ url: `/ai/mind-map/page`, params })
  },
  // Delete mind map
  deleteMindMap: async (id: number) => {
    return await request.delete({ url: `/ai/mind-map/delete?id=` + id })
  }
}
