import request from '@/config/axios'

export type CodegenTableVO = {
  id: number
  tableId: number
  isParentMenuIdValid: boolean
  dataSourceConfigId: number
  scene: number
  tableName: string
  tableComment: string
  remark: string
  moduleName: string
  businessName: string
  className: string
  classComment: string
  author: string
  createTime: Date
  updateTime: Date
  templateType: number
  parentMenuId: number
}

export type CodegenColumnVO = {
  id: number
  tableId: number
  columnName: string
  dataType: string
  columnComment: string
  nullable: number
  primaryKey: number
  ordinalPosition: number
  javaType: string
  javaField: string
  dictType: string
  example: string
  createOperation: number
  updateOperation: number
  listOperation: number
  listOperationCondition: string
  listOperationResult: number
  htmlType: string
}

export type DatabaseTableVO = {
  name: string
  comment: string
}

export type CodegenDetailVO = {
  table: CodegenTableVO
  columns: CodegenColumnVO[]
}

export type CodegenPreviewVO = {
  filePath: string
  code: string
}

export type CodegenUpdateReqVO = {
  table: CodegenTableVO | any
  columns: CodegenColumnVO[]
}

export type CodegenCreateListReqVO = {
  dataSourceConfigId: number
  tableNames: string[]
}

// Query list code to generate table definition
export const getCodegenTableList = (dataSourceConfigId: number) => {
  return request.get({ url: '/infra/codegen/table/list?dataSourceConfigId=' + dataSourceConfigId })
}

// Query list code to generate table definition
export const getCodegenTablePage = (params: PageParam) => {
  return request.get({ url: '/infra/codegen/table/page', params })
}

// Query details code generation table definition
export const getCodegenTable = (id: number) => {
  return request.get({ url: '/infra/codegen/detail?tableId=' + id })
}

// Add code generation table definition
export const createCodegenTable = (data: CodegenCreateListReqVO) => {
  return request.post({ url: '/infra/codegen/create', data })
}

// Modify the code generation table definition
export const updateCodegenTable = (data: CodegenUpdateReqVO) => {
  return request.put({ url: '/infra/codegen/update', data })
}

// Table structure based on database，Table and field definitions for synchronizing databases
export const syncCodegenFromDB = (id: number) => {
  return request.put({ url: '/infra/codegen/sync-from-db?tableId=' + id })
}

// Preview generated code
export const previewCodegen = (id: number) => {
  return request.get({ url: '/infra/codegen/preview?tableId=' + id })
}

// Download and generate code
export const downloadCodegen = (id: number) => {
  return request.download({ url: '/infra/codegen/download?tableId=' + id })
}

// Get table definition
export const getSchemaTableList = (params) => {
  return request.get({ url: '/infra/codegen/db/table/list', params })
}

// Table structure based on database，Create table definition for code generator
export const createCodegenList = (data) => {
  return request.post({ url: '/infra/codegen/create-list', data })
}

// Delete code generation table definition
export const deleteCodegenTable = (id: number) => {
  return request.delete({ url: '/infra/codegen/delete?tableId=' + id })
}
