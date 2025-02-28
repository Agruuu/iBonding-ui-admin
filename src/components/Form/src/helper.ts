import type { Slots } from 'vue'
import { getSlot } from '@/utils/tsxHelper'
import { PlaceholderModel } from './types'
import { FormSchema } from '@/types/form'
import { ColProps } from '@/types/components'

/**
 *
 * @param schema Corresponding component data
 * @returns Return prompt information object
 * @description Used for automatic settings placeholder
 */
export const setTextPlaceholder = (schema: FormSchema): PlaceholderModel => {
  const { t } = useI18n()
  const textMap = ['Input', 'Autocomplete', 'InputNumber', 'InputPassword']
  const selectMap = ['Select', 'SelectV2', 'TimePicker', 'DatePicker', 'TimeSelect', 'TimeSelect']
  if (textMap.includes(schema?.component as string)) {
    return {
      placeholder: t('common.inputText') + schema.label
    }
  }
  if (selectMap.includes(schema?.component as string)) {
    // Some range selectors
    const twoTextMap = ['datetimerange', 'daterange', 'monthrange', 'datetimerange', 'daterange']
    if (
      twoTextMap.includes(
        (schema?.componentProps?.type || schema?.componentProps?.isRange) as string
      )
    ) {
      return {
        startPlaceholder: t('common.startTimeText'),
        endPlaceholder: t('common.endTimeText'),
        rangeSeparator: '-'
      }
    } else {
      return {
        placeholder: t('common.selectText') + schema.label
      }
    }
  }
  return {}
}

/**
 *
 * @param col Built in grid
 * @returns Return Grid Attributes
 * @description Merge incoming grid attributes
 */
export const setGridProp = (col: ColProps = {}): ColProps => {
  const colProps: ColProps = {
    // If there is span，Represents higher priority for users，So there is no need for a default grid
    ...(col.span
      ? {}
      : {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12
        }),
    ...col
  }
  return colProps
}

/**
 *
 * @param item Incoming component properties
 * @returns Default Add clearable attribute
 */
export const setComponentProps = (item: FormSchema): Recordable => {
  const notNeedClearable = ['ColorPicker']
  const componentProps: Recordable = notNeedClearable.includes(item.component as string)
    ? { ...item.componentProps }
    : {
        clearable: true,
        ...item.componentProps
      }
  // Additional attributes need to be removed
  delete componentProps?.slots
  return componentProps
}

/**
 *
 * @param slots slot 
 * @param slotsProps Slot Properties
 * @param field Field Name
 */
export const setItemComponentSlots = (
  slots: Slots,
  slotsProps: Recordable = {},
  field: string
): Recordable => {
  const slotObj: Recordable = {}
  for (const key in slotsProps) {
    if (slotsProps[key]) {
      // Due to the possibility of duplicate components，Need a unique prefix
      slotObj[key] = (data: Recordable) => {
        return getSlot(slots, `${field}-${key}`, data)
      }
    }
  }
  return slotObj
}

/**
 *
 * @param schema Form structured array of forms
 * @param formModel FormModel
 * @returns FormModel
 * @description Generate corresponding formModel
 */
export const initModel = (schema: FormSchema[], formModel: Recordable) => {
  const model: Recordable = { ...formModel }
  schema.map((v) => {
    // If it is hidden，Just delete the corresponding value
    if (v.hidden) {
      delete model[v.field]
    } else if (v.component && v.component !== 'Divider') {
      const hasField = Reflect.has(model, v.field)
      // If there was already a value present earlier，No reassignment will be performed，But instead, use the existing values
      model[v.field] = hasField ? model[v.field] : v.value !== void 0 ? v.value : ''
    }
  })
  return model
}

/**
 * @param slots slot 
 * @param field Field Name
 * @returns return FormIiem slot 
 */
export const setFormItemSlots = (slots: Slots, field: string): Recordable => {
  const slotObj: Recordable = {}
  if (slots[`${field}-error`]) {
    slotObj['error'] = (data: Recordable) => {
      return getSlot(slots, `${field}-error`, data)
    }
  }
  if (slots[`${field}-label`]) {
    slotObj['label'] = (data: Recordable) => {
      return getSlot(slots, `${field}-label`, data)
    }
  }
  return slotObj
}
