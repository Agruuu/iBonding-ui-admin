import request from '@/config/axios'

// AI mapping VO
export interface ImageVO {
  id: number // number
  platform: string // platform
  model: string // Model
  prompt: string // cue word
  width: number // image width
  height: number // Image height
  status: number // state
  publicStatus: boolean // Public status
  picUrl: string // Task Address
  errorMessage: string // error message
  options: any // to configure Map<string, string>
  taskId: number // Task Number
  buttons: ImageMidjourneyButtonsVO[] // mj Operation button
  createTime: Date // Creation time
  finishTime: Date // Completion time
}

export interface ImageDrawReqVO {
  platform: string // platform
  prompt: string // cue word
  model: string // Model
  style: string // The style of image generation
  width: string // image width
  height: string // Image height
  options: object // Draw parameters，Map<String, String>
}

export interface ImageMidjourneyImagineReqVO {
  prompt: string // cue word
  model: string // Model mj nijj
  base64Array: string[] // sizeCannot be empty
  width: string // image width
  height: string // Image height
  version: string // version
}

export interface ImageMidjourneyActionVO {
  id: number // Image Number
  customId: string // MJ::JOB::upsample::1::85a4b4c1-8835-46c5-a15c-aea34fad1862 Action identification
}

export interface ImageMidjourneyButtonsVO {
  customId: string // MJ::JOB::upsample::1::85a4b4c1-8835-46c5-a15c-aea34fad1862 Action identification
  emoji: string // Icon emoji
  label: string // Make Variations text
  style: number // style: 2（Primary）、3（Green）
}

// AI picture API
export const ImageApi = {
  // obtain【my】Drawing pagination
  getImagePageMy: async (params: any) => {
    return await request.get({ url: `/ai/image/my-page`, params })
  },
  // obtain【my】Drawing Record
  getImageMy: async (id: number) => {
    return await request.get({ url: `/ai/image/get-my?id=${id}` })
  },
  // obtain【my】List of Drawing Records
  getImageListMyByIds: async (ids: number[]) => {
    return await request.get({ url: `/ai/image/my-list-by-ids`, params: { ids: ids.join(',') } })
  },
  // Generate images
  drawImage: async (data: ImageDrawReqVO) => {
    return await request.post({ url: `/ai/image/draw`, data })
  },
  // delete【my】Painting Records
  deleteImageMy: async (id: number) => {
    return await request.delete({ url: `/ai/image/delete-my?id=${id}` })
  },

  // ================ midjourney exclusive ================

  // 【Midjourney】Generate images
  midjourneyImagine: async (data: ImageMidjourneyImagineReqVO) => {
    return await request.post({ url: `/ai/image/midjourney/imagine`, data })
  },
  // 【Midjourney】Action operation（Secondary generation of images）
  midjourneyAction: async (data: ImageMidjourneyActionVO) => {
    return await request.post({ url: `/ai/image/midjourney/action`, data })
  },

  // ================ Drawing Management ================

  // Query Painting Page
  getImagePage: async (params: any) => {
    return await request.get({ url: `/ai/image/page`, params })
  },

  // Update painting release status
  updateImage: async (data: any) => {
    return await request.put({ url: '/ai/image/update', data })
  },

  // Delete painting
  deleteImage: async (id: number) => {
    return await request.delete({ url: `/ai/image/delete?id=` + id })
  }
}
