<script lang="ts" setup>
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'

import { useForm } from '@/hooks/web/useForm'
import { findIndex } from '@/utils'
import { cloneDeep } from 'lodash-es'
import { FormSchema } from '@/types/form'

defineOptions({ name: 'Search' })

const { t } = useI18n()

const props = defineProps({
  // Generate an array for the layout structure of the form.
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // Do you need a grid layout
  isCol: propTypes.bool.def(false),
  // form label width
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  // Style and position of operation buttons
  layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('inline'),
  // Alignment of bottom buttons
  buttomPosition: propTypes.string
    .validate((v: string) => ['left', 'center', 'right'].includes(v))
    .def('center'),
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  // Whether to display expansion and contraction
  expand: propTypes.bool.def(false),
  // Scalable boundary field
  expandField: propTypes.string.def(''),
  inline: propTypes.bool.def(true),
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  }
})

const emit = defineEmits(['search', 'reset'])

const visible = ref(true)

const newSchema = computed(() => {
  let schema: FormSchema[] = cloneDeep(props.schema)
  if (props.expand && props.expandField && !unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.field === props.expandField)
    if (index > -1) {
      const length = schema.length
      schema.splice(index + 1, length)
    }
  }
  if (props.layout === 'inline') {
    schema = schema.concat([
      {
        field: 'action',
        formItemProps: {
          labelWidth: '0px'
        }
      }
    ])
  }
  return schema
})

const { register, elFormRef, methods } = useForm({
  model: props.model || {}
})

const search = async () => {
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      const { getFormData } = methods
      const model = await getFormData()
      emit('search', model)
    }
  })
}

const reset = async () => {
  unref(elFormRef)?.resetFields()
  const { getFormData } = methods
  const model = await getFormData()
  emit('reset', model)
}

const bottonButtonStyle = computed(() => {
  return {
    textAlign: props.buttomPosition as unknown as 'left' | 'center' | 'right'
  }
})

const setVisible = () => {
  unref(elFormRef)?.resetFields()
  visible.value = !unref(visible)
}
</script>

<template>
  <!-- update by Agruuu：class="-mb-15px" It is used to reduce the bottom distance from the `ContentWrap` component and avoid an overly large gap. -->
  <Form
    :inline="inline"
    :is-col="isCol"
    :is-custom="false"
    :label-width="labelWidth"
    :schema="newSchema"
    class="-mb-15px"
    hide-required-asterisk
    @register="register"
  >
    <template #action>
      <div v-if="layout === 'inline'">
        <!-- update by Agruuu：Remove the `type="primary"` attribute from the search element to make the color lighter. -->
        <ElButton v-if="showSearch" @click="search">
          <Icon class="mr-5px" icon="ep:search" />
          {{ t('common.query') }}
        </ElButton>
        <!-- update by Agruuu：Change `icon="ep:refresh-right"` to `icon="ep:refresh"`  -->
        <ElButton v-if="showReset" @click="reset">
          <Icon class="mr-5px" icon="ep:refresh" />
          {{ t('common.reset') }}
        </ElButton>
        <ElButton v-if="expand" text @click="setVisible">
          {{ t(visible ? 'common.shrink' : 'common.expand') }}
          <Icon :icon="visible ? 'ep:arrow-up' : 'ep:arrow-down'" />
        </ElButton>
        <!-- add by Agruuu：Add button after search -->
        <slot name="actionMore"></slot>
      </div>
    </template>
    <template v-for="name in Object.keys($slots)" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </Form>

  <template v-if="layout === 'bottom'">
    <div :style="bottonButtonStyle">
      <ElButton v-if="showSearch" type="primary" @click="search">
        <Icon class="mr-5px" icon="ep:search" />
        {{ t('common.query') }}
      </ElButton>
      <ElButton v-if="showReset" @click="reset">
        <Icon class="mr-5px" icon="ep:refresh-right" />
        {{ t('common.reset') }}
      </ElButton>
      <ElButton v-if="expand" text @click="setVisible">
        {{ t(visible ? 'common.shrink' : 'common.expand') }}
        <Icon :icon="visible ? 'ep:arrow-up' : 'ep:arrow-down'" />
      </ElButton>
      <!-- add by Agruuu：Add button after search -->
      <slot name="actionMore"></slot>
    </div>
  </template>
</template>
