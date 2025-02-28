import request from '@/config/axios'

export type DictTypeVO = {
  id: number | undefined
  name: string
  type: string
  status: number
  remark: string
  createTime: Date
}

// Search dictionary（Simplify)list
export const getSimpleDictTypeList = () => {
  return request.get({ url: '/system/dict-type/list-all-simple' })
}

// Query dictionary list
export const getDictTypePage = (params: PageParam) => {
  return request.get({ url: '/system/dict-type/page', params })
}

// Query dictionary details
export const getDictType = (id: number) => {
  return request.get({ url: '/system/dict-type/get?id=' + id })
}

// Add dictionary
export const createDictType = (data: DictTypeVO) => {
  return request.post({ url: '/system/dict-type/create', data })
}

// Modify dictionary
export const updateDictType = (data: DictTypeVO) => {
  return request.put({ url: '/system/dict-type/update', data })
}

// Delete dictionary
export const deleteDictType = (id: number) => {
  return request.delete({ url: '/system/dict-type/delete?id=' + id })
}
// Export dictionary type
export const exportDictType = (params) => {
  return request.download({ url: '/system/dict-type/export', params })
}
