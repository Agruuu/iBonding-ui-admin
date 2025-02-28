<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the task name" />
      </el-form-item>
      <el-form-item label="Handler Name" prop="handlerName">
        <el-input
          :readonly="formData.id !== undefined"
          v-model="formData.handlerName"
          placeholder="Please enter the Handler Name"
        />
      </el-form-item>
      <el-form-item label="Handler Param" prop="handlerParam">
        <el-input v-model="formData.handlerParam" placeholder="Please enter the Handler Param" />
      </el-form-item>
      <el-form-item label="CRON Expression" prop="cronExpression">
        <crontab v-model="formData.cronExpression" />
      </el-form-item>
      <el-form-item label="Retry Count" prop="retryCount">
        <el-input
          v-model="formData.retryCount"
          placeholder="Please enter the number of retries. When set to 0, no retries will be performed"
        />
      </el-form-item>
      <el-form-item label="Retry interval " prop="retryInterval">
        <el-input
          v-model="formData.retryInterval"
          placeholder="Please enter the retry interval in milliseconds. When set to 0, no interval is required"
        />
      </el-form-item>
      <el-form-item label="Monitoring timeout" prop="monitorTimeout">
        <el-input v-model="formData.monitorTimeout" placeholder="Please enter the monitoring timeout，unit：millisecond" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm" :loading="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as JobApi from '@/api/infra/job'

defineOptions({ name: 'JobForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - add；update - modify
const formData = ref({
  id: undefined,
  name: '',
  handlerName: '',
  handlerParam: '',
  cronExpression: '',
  retryCount: undefined,
  retryInterval: undefined,
  monitorTimeout: undefined
})
const formRules = reactive({
  name: [{ required: true, message: 'The task name cannot be empty', trigger: 'blur' }],
  handlerName: [{ required: true, message: 'The handler name cannot be empty', trigger: 'blur' }],
  cronExpression: [{ required: true, message: 'The CRON expression cannot be empty', trigger: 'blur' }],
  retryCount: [{ required: true, message: 'The retry count cannot be empty', trigger: 'blur' }],
  retryInterval: [{ required: true, message: 'The retry interval cannot be empty', trigger: 'blur' }]
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
      formData.value = await JobApi.getJob(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit button */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value as unknown as JobApi.JobVO
    if (formType.value === 'create') {
      await JobApi.createJob(data)
      message.success(t('common.createSuccess'))
    } else {
      await JobApi.updateJob(data)
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
    name: '',
    handlerName: '',
    handlerParam: '',
    cronExpression: '',
    retryCount: undefined,
    retryInterval: undefined,
    monitorTimeout: undefined
  }
  formRef.value?.resetFields()
}
</script>
