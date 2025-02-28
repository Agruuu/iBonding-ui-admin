import request from '@/config/axios'

export interface PostVO {
  id?: number
  name: string
  code: string
  sort: number
  status: number
  remark: string
  createTime?: Date
}

// Query job list
export const getPostPage = async (params: PageParam) => {
  return await request.get({ url: '/system/post/page', params })
}

// Get a list of streamlined job information
export const getSimplePostList = async (): Promise<PostVO[]> => {
  return await request.get({ url: '/system/post/simple-list' })
}

// Query job details
export const getPost = async (id: number) => {
  return await request.get({ url: '/system/post/get?id=' + id })
}

// New positions added
export const createPost = async (data: PostVO) => {
  return await request.post({ url: '/system/post/create', data })
}

// Change position
export const updatePost = async (data: PostVO) => {
  return await request.put({ url: '/system/post/update', data })
}

// Delete Position
export const deletePost = async (id: number) => {
  return await request.delete({ url: '/system/post/delete?id=' + id })
}

// Export job positions
export const exportPost = async (params) => {
  return await request.download({ url: '/system/post/export', params })
}
