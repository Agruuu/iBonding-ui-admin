<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the datasource name" />
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input v-model="formData.url" placeholder="Please enter the data source url" />
      </el-form-item>
      <el-form-item label="Username" prop="username">
        <el-input v-model="formData.username" placeholder="Please enter username" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="formData.password" placeholder="Please input password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as DataSourceConfigApi from '@/api/infra/dataSourceConfig'

defineOptions({ name: 'InfraDataSourceConfigForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - add；update - modify
const formData = ref<DataSourceConfigApi.DataSourceConfigVO>({
  id: undefined,
  name: '',
  url: '',
  username: '',
  password: ''
})
const formRules = reactive({
  name: [{ required: true, message: 'The datasource name cannot be empty', trigger: 'blur' }],
  url: [{ required: true, message: 'The datasource url cannot be empty', trigger: 'blur' }],
  username: [{ required: true, message: 'The username cannot be empty', trigger: 'blur' }],
  password: [{ required: true, message: 'The password cannot be empty', trigger: 'blur' }]
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
      formData.value = await DataSourceConfigApi.getDataSourceConfig(id)
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
    const data = formData.value as DataSourceConfigApi.DataSourceConfigVO
    if (formType.value === 'create') {
      await DataSourceConfigApi.createDataSourceConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await DataSourceConfigApi.updateDataSourceConfig(data)
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
    url: '',
    username: '',
    password: ''
  }
  formRef.value?.resetFields()
}
</script>
