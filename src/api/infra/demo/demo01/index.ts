import request from '@/config/axios'

export interface Demo01ContactVO {
  id: number
  name: string
  sex: number
  birthday: Date
  description: string
  avatar: string
}

// Query Example Contact Page
export const getDemo01ContactPage = async (params) => {
  return await request.get({ url: `/infra/demo01-contact/page`, params })
}

// Query example contact details
export const getDemo01Contact = async (id: number) => {
  return await request.get({ url: `/infra/demo01-contact/get?id=` + id })
}

// Add example contact person
export const createDemo01Contact = async (data: Demo01ContactVO) => {
  return await request.post({ url: `/infra/demo01-contact/create`, data })
}

// Modify example contact person
export const updateDemo01Contact = async (data: Demo01ContactVO) => {
  return await request.put({ url: `/infra/demo01-contact/update`, data })
}

// Delete Example Contact
export const deleteDemo01Contact = async (id: number) => {
  return await request.delete({ url: `/infra/demo01-contact/delete?id=` + id })
}

// Export example contacts Excel
export const exportDemo01Contact = async (params) => {
  return await request.download({ url: `/infra/demo01-contact/export-excel`, params })
}
