import download from '@/utils/download'
import { Table, TableExpose } from '@/components/Table'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import { computed, nextTick, reactive, ref, unref, watch } from 'vue'
import type { TableProps } from '@/components/Table/src/types'

import { TableSetPropsType } from '@/types/table'

const { t } = useI18n()
interface ResponseType<T = any> {
  list: T[]
  total?: number
}

interface UseTableConfig<T = any> {
  getListApi: (option: any) => Promise<T>
  delListApi?: (option: any) => Promise<T>
  exportListApi?: (option: any) => Promise<T>
  // Return data format configuration
  response?: ResponseType
  // Default parameters passed
  defaultParams?: Recordable
  props?: TableProps
}

interface TableObject<T = any> {
  pageSize: number
  currentPage: number
  total: number
  tableList: T[]
  params: any
  loading: boolean
  exportLoading: boolean
  currentRow: Nullable<T>
}

export const useTable = <T = any>(config?: UseTableConfig<T>) => {
  const tableObject = reactive<TableObject<T>>({
    // the number of pages
    pageSize: 10,
    // Current page
    currentPage: 1,
    // Total number of articles
    total: 10,
    // Table data
    tableList: [],
    // AxiosConfig config
    params: {
      ...(config?.defaultParams || {})
    },
    // Loading in progress
    loading: true,
    // Exporting and loading in progress
    exportLoading: false,
    // The data of the current row
    currentRow: null
  })

  const paramsObj = computed(() => {
    return {
      ...tableObject.params,
      pageSize: tableObject.pageSize,
      pageNo: tableObject.currentPage
    }
  })

  watch(
    () => tableObject.currentPage,
    () => {
      methods.getList()
    }
  )

  watch(
    () => tableObject.pageSize,
    () => {
      // When the current page is not 1, modifying the page number will cause the `getList` method to be called multiple times.
      if (tableObject.currentPage === 1) {
        methods.getList()
      } else {
        tableObject.currentPage = 1
        methods.getList()
      }
    }
  )

  // Table instance
  const tableRef = ref<typeof Table & TableExpose>()

  // ElTable instance
  const elTableRef = ref<ComponentRef<typeof ElTable>>()

  const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
    tableRef.value = ref
    elTableRef.value = elRef
  }

  const getTable = async () => {
    await nextTick()
    const table = unref(tableRef)
    if (!table) {
      console.error('The table is not registered. Please use the register method to register')
    }
    return table
  }

  const delData = async (ids: string | number | string[] | number[]) => {
    let idsLength = 1
    if (ids instanceof Array) {
      idsLength = ids.length
      await Promise.all(
        ids.map(async (id: string | number) => {
          await (config?.delListApi && config?.delListApi(id))
        })
      )
    } else {
      await (config?.delListApi && config?.delListApi(ids))
    }
    ElMessage.success(t('common.delSuccess'))

    // Calculate the critical point
    tableObject.currentPage =
      tableObject.total % tableObject.pageSize === idsLength || tableObject.pageSize === 1
        ? tableObject.currentPage > 1
          ? tableObject.currentPage - 1
          : tableObject.currentPage
        : tableObject.currentPage
    await methods.getList()
  }

  const methods = {
    getList: async () => {
      tableObject.loading = true
      const res = await config?.getListApi(unref(paramsObj)).finally(() => {
        tableObject.loading = false
      })
      if (res) {
        tableObject.tableList = (res as unknown as ResponseType).list
        tableObject.total = (res as unknown as ResponseType).total ?? 0
      }
    },
    setProps: async (props: TableProps = {}) => {
      const table = await getTable()
      table?.setProps(props)
    },
    setColumn: async (columnProps: TableSetPropsType[]) => {
      const table = await getTable()
      table?.setColumn(columnProps)
    },
    getSelections: async () => {
      const table = await getTable()
      return (table?.selections || []) as T[]
    },
    // With Search component combination
    setSearchParams: (data: Recordable) => {
      tableObject.params = Object.assign(tableObject.params, {
        pageSize: tableObject.pageSize,
        pageNo: 1,
        ...data
      })
      // Page numbers are not equal to1Update page numbers to retrieve data again，Page number is equal to1Retrieve data again
      if (tableObject.currentPage !== 1) {
        tableObject.currentPage = 1
      } else {
        methods.getList()
      }
    },
    // Delete data
    delList: async (
      ids: string | number | string[] | number[],
      multiple: boolean,
      message = true
    ) => {
      const tableRef = await getTable()
      if (multiple) {
        if (!tableRef?.selections.length) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      }
      if (message) {
        ElMessageBox.confirm(t('common.delMessage'), t('common.confirmTitle'), {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }).then(async () => {
          await delData(ids)
        })
      } else {
        await delData(ids)
      }
    },
    // Export List
    exportList: async (fileName: string) => {
      tableObject.exportLoading = true
      ElMessageBox.confirm(t('common.exportMessage'), t('common.confirmTitle'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await config?.exportListApi?.(unref(paramsObj) as unknown as T)
          if (res) {
            download.excel(res as unknown as Blob, fileName)
          }
        })
        .finally(() => {
          tableObject.exportLoading = false
        })
    }
  }

  config?.props && methods.setProps(config.props)

  return {
    register,
    elTableRef,
    tableObject,
    methods,
    // add by Agruuu：Return the `tableMethods` property to make it more consistent with the `tableObject`.
    tableMethods: methods
  }
}
