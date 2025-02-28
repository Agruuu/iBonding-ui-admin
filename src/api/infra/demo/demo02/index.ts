import request from '@/config/axios'

export interface Demo02CategoryVO {
  id: number
  name: string
  parentId: number
}

// Query example classification list
export const getDemo02CategoryList = async () => {
  return await request.get({ url: `/infra/demo02-category/list` })
}

// Query example classification details
export const getDemo02Category = async (id: number) => {
  return await request.get({ url: `/infra/demo02-category/get?id=` + id })
}

// New Example Classification
export const createDemo02Category = async (data: Demo02CategoryVO) => {
  return await request.post({ url: `/infra/demo02-category/create`, data })
}

// Modify example classification
export const updateDemo02Category = async (data: Demo02CategoryVO) => {
  return await request.put({ url: `/infra/demo02-category/update`, data })
}

// Delete example category
export const deleteDemo02Category = async (id: number) => {
  return await request.delete({ url: `/infra/demo02-category/delete?id=` + id })
}

// Export example classification Excel
export const exportDemo02Category = async (params) => {
  return await request.download({ url: `/infra/demo02-category/export-excel`, params })
}
