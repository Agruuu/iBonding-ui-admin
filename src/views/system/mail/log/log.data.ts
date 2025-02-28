import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { dateFormatter } from '@/utils/formatTime'
import * as MailAccountApi from '@/api/system/mail/account'

// List of email accounts
const accountList = await MailAccountApi.getSimpleMailAccountList()

// CrudSchema
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: 'ID',
    field: 'id'
  },
  {
    label: 'Send Time',
    field: 'sendTime',
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
    },
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: 'Receiving Email',
    field: 'toMail'
  },
  {
    label: 'User ID',
    field: 'userId',
    isSearch: true,
    isTable: false,
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: 'User Type',
    field: 'userType',
    dictType: DICT_TYPE.USER_TYPE,
    dictClass: 'number',
    isSearch: true,
    isTable: false,
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: 'Email Title',
    field: 'templateTitle'
  },
  {
    label: 'Email Content',
    field: 'templateContent',
    isTable: false
  },
  {
    label: 'Email Parameters',
    field: 'templateParams',
    isTable: false
  },
  {
    label: 'Send Status',
    field: 'sendStatus',
    dictType: DICT_TYPE.SYSTEM_MAIL_SEND_STATUS,
    dictClass: 'string',
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
    label: 'Email Account',
    field: 'accountId',
    isTable: false,
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
    }
  },
  {
    label: 'Send Email Address',
    field: 'fromMail',
    table: {
      label: 'Email Account'
    }
  },
  {
    label: 'Template ID',
    field: 'templateId',
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
    label: 'Template Code',
    field: 'templateCode',
    isTable: false
  },
  {
    label: 'Template Sender Name',
    field: 'templateNickname',
    isTable: false
  },
  {
    label: 'Send And Return Message ID',
    field: 'sendMessageId',
    isTable: false
  },
  {
    label: 'Send Exception',
    field: 'sendException',
    isTable: false
  },
  {
    label: 'Create Time',
    field: 'createTime',
    isTable: false,
    formatter: dateFormatter,
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: 'Operation',
    field: 'action',
    isDetail: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)
