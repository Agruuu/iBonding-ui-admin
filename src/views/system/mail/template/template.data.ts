import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { dateFormatter } from '@/utils/formatTime'
import { TableColumn } from '@/types/table'
import * as MailAccountApi from '@/api/system/mail/account'

// List of email accounts
const accountList = await MailAccountApi.getSimpleMailAccountList()

// Form verification
export const rules = reactive({
  name: [required],
  code: [required],
  accountId: [required],
  label: [required],
  content: [required],
  params: [required],
  status: [required]
})

// CrudSchema
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: 'Template Code',
    field: 'code',
    isSearch: true,
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: 'Template Name',
    field: 'name',
    isSearch: true,
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: 'Template Title',
    field: 'title'
  },
  {
    label: 'Template Content',
    field: 'content',
    form: {
      component: 'Editor',
      componentProps: {
        valueHtml: '',
        height: 200
      }
    }
  },
  {
    label: 'Email Account',
    field: 'accountId',
    width: '200px',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return accountList.find((account) => account.id === cellValue)?.mail
    },
    search: {
      show: true,
      component: 'Select',
      api: () => accountList,
      componentProps: {
        optionsAlias: {
          labelField: 'mail',
          valueField: 'id'
        },
        style: {
          width: '240px'
        }
      }
    },
    form: {
      component: 'Select',
      api: () => accountList,
      componentProps: {
        optionsAlias: {
          labelField: 'mail',
          valueField: 'id'
        }
      }
    }
  },
  {
    label: 'Sender Name',
    field: 'nickname'
  },
  {
    label: 'Open status',
    field: 'status',
    isSearch: true,
    dictType: DICT_TYPE.COMMON_STATUS,
    dictClass: 'number',
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: 'Remarks',
    field: 'remark',
    isTable: false
  },
  {
    label: 'Create Time',
    field: 'createTime',
    isForm: false,
    formatter: dateFormatter,
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'daterange',
        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: 'Operation',
    field: 'action',
    isForm: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)
