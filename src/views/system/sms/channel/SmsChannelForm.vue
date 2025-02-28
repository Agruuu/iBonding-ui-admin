<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="Signature" prop="signature">
        <el-input v-model="formData.signature" placeholder="Please enter your SMS signature" />
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-select v-model="formData.code" clearable placeholder="Please select channel code">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Remarks" prop="remark">
        <el-input v-model="formData.remark" placeholder="Please enter remark" />
      </el-form-item>
      <el-form-item label="API Key" prop="apiKey">
        <el-input v-model="formData.apiKey" placeholder="Please enter SMS API Key" />
      </el-form-item>
      <el-form-item label="API Secret" prop="apiSecret">
        <el-input v-model="formData.apiSecret" placeholder="Please enter SMS API Secret" />
      </el-form-item>
      <el-form-item label="Callback URL" prop="callbackUrl">
        <el-input v-model="formData.callbackUrl" placeholder="Please enter SMS callback URL" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemSmsChannelForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  signature: '',
  code: '',
  status: CommonStatusEnum.ENABLE,
  remark: '',
  apiKey: '',
  apiSecret: '',
  callbackUrl: ''
})
const formRules = reactive({
  signature: [{ required: true, message: 'SMS signature cannot be empty', trigger: 'blur' }],
  code: [{ required: true, message: 'Channel code cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The enabled status cannot be empty', trigger: 'blur' }],
  apiKey: [{ required: true, message: 'SMS API Key cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SmsChannelApi.getSmsChannel(id)
      console.log(formData)
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
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value as unknown as SmsChannelApi.SmsChannelVO
    if (formType.value === 'create') {
      await SmsChannelApi.createSmsChannel(data)
      message.success(t('common.createSuccess'))
    } else {
      await SmsChannelApi.updateSmsChannel(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // Event of successful sending operation
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** Reset Form  */
const resetForm = () => {
  formData.value = {
    id: undefined,
    signature: '',
    code: '',
    status: CommonStatusEnum.ENABLE,
    remark: '',
    apiKey: '',
    apiSecret: '',
    callbackUrl: ''
  }
  formRef.value?.resetFields()
}
</script>
