<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-form-item label="Channel" prop="channelId">
        <el-select v-model="formData.channelId" placeholder="Please select the SMS channel number">
          <el-option
            v-for="channel in channelList"
            :key="channel.id"
            :label="
              channel.signature +
              `【 ${getDictLabel(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE, channel.code)}】`
            "
            :value="channel.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-select v-model="formData.type" placeholder="Please select SMS type">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-input v-model="formData.code" placeholder="Please enter the template code" />
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the template name" />
      </el-form-item>
      <el-form-item label="Content" prop="content">
        <el-input v-model="formData.content" placeholder="Please enter the template content" type="textarea" />
      </el-form-item>
      <el-form-item label="Status" prop="status">
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
      <el-form-item label="API Template No." prop="apiTemplateId">
        <el-input v-model="formData.apiTemplateId" placeholder="Please enter API Template number" />
      </el-form-item>
      <el-form-item label="Remarks" prop="remark">
        <el-input v-model="formData.remark" placeholder="Please enter remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import * as SmsTemplateApi from '@/api/system/sms/smsTemplate'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemSmsTemplateForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form
const formData = ref<SmsTemplateApi.SmsTemplateVO>({
  id: undefined,
  type: undefined,
  status: CommonStatusEnum.ENABLE,
  code: '',
  name: '',
  content: '',
  remark: '',
  apiTemplateId: '',
  channelId: undefined
})
const formRules = reactive({
  type: [{ required: true, message: 'SMS type cannot be empty', trigger: 'change' }],
  status: [{ required: true, message: 'The open status cannot be empty', trigger: 'blur' }],
  code: [{ required: true, message: 'Template code cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Template name cannot be empty', trigger: 'blur' }],
  content: [{ required: true, message: 'Template content cannot be empty', trigger: 'blur' }],
  apiTemplateId: [{ required: true, message: 'SMS API template number cannot be empty', trigger: 'blur' }],
  channelId: [{ required: true, message: 'The SMS channel number cannot be empty', trigger: 'change' }]
})
const formRef = ref() // form  Ref
const channelList = ref<SmsChannelApi.SmsChannelVO[]>([]) // List of SMS channels

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SmsTemplateApi.getSmsTemplate(id)
    } finally {
      formLoading.value = false
    }
  }
  // Load channel list
  channelList.value = await SmsChannelApi.getSimpleSmsChannelList()
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    const data = formData.value as SmsTemplateApi.SmsTemplateVO
    if (formType.value === 'create') {
      await SmsTemplateApi.createSmsTemplate(data)
      message.success(t('common.createSuccess'))
    } else {
      await SmsTemplateApi.updateSmsTemplate(data)
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
    type: undefined,
    status: CommonStatusEnum.ENABLE,
    code: '',
    name: '',
    content: '',
    remark: '',
    apiTemplateId: '',
    channelId: undefined
  }
  formRef.value?.resetFields()
}
</script>
