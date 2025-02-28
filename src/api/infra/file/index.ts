import request from '@/config/axios'

export interface FilePageReqVO extends PageParam {
  path?: string
  type?: string
  createTime?: Date[]
}

// Pre signed file address Response VO
export interface FilePresignedUrlRespVO {
  // File configuration number
  configId: number
  // File upload URL
  uploadUrl: string
  // file URL
  url: string
}

// Query file list
export const getFilePage = (params: FilePageReqVO) => {
  return request.get({ url: '/infra/file/page', params })
}

// Delete file
export const deleteFile = (id: number) => {
  return request.delete({ url: '/infra/file/delete?id=' + id })
}

// Get the pre signed address of the file
export const getFilePresignedUrl = (path: string) => {
  return request.get<FilePresignedUrlRespVO>({
    url: '/infra/file/presigned-url',
    params: { path }
  })
}

// create a file
export const createFile = (data: any) => {
  return request.post({ url: '/infra/file/create', data })
}

// Upload files
export const updateFile = (data: any) => {
  return request.upload({ url: '/infra/file/upload', data })
}
