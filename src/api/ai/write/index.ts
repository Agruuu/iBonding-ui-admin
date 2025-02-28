import { fetchEventSource } from '@microsoft/fetch-event-source'

import { getAccessToken } from '@/utils/auth'
import { config } from '@/config/axios/config'
import { AiWriteTypeEnum } from '@/views/ai/utils/constants'
import request from '@/config/axios'

export interface WriteVO {
  type: AiWriteTypeEnum.WRITING | AiWriteTypeEnum.REPLY // 1:compose 2:reply
  prompt: string // Writing Content Tips 1。compose 2reply
  originalContent: string // original text
  length: number // length
  format: number // format
  tone: number // tone
  language: number // language
  userId?: number // User ID
  platform?: string // platform
  model?: string // Model
  generatedContent?: string // Generated content
  errorMessage?: string // error message
  createTime?: Date // Creation time
}

export interface AiWritePageReqVO extends PageParam {
  userId?: number // User ID
  type?: AiWriteTypeEnum //  Writing type
  platform?: string // platform
  createTime?: [string, string] // Creation time
}

export interface AiWriteRespVo {
  id: number
  userId: number
  type: number
  platform: string
  model: string
  prompt: string
  generatedContent: string
  originalContent: string
  length: number
  format: number
  tone: number
  language: number
  errorMessage: string
  createTime: string
}

export const WriteApi = {
  writeStream: ({
    data,
    onClose,
    onMessage,
    onError,
    ctrl
  }: {
    data: WriteVO
    onMessage?: (res: any) => void
    onError?: (...args: any[]) => void
    onClose?: (...args: any[]) => void
    ctrl: AbortController
  }) => {
    const token = getAccessToken()
    return fetchEventSource(`${config.base_url}/ai/write/generate-stream`, {
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
  // Get writing list
  getWritePage: (params: AiWritePageReqVO) => {
    return request.get<PageResult<AiWriteRespVo[]>>({ url: `/ai/write/page`, params })
  },
  // Delete Writing
  deleteWrite(id: number) {
    return request.delete({ url: `/ai/write/delete`, params: { id } })
  }
}
