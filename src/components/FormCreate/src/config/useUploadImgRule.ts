import { generateUUID } from '@/utils'
import { localeProps, makeRequiredRule } from '@/components/FormCreate/src/utils'

export const useUploadImgRule = () => {
  const label = 'Single Image Upload'
  const name = 'UploadImg'
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
          type: 'switch',
          field: 'drag',
          title: 'Drag Upload',
          value: false
        },
        {
          type: 'select',
          field: 'fileType',
          title: 'Image Type Restrictions',
          value: ['image/jpeg', 'image/png', 'image/gif'],
          options: [
            { label: 'image/apng', value: 'image/apng' },
            { label: 'image/bmp', value: 'image/bmp' },
            { label: 'image/gif', value: 'image/gif' },
            { label: 'image/jpeg', value: 'image/jpeg' },
            { label: 'image/pjpeg', value: 'image/pjpeg' },
            { label: 'image/svg+xml', value: 'image/svg+xml' },
            { label: 'image/tiff', value: 'image/tiff' },
            { label: 'image/webp', value: 'image/webp' },
            { label: 'image/x-icon', value: 'image/x-icon' }
          ],
          props: {
            multiple: true
          }
        },
        {
          type: 'inputNumber',
          field: 'fileSize',
          title: 'Size Limit(MB)',
          value: 5,
          props: { min: 0 }
        },
        {
          type: 'input',
          field: 'height',
          title: 'Height',
          value: '150px'
        },
        {
          type: 'input',
          field: 'width',
          title: 'Width',
          value: '150px'
        },
        {
          type: 'input',
          field: 'borderradius',
          title: 'Border Radius',
          value: '8px'
        },
        {
          type: 'switch',
          field: 'disabled',
          title: 'Disabled',
          value: true
        },
        {
          type: 'switch',
          field: 'showBtnText',
          title: 'Show Button Text',
          value: true
        }
      ])
    }
  }
}
