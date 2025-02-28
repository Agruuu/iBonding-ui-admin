import request from '@/config/axios'

export interface MenuVO {
  id: number
  name: string
  permission: string
  type: number
  sort: number
  parentId: number
  path: string
  icon: string
  component: string
  componentName?: string
  status: number
  visible: boolean
  keepAlive: boolean
  alwaysShow?: boolean
  createTime: Date
}

// Query menu（Simplify）list
export const getSimpleMenusList = () => {
  return request.get({ url: '/system/menu/simple-list' })
}

// Query menu list
export const getMenuList = (params) => {
  return request.get({ url: '/system/menu/list', params })
}

// Get menu details
export const getMenu = (id: number) => {
  return request.get({ url: '/system/menu/get?id=' + id })
}

// Add menu
export const createMenu = (data: MenuVO) => {
  return request.post({ url: '/system/menu/create', data })
}

// Modify menu
export const updateMenu = (data: MenuVO) => {
  return request.put({ url: '/system/menu/update', data })
}

// Delete menu
export const deleteMenu = (id: number) => {
  return request.delete({ url: '/system/menu/delete?id=' + id })
}
