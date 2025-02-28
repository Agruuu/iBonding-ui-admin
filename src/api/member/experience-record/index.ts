import request from '@/config/axios'

export interface ExperienceRecordVO {
  id: number
  userId: number
  bizId: string
  bizType: number
  title: string
  description: string
  experience: number
  totalExperience: number
}

// Query the list of member experience records
export const getExperienceRecordPage = async (params) => {
  return await request.get({ url: `/member/experience-record/page`, params })
}

// Query member experience record details
export const getExperienceRecord = async (id: number) => {
  return await request.get({ url: `/member/experience-record/get?id=` + id })
}
