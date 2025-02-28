<template>
  <Dialog v-model="dialogVisible" title="Test">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="Template Content" prop="content">
        <Editor :model-value="formData.content" height="150px" readonly />
      </el-form-item>
      <el-form-item label="Receiving Email" prop="mail">
        <el-input v-model="formData.mail" placeholder="Please enter the recipient email address" />
      </el-form-item>
      <el-form-item
        v-for="param in formData.params"
        :key="param"
        :label="'Parameter {' + param + '}'"
        :prop="'templateParams.' + param"
      >
        <el-input
          v-model="formData.templateParams[param]"
          :placeholder="'Please enter ' + param + ' parameter'"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as MailTemplateApi from '@/api/system/mail/template'

defineOptions({ name: 'SystemMailTemplateSendForm' })

const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  content: '',
  params: {},
  mail: '',
  templateCode: '',
  templateParams: new Map()
})
const formRules = reactive({
  mail: [{ required: true, message: 'Email cannot be empty', trigger: 'blur' }],
  templateCode: [{ required: true, message: 'Template code cannot be empty', trigger: 'blur' }],
  templateParams: {}
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  resetForm()
  // Set data
  formLoading.value = true
  try {
    const data = await MailTemplateApi.getMailTemplate(id)
    // Set up dynamic forms
    formData.value.content = data.content
    formData.value.params = data.params
    formData.value.templateCode = data.code
    formData.value.templateParams = data.params.reduce((obj, item) => {
      obj[item] = '' // Assign values to each dynamic attribute，Avoiding unreadable issues
      return obj
    }, {})
    formRules.templateParams = data.params.reduce((obj, item) => {
      obj[item] = { required: true, message: 'parameter ' + item + ' cannot be empty', trigger: 'blur' }
      return obj
    }, {})
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value as MailTemplateApi.MailSendReqVO
    const logId = await MailTemplateApi.sendMail(data)
    if (logId) {
      message.success('The submission and sending were successful! For the sending result, refer to the sending log number:' + logId)
    }
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** Reset Form  */
const resetForm = () => {
  formData.value = {
    content: '',
    params: {},
    mail: '',
    templateCode: '',
    templateParams: new Map()
  }
  formRules.templateParams = {}
  formRef.value?.resetFields()
}
</script>
