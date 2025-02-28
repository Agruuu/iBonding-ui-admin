export interface DescriptionsSchema {
  span?: number // What percentage does it account for
  field: string // Field Name
  label?: string // labelname
  mappedField?: string // Field Mapping
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  labelAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  dateFormat?: string // Support time formatting
  dictType?: string // support dict dictionary data
}
