import type { CSSProperties } from 'vue'
import { ColProps, ComponentProps, ComponentName } from '@/types/components'
import type { AxiosPromise } from 'axios'

export type FormSetPropsType = {
  field: string
  path: string
  value: any
}

export type FormValueType = string | number | string[] | number[] | boolean | undefined | null

export type FormItemProps = {
  labelWidth?: string | number
  required?: boolean
  rules?: Recordable
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  style?: CSSProperties
}

export type FormSchema = {
  // Unique value
  field: string
  // title
  label?: string
  // Tips
  labelMessage?: string
  // colComponent properties
  colProps?: ColProps
  // Regarding the form component properties, `slots` corresponds to the slots of the form component. The naming rule is `${field}-xxx`. You can refer to the ElementPlus documentation for specific details.
  componentProps?: { slots?: Recordable } & ComponentProps
  // formItem component properties
  formItemProps?: FormItemProps
  // Components for rendering
  component?: ComponentName
  // Initial value
  value?: FormValueType
  // Do you want to hide it
  hidden?: boolean
  // Remote loading dropdown menu
  api?: <T = any>() => AxiosPromise<T>
}
