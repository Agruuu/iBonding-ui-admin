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

// Get a list of student courses
export const getDemo03CourseListByStudentId = async (studentId) => {
  return await request.get({
    url: `/infra/demo03-student/demo03-course/list-by-student-id?studentId=` + studentId
  })
}

// ==================== Sub table（Student Class） ====================

// Get student class
export const getDemo03GradeByStudentId = async (studentId) => {
  return await request.get({
    url: `/infra/demo03-student/demo03-grade/get-by-student-id?studentId=` + studentId
  })
}
