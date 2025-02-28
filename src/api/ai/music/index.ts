import request from '@/config/axios'

// AI music VO
export interface MusicVO {
  id: number // number
  userId: number // User ID
  title: string // Music name
  lyric: string // lyric
  imageUrl: string // Image address
  audioUrl: string // Audio address
  videoUrl: string // Video address
  status: number // Music state
  gptDescriptionPrompt: string // Descriptive words
  prompt: string // cue word
  platform: string // Model platform
  model: string // Model
  generateMode: number // Generate Mode
  tags: string // Music Style Label
  duration: number // Music duration
  publicStatus: boolean // Whether to publish or not
  taskId: string // taskid
  errorMessage: string // error message
}

// AI music API
export const MusicApi = {
  // Query Music Page
  getMusicPage: async (params: any) => {
    return await request.get({ url: `/ai/music/page`, params })
  },

  // Update music
  updateMusic: async (data: any) => {
    return await request.put({ url: '/ai/music/update', data })
  },

  // Delete music
  deleteMusic: async (id: number) => {
    return await request.delete({ url: `/ai/music/delete?id=` + id })
  }
}
