import { generateUUID } from '@/utils'
import * as DictDataApi from '@/api/system/dict/dict.type'
import { localeProps, makeRequiredRule } from '@/components/FormCreate/src/utils'
import { selectRule } from '@/components/FormCreate/src/config/selectRule'
import { cloneDeep } from 'lodash-es'

/**
 * Dictionary selector rules，If the rule uses dynamic data, it needs to be configured separately and cannot be used useSelectRule
 */
export const useDictSelectRule = () => {
  const label = 'Dictionary Selector'
  const name = 'DictSelect'
  const rules = cloneDeep(selectRule)
  const dictOptions = ref<{ label: string; value: string }[]>([]) // Dictionary type dropdown data
  onMounted(async () => {
    const data = await DictDataApi.getSimpleDictTypeList()
    if (!data || data.length === 0) {
      return
    }
    dictOptions.value =
      data?.map((item: DictDataApi.DictTypeVO) => ({
        label: item.name,
        value: item.type
      })) ?? []
  })
  return {
    icon: 'icon-doc-text',
    label,
    name,
    rule() {
      return {
        type: name,
        field: generateUUID(),
        title: label,
        info: '',
        $required: false
      }
    },
    props(_, { t }) {
      return localeProps(t, name + '.props', [
        makeRequiredRule(),
        {
          type: 'select',
          field: 'dictType',
          title: 'Dictionary Type',
          value: '',
          options: dictOptions.value
        },
        {
          type: 'select',
          field: 'valueType',
          title: 'Dictionary Value Type',
          value: 'str',
          options: [
            { label: 'Integer', value: 'int' },
            { label: 'String', value: 'str' },
            { label: 'Boolean', value: 'bool' }
          ]
        },
        ...rules
      ])
    }
  }
}
