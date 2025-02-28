import request from '@/config/axios'

export interface Demo03StudentVO {
  id: number
  name: string
  sex: number
  birthday: Date
  description: string
}

// Query student pagination
export const getDemo03StudentPage = async (params) => {
  return await request.get({ url: `/infra/demo03-student/page`, params })
}

// Query student details
export const getDemo03Student = async (id: number) => {
  return await request.get({ url: `/infra/demo03-student/get?id=` + id })
}

// Add new students
export const createDemo03Student = async (data: Demo03StudentVO) => {
  return await request.post({ url: `/infra/demo03-student/create`, data })
}

// Modify students
export const updateDemo03Student = async (data: Demo03StudentVO) => {
  return await request.put({ url: `/infra/demo03-student/update`, data })
}

// Delete student
export const deleteDemo03Student = async (id: number) => {
  return await request.delete({ url: `/infra/demo03-student/delete?id=` + id })
}

// Export students Excel
export const exportDemo03Student = async (params) => {
  return await request.download({ url: `/infra/demo03-student/export-excel`, params })
}

// ==================== Sub table（Student courses） ====================

// Obtain student course pagination
export const getDemo03CoursePage = async (params) => {
  return await request.get({ url: `/infra/demo03-student/demo03-course/page`, params })
}
// Add student courses
export const createDemo03Course = async (data) => {
  return await request.post({ url: `/infra/demo03-student/demo03-course/create`, data })
}

// Modify student courses
export const updateDemo03Course = async (data) => {
  return await request.put({ url: `/infra/demo03-student/demo03-course/update`, data })
}

// Delete student courses
export const deleteDemo03Course = async (id: number) => {
  return await request.delete({ url: `/infra/demo03-student/demo03-course/delete?id=` + id })
}

// Get student courses
export const getDemo03Course = async (id: number) => {
  return await request.get({ url: `/infra/demo03-student/demo03-course/get?id=` + id })
}

// ==================== Sub table（Student Class） ====================

// Get student class pagination
export const getDemo03GradePage = async (params) => {
  return await request.get({ url: `/infra/demo03-student/demo03-grade/page`, params })
}
// Add new student classes
export const createDemo03Grade = async (data) => {
  return await request.post({ url: `/infra/demo03-student/demo03-grade/create`, data })
}

// Modify student class
export const updateDemo03Grade = async (data) => {
  return await request.put({ url: `/infra/demo03-student/demo03-grade/update`, data })
}

// Delete student class
export const deleteDemo03Grade = async (id: number) => {
  return await request.delete({ url: `/infra/demo03-student/demo03-grade/delete?id=` + id })
}

// Get student class
export const getDemo03Grade = async (id: number) => {
  return await request.get({ url: `/infra/demo03-student/demo03-grade/get?id=` + id })
}
