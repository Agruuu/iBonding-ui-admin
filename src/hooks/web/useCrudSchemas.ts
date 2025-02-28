import { reactive } from 'vue'
import { AxiosPromise } from 'axios'
import { findIndex } from '@/utils'
import { eachTree, filter, treeMap } from '@/utils/tree'
import { getBoolDictOptions, getDictOptions, getIntDictOptions } from '@/utils/dict'

import { FormSchema } from '@/types/form'
import { TableColumn } from '@/types/table'
import { DescriptionsSchema } from '@/types/descriptions'
import { ComponentOptions, ComponentProps } from '@/types/components'
import { DictTag } from '@/components/DictTag'
import { cloneDeep, merge } from 'lodash-es'

export type CrudSchema = Omit<TableColumn, 'children'> & {
  isSearch?: boolean // Is it displaying in the query
  search?: CrudSearchParams // Detailed configuration of query
  isTable?: boolean // Is it displayed in the list
  table?: CrudTableParams // Detailed configuration of the list
  isForm?: boolean // Is it displayed on the form
  form?: CrudFormParams // Detailed configuration of forms
  isDetail?: boolean // Is it displayed in the details
  detail?: CrudDescriptionsParams // Detailed configuration of details
  children?: CrudSchema[]
  dictType?: string // Dictionary type
  dictClass?: 'string' | 'number' | 'boolean' // Dictionary data type string | number | boolean
}

type CrudSearchParams = {
  // Is it displayed in the query item
  show?: boolean
  // Interface
  api?: () => Promise<any>
  // Search Fields
  field?: string
} & Omit<FormSchema, 'field'>

type CrudTableParams = {
  // Display header or not
  show?: boolean
  // Column width configuration
  width?: number | string
  // Is the column fixed on the left or right side
  fixed?: 'left' | 'right'
} & Omit<FormSchema, 'field'>
type CrudFormParams = {
  // Whether to display form items
  show?: boolean
  // Interface
  api?: () => Promise<any>
} & Omit<FormSchema, 'field'>

type CrudDescriptionsParams = {
  // Whether to display form items
  show?: boolean
} & Omit<DescriptionsSchema, 'field'>

interface AllSchemas {
  searchSchema: FormSchema[]
  tableColumns: TableColumn[]
  formSchema: FormSchema[]
  detailSchema: DescriptionsSchema[]
}

const { t } = useI18n()

// Filter all structures
export const useCrudSchemas = (
  crudSchema: CrudSchema[]
): {
  allSchemas: AllSchemas
} => {
  // All structural data
  const allSchemas = reactive<AllSchemas>({
    searchSchema: [],
    tableColumns: [],
    formSchema: [],
    detailSchema: []
  })

  const searchSchema = filterSearchSchema(crudSchema, allSchemas)
  allSchemas.searchSchema = searchSchema || []

  const tableColumns = filterTableSchema(crudSchema)
  allSchemas.tableColumns = tableColumns || []

  const formSchema = filterFormSchema(crudSchema, allSchemas)
  allSchemas.formSchema = formSchema

  const detailSchema = filterDescriptionsSchema(crudSchema)
  allSchemas.detailSchema = detailSchema

  return {
    allSchemas
  }
}

// filter Search structure
const filterSearchSchema = (crudSchema: CrudSchema[], allSchemas: AllSchemas): FormSchema[] => {
  const searchSchema: FormSchema[] = []

  // Retrieve dictionary list queue
  const searchRequestTask: Array<() => Promise<void>> = []
  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // Determine whether to display
    if (schemaItem?.isSearch || schemaItem.search?.show) {
      let component = schemaItem?.search?.component || 'Input'
      const options: ComponentOptions[] = []
      let comonentProps: ComponentProps = {}
      if (schemaItem.dictType) {
        const allOptions: ComponentOptions = { label: 'All', value: '' }
        options.push(allOptions)
        getDictOptions(schemaItem.dictType).forEach((dict) => {
          options.push(dict)
        })
        comonentProps = {
          options: options
        }
        if (!schemaItem.search?.component) component = 'Select'
      }

      // updated by Agruuu: The issue that form events cannot be triggered when using the default `dict` option has been resolved.
      const searchSchemaItem = merge(
        {
          // Default is input
          component,
          ...schemaItem.search,
          field: schemaItem.field,
          label: schemaItem.search?.label || schemaItem.label
        },
        { componentProps: comonentProps }
      )
      if (searchSchemaItem.api) {
        searchRequestTask.push(async () => {
          const res = await (searchSchemaItem.api as () => AxiosPromise)()
          if (res) {
            const index = findIndex(allSchemas.searchSchema, (v: FormSchema) => {
              return v.field === searchSchemaItem.field
            })
            if (index !== -1) {
              allSchemas.searchSchema[index]!.componentProps!.options = filterOptions(
                res,
                searchSchemaItem.componentProps.optionsAlias?.labelField
              )
            }
          }
        })
      }
      // Delete unnecessary fields
      delete searchSchemaItem.show

      searchSchema.push(searchSchemaItem)
    }
  })
  for (const task of searchRequestTask) {
    task()
  }
  return searchSchema
}

// filter table structure
const filterTableSchema = (crudSchema: CrudSchema[]): TableColumn[] => {
  const tableColumns = treeMap<CrudSchema>(crudSchema, {
    conversion: (schema: CrudSchema) => {
      if (schema?.isTable !== false && schema?.table?.show !== false) {
        // add by Agruuu：Add support for dictionary data of the `dict` type.
        if (!schema.formatter && schema.dictType) {
          schema.formatter = (_: Recordable, __: TableColumn, cellValue: any) => {
            return h(DictTag, {
              type: schema.dictType!, // ! It means it must not be empty
              value: cellValue
            })
          }
        }
        return {
          ...schema.table,
          ...schema
        }
      }
    }
  })

  // There will be `undefined` values in the first filtering, so a second filtering is required.
  return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
    if (data.children === void 0) {
      delete data.children
    }
    return !!data.field
  })
}

// filter form structure
const filterFormSchema = (crudSchema: CrudSchema[], allSchemas: AllSchemas): FormSchema[] => {
  const formSchema: FormSchema[] = []

  // Retrieve dictionary list queue
  const formRequestTask: Array<() => Promise<void>> = []

  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // Determine whether to display
    if (schemaItem?.isForm !== false && schemaItem?.form?.show !== false) {
      let component = schemaItem?.form?.component || 'Input'
      let defaultValue: any = ''
      if (schemaItem.form?.value) {
        defaultValue = schemaItem.form?.value
      } else {
        if (component === 'InputNumber') {
          defaultValue = 0
        }
      }
      let comonentProps: ComponentProps = {}
      if (schemaItem.dictType) {
        const options: ComponentOptions[] = []
        if (schemaItem.dictClass && schemaItem.dictClass === 'number') {
          getIntDictOptions(schemaItem.dictType).forEach((dict) => {
            options.push(dict)
          })
        } else if (schemaItem.dictClass && schemaItem.dictClass === 'boolean') {
          getBoolDictOptions(schemaItem.dictType).forEach((dict) => {
            options.push(dict)
          })
        } else {
          getDictOptions(schemaItem.dictType).forEach((dict) => {
            options.push(dict)
          })
        }
        comonentProps = {
          options: options
        }
        if (!(schemaItem.form && schemaItem.form.component)) component = 'Select'
      }

      // updated by Agruuu: The issue that form events cannot be triggered when using the default `dict` option has been resolved.
      const formSchemaItem = merge(
        {
          // Default is input
          component,
          value: defaultValue,
          ...schemaItem.form,
          field: schemaItem.field,
          label: schemaItem.form?.label || schemaItem.label
        },
        { componentProps: comonentProps }
      )

      if (formSchemaItem.api) {
        formRequestTask.push(async () => {
          const res = await (formSchemaItem.api as () => AxiosPromise)()
          if (res) {
            const index = findIndex(allSchemas.formSchema, (v: FormSchema) => {
              return v.field === formSchemaItem.field
            })
            if (index !== -1) {
              allSchemas.formSchema[index]!.componentProps!.options = filterOptions(
                res,
                formSchemaItem.componentProps.optionsAlias?.labelField
              )
            }
          }
        })
      }

      // Delete unnecessary fields
      delete formSchemaItem.show

      formSchema.push(formSchemaItem)
    }
  })

  for (const task of formRequestTask) {
    task()
  }
  return formSchema
}

// filter descriptions structure
const filterDescriptionsSchema = (crudSchema: CrudSchema[]): DescriptionsSchema[] => {
  const descriptionsSchema: FormSchema[] = []

  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // Determine whether to display
    if (schemaItem?.isDetail !== false && schemaItem.detail?.show !== false) {
      const descriptionsSchemaItem = {
        ...schemaItem.detail,
        field: schemaItem.field,
        label: schemaItem.detail?.label || schemaItem.label
      }
      if (schemaItem.dictType) {
        descriptionsSchemaItem.dictType = schemaItem.dictType
      }
      if (schemaItem.detail?.dateFormat || schemaItem.formatter == 'formatDate') {
        // Use the configuration under `detail` preferentially. If it's not available, the default format is `YYYY-MM-DD HH:mm:ss`.
        descriptionsSchemaItem.dateFormat = schemaItem?.detail?.dateFormat
          ? schemaItem?.detail?.dateFormat
          : 'YYYY-MM-DD HH:mm:ss'
      }

      // Delete unnecessary fields
      delete descriptionsSchemaItem.show

      descriptionsSchema.push(descriptionsSchemaItem)
    }
  })

  return descriptionsSchema
}

// Add internationalization support to the `options`.
const filterOptions = (options: Recordable, labelField?: string) => {
  return options?.map((v: Recordable) => {
    if (labelField) {
      v['labelField'] = t(v.labelField)
    } else {
      v['label'] = t(v.label)
    }
    return v
  })
}

// Move the specified `fields` in `tableColumns` to the front.
export const sortTableColumns = (tableColumns: TableColumn[], field: string) => {
  const fieldIndex = tableColumns.findIndex((item) => item.field === field)
  const fieldColumn = cloneDeep(tableColumns[fieldIndex])
  tableColumns.splice(fieldIndex, 1)
  // Add to beginning
  tableColumns.unshift(fieldColumn)
}
