import request from '@/config/axios'

export type DictDataVO = {
  id: number | undefined
  sort: number | undefined
  label: string
  value: string
  dictType: string
  status: number
  colorType: string
  cssClass: string
  remark: string
  createTime: Date
}

// Query dictionary data（Simplify)list
export const getSimpleDictDataList = () => {
  return request.get({ url: '/system/dict-data/simple-list' })
}

// Query dictionary data list
export const getDictDataPage = (params: PageParam) => {
  return request.get({ url: '/system/dict-data/page', params })
}

// Query dictionary data details
export const getDictData = (id: number) => {
  return request.get({ url: '/system/dict-data/get?id=' + id })
}

// Add dictionary data
export const createDictData = (data: DictDataVO) => {
  return request.post({ url: '/system/dict-data/create', data })
}

// Modify dictionary data
export const updateDictData = (data: DictDataVO) => {
  return request.put({ url: '/system/dict-data/update', data })
}

// Delete dictionary data
export const deleteDictData = (id: number) => {
  return request.delete({ url: '/system/dict-data/delete?id=' + id })
}

// Export dictionary type data
export const exportDictData = (params) => {
  return request.download({ url: '/system/dict-data/export', params })
}
