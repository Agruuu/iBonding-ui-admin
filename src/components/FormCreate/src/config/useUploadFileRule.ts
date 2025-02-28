import { generateUUID } from '@/utils'
import { localeProps, makeRequiredRule } from '@/components/FormCreate/src/utils'

export const useUploadFileRule = () => {
  const label = 'File Upload'
  const name = 'UploadFile'
  return {
    icon: 'icon-upload',
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
          field: 'fileType',
          title: 'File Type',
          value: ['doc', 'xls', 'ppt', 'txt', 'pdf'],
          options: [
            { label: 'doc', value: 'doc' },
            { label: 'xls', value: 'xls' },
            { label: 'ppt', value: 'ppt' },
            { label: 'txt', value: 'txt' },
            { label: 'pdf', value: 'pdf' }
          ],
          props: {
            multiple: true
          }
        },
        {
          type: 'switch',
          field: 'autoUpload',
          title: 'Do you want to upload files immediately after selecting them',
          value: true
        },
        {
          type: 'switch',
          field: 'drag',
          title: 'Drag Upload',
          value: false
        },
        {
          type: 'switch',
          field: 'isShowTip',
          title: 'Is Show Tip',
          value: true
        },
        {
          type: 'inputNumber',
          field: 'fileSize',
          title: 'Size Limit(MB)',
          value: 5,
          props: { min: 0 }
        },
        {
          type: 'inputNumber',
          field: 'limit',
          title: 'Limit',
          value: 5,
          props: { min: 0 }
        },
        {
          type: 'switch',
          field: 'disabled',
          title: 'Disabled',
          value: false
        }
      ])
    }
  }
}
