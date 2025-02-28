import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { dateFormatter } from '@/utils/formatTime'
const { t } = useI18n() // internationalization

// Form verification
export const rules = reactive({
  mail: [
    { required: true, message: t('profile.rules.mail'), trigger: 'blur' },
    {
      type: 'email',
      message: t('profile.rules.truemail'),
      trigger: ['blur', 'change']
    }
  ],
  username: [required],
  password: [required],
  host: [required],
  port: [required],
  sslEnable: [required],
  starttlsEnable: [required]
})

// CrudSchema
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: 'Email',
    field: 'mail',
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
    label: 'Username',
    field: 'username',
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
    label: 'Password',
    field: 'password',
    isTable: false
  },
  {
    label: 'SMTP Server Domain Name',
    field: 'host'
  },
  {
    label: 'SMTP Server Port',
    field: 'port',
    form: {
      component: 'InputNumber',
      value: 465
    }
  },
  {
    label: 'Enabled SSL',
    field: 'sslEnable',
    dictType: DICT_TYPE.INFRA_BOOLEAN_STRING,
    dictClass: 'boolean',
    form: {
      component: 'Radio'
    }
  },
  {
    label: 'Enabled STARTTLS',
    field: 'starttlsEnable',
    dictType: DICT_TYPE.INFRA_BOOLEAN_STRING,
    dictClass: 'boolean',
    form: {
      component: 'Radio'
    }
  },
  {
    label: 'Create Time',
    field: 'createTime',
    isForm: false,
    formatter: dateFormatter,
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: 'Operation',
    field: 'action',
    isForm: false,
    isDetail: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)
