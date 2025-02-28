<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="160px"
    >
      <el-form-item label="App Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the application name" />
      </el-form-item>
      <el-form-item label="App KEy" prop="appKey">
        <el-input v-model="formData.appKey" placeholder="Please enter the application ID" />
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
      <el-form-item label="Callback address for payment results" prop="orderNotifyUrl">
        <el-input v-model="formData.orderNotifyUrl" placeholder="Please enter the callback address for the payment result" />
      </el-form-item>
      <el-form-item label="The callback address for refund results" prop="refundNotifyUrl">
        <el-input v-model="formData.refundNotifyUrl" placeholder="Please enter the callback address for the refund result" />
      </el-form-item>
      <el-form-item label="The callback address for the transfer result" prop="transferNotifyUrl">
        <el-input v-model="formData.transferNotifyUrl" placeholder="Please enter the callback address for the transfer result" />
      </el-form-item>
      <el-form-item label="Remarks" prop="remark">
        <el-input v-model="formData.remark" placeholder="Please enter thr remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as AppApi from '@/api/pay/app'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'PayAppForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  name: undefined,
  appKey: undefined,
  status: CommonStatusEnum.ENABLE,
  remark: undefined,
  orderNotifyUrl: undefined,
  refundNotifyUrl: undefined,
  transferNotifyUrl: undefined
})
const formRules = reactive({
  name: [{ required: true, message: 'The application name cannot be empty', trigger: 'blur' }],
  appKey: [{ required: true, message: 'The application identifier cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The open status cannot be empty', trigger: 'blur' }],
  orderNotifyUrl: [{ required: true, message: 'The callback address for payment results cannot be empty', trigger: 'blur' }],
  refundNotifyUrl: [{ required: true, message: 'The callback address for refund results cannot be empty', trigger: 'blur' }]
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
      formData.value = await AppApi.getApp(id)
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
    const data = formData.value as unknown as AppApi.AppVO
    if (formType.value === 'create') {
      await AppApi.createApp(data)
      message.success(t('common.createSuccess'))
    } else {
      await AppApi.updateApp(data)
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
    name: undefined,
    status: CommonStatusEnum.ENABLE,
    remark: undefined,
    orderNotifyUrl: undefined,
    refundNotifyUrl: undefined,
    transferNotifyUrl: undefined,
    appKey: undefined
  }
  formRef.value?.resetFields()
}
</script>
