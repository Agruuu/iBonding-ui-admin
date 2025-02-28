<template>
  <Dialog v-model="dialogVisible" title="Test">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-form-item label="Content" prop="content">
        <el-input
          v-model="formData.content"
          placeholder="Please enter the template content"
          readonly
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="Mobile" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="Please enter your phone number" />
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
import * as SmsTemplateApi from '@/api/system/sms/smsTemplate'

defineOptions({ name: 'SystemSmsTemplateSendForm' })

const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled

// Sending SMS forms related
const formData = ref({
  content: '',
  params: {},
  mobile: '',
  templateCode: '',
  templateParams: new Map()
})
const formRules = reactive({
  mobile: [{ required: true, message: 'Mobile phone cannot be empty', trigger: 'blur' }],
  templateCode: [{ required: true, message: 'Template code cannot be empty', trigger: 'blur' }],
  templateParams: {}
})
const formRef = ref() // form  Ref

const open = async (id: number) => {
  dialogVisible.value = true
  resetForm()
  // Set data
  formLoading.value = true
  try {
    const data = await SmsTemplateApi.getSmsTemplate(id)
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
    const data = formData.value as SmsTemplateApi.SendSmsReqVO
    const logId = await SmsTemplateApi.sendSms(data)
    if (logId) {
      message.success('Submitted and sent successfully！Send results，See the sending log number: ' + logId)
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
    mobile: '',
    templateCode: '',
    templateParams: new Map()
  }
  formRef.value?.resetFields()
}
</script>
