<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="Configuration Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the configuration name" />
      </el-form-item>
      <el-form-item label="Remarks" prop="remark">
        <el-input v-model="formData.remark" placeholder="Please enter the remark" />
      </el-form-item>
      <el-form-item label="Storage" prop="storage">
        <el-select
          v-model="formData.storage"
          :disabled="formData.id !== undefined"
          placeholder="Please select a storage device"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.INFRA_FILE_STORAGE)"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <!-- DB -->
      <!-- Local / FTP / SFTP -->
      <el-form-item
        v-if="formData.storage >= 10 && formData.storage <= 12"
        label="Basic Path"
        prop="config.basePath"
      >
        <el-input v-model="formData.config.basePath" placeholder="Please enter the basic path" />
      </el-form-item>
      <el-form-item
        v-if="formData.storage >= 11 && formData.storage <= 12"
        label="Host Address"
        prop="config.host"
      >
        <el-input v-model="formData.config.host" placeholder="Please enter the host address" />
      </el-form-item>
      <el-form-item
        v-if="formData.storage >= 11 && formData.storage <= 12"
        label="Host Port"
        prop="config.port"
      >
        <el-input-number v-model="formData.config.port" :min="0" placeholder="Please enter the host port" />
      </el-form-item>
      <el-form-item
        v-if="formData.storage >= 11 && formData.storage <= 12"
        label="Username"
        prop="config.username"
      >
        <el-input v-model="formData.config.username" placeholder="Please enter the username" />
      </el-form-item>
      <el-form-item
        v-if="formData.storage >= 11 && formData.storage <= 12"
        label="Password"
        prop="config.password"
      >
        <el-input v-model="formData.config.password" placeholder="Please input a password" />
      </el-form-item>
      <el-form-item v-if="formData.storage === 11" label="Connection Mode" prop="config.mode">
        <el-radio-group v-model="formData.config.mode">
          <el-radio key="Active" value="Active">Active Mode</el-radio>
          <el-radio key="Passive" value="Passive">Passive mode</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- S3 -->
      <el-form-item v-if="formData.storage === 20" label="Node Address" prop="config.endpoint">
        <el-input v-model="formData.config.endpoint" placeholder="Please enter the node address" />
      </el-form-item>
      <el-form-item v-if="formData.storage === 20" label="Storage bucket" prop="config.bucket">
        <el-input v-model="formData.config.bucket" placeholder="Please enter bucket" />
      </el-form-item>
      <el-form-item v-if="formData.storage === 20" label="AccessKey" prop="config.accessKey">
        <el-input v-model="formData.config.accessKey" placeholder="Please enter accessKey" />
      </el-form-item>
      <el-form-item v-if="formData.storage === 20" label="AccessSecret" prop="config.accessSecret">
        <el-input v-model="formData.config.accessSecret" placeholder="Please enter accessSecret" />
      </el-form-item>
      <!-- currency -->
      <el-form-item v-if="formData.storage === 20" label="Custom Domain Name">
        <!-- No parameter verification required，So remove prop -->
        <el-input v-model="formData.config.domain" placeholder="Please enter a custom domain name" />
      </el-form-item>
      <el-form-item v-else-if="formData.storage" label="Custom Domain Name" prop="config.domain">
        <el-input v-model="formData.config.domain" placeholder="Please enter a custom domain name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
import * as FileConfigApi from '@/api/infra/fileConfig'
import { FormRules } from 'element-plus'

defineOptions({ name: 'InfraFileConfigForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  name: '',
  storage: 0,
  remark: '',
  config: {} as FileConfigApi.FileClientConfig
})
const formRules = reactive<FormRules>({
  name: [{ required: true, message: 'The configuration name cannot be empty', trigger: 'blur' }],
  storage: [{ required: true, message: 'Storage cannot be empty', trigger: 'change' }],
  config: {
    basePath: [{ required: true, message: 'The base path cannot be empty', trigger: 'blur' }],
    host: [{ required: true, message: 'The host address cannot be empty', trigger: 'blur' }],
    port: [{ required: true, message: 'Host port cannot be empty', trigger: 'blur' }],
    username: [{ required: true, message: 'The username cannot be empty', trigger: 'blur' }],
    password: [{ required: true, message: 'Password cannot be empty', trigger: 'blur' }],
    mode: [{ required: true, message: 'Connection mode cannot be empty', trigger: 'change' }],
    endpoint: [{ required: true, message: 'Node address cannot be empty', trigger: 'blur' }],
    bucket: [{ required: true, message: 'Storage bucket Cannot be empty', trigger: 'blur' }],
    accessKey: [{ required: true, message: 'AccessKey Cannot be empty', trigger: 'blur' }],
    accessSecret: [{ required: true, message: 'AccessSecret Cannot be empty', trigger: 'blur' }],
    domain: [{ required: true, message: 'Custom domain name cannot be empty', trigger: 'blur' }]
  } as FormRules
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
      formData.value = await FileConfigApi.getFileConfig(id)
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
    const data = formData.value as unknown as FileConfigApi.FileConfigVO
    if (formType.value === 'create') {
      await FileConfigApi.createFileConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await FileConfigApi.updateFileConfig(data)
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
    storage: undefined!,
    remark: '',
    config: {} as FileConfigApi.FileClientConfig
  }
  formRef.value?.resetFields()
}
</script>
