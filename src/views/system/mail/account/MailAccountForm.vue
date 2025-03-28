<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Form ref="formRef" v-loading="formLoading" :rules="rules" :schema="allSchemas.formSchema" />
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as MailAccountApi from '@/api/system/mail/account'
import { allSchemas, rules } from './account.data'

defineOptions({ name: 'SystemMailAccountForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - add；update - modify
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      const data = await MailAccountApi.getMailAccount(id)
      formRef.value.setValues(data)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.getElFormRef().validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    const data = formRef.value.formModel as MailAccountApi.MailAccountVO
    if (formType.value === 'create') {
      await MailAccountApi.createMailAccount(data)
      message.success(t('common.createSuccess'))
    } else {
      await MailAccountApi.updateMailAccount(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // Event of successful sending operation
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
