<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="Affiliated platform" prop="platform">
        <el-select v-model="formData.platform" placeholder="Please enter the platform" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AI_PLATFORM)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="API Secret key" prop="keyId">
        <el-select v-model="formData.keyId" placeholder="Please choose API Secret key" clearable>
          <el-option
            v-for="apiKey in apiKeyList"
            :key="apiKey.id"
            :label="apiKey.name"
            :value="apiKey.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Model Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the model name" />
      </el-form-item>
      <el-form-item label="Model identification" prop="model">
        <el-input v-model="formData.model" placeholder="Please enter the model identifier" />
      </el-form-item>
      <el-form-item label="Model sorting" prop="sort">
        <el-input-number v-model="formData.sort" placeholder="Please enter the model sorting" class="!w-1/1" />
      </el-form-item>
      <el-form-item label="Open status" prop="status">
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
      <el-form-item label="Temperature parameters" prop="temperature">
        <el-input-number
          v-model="formData.temperature"
          placeholder="Please enter temperature parameters"
          :min="0"
          :max="2"
          :precision="2"
        />
      </el-form-item>
      <el-form-item label="Number of replies number of Token " prop="maxTokens">
        <el-input-number
          v-model="formData.maxTokens"
          placeholder="Please enter the number of replies number of Token "
          :min="0"
          :max="4096"
        />
      </el-form-item>
      <el-form-item label="Number of contexts" prop="maxContexts">
        <el-input-number
          v-model="formData.maxContexts"
          placeholder="Please enter the number of contexts"
          :min="0"
          :max="20"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">confirm</el-button>
      <el-button @click="dialogVisible = false">cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ChatModelApi, ChatModelVO } from '@/api/ai/model/chatModel'
import { ApiKeyApi, ApiKeyVO } from '@/api/ai/model/apiKey'
import { CommonStatusEnum } from '@/utils/constants'
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'

/** API Chat Model form  */
defineOptions({ name: 'ChatModelForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  keyId: undefined,
  name: undefined,
  model: undefined,
  platform: undefined,
  sort: undefined,
  status: CommonStatusEnum.ENABLE,
  temperature: undefined,
  maxTokens: undefined,
  maxContexts: undefined
})
const formRules = reactive({
  keyId: [{ required: true, message: 'The API Secret key cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'The model name cannot be empty', trigger: 'blur' }],
  model: [{ required: true, message: 'The model identifier cannot be empty', trigger: 'blur' }],
  platform: [{ required: true, message: 'The platform cannot be empty', trigger: 'blur' }],
  sort: [{ required: true, message: 'Sorting cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref
const apiKeyList = ref([] as ApiKeyVO[]) // API Secret Key List

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
      formData.value = await ChatModelApi.getChatModel(id)
    } finally {
      formLoading.value = false
    }
  }
  // Obtain dropdown data
  apiKeyList.value = await ApiKeyApi.getApiKeySimpleList(CommonStatusEnum.ENABLE)
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  // validate form 
  await formRef.value.validate()
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value as unknown as ChatModelVO
    if (formType.value === 'create') {
      await ChatModelApi.createChatModel(data)
      message.success(t('common.createSuccess'))
    } else {
      await ChatModelApi.updateChatModel(data)
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
    keyId: undefined,
    name: undefined,
    model: undefined,
    platform: undefined,
    sort: undefined,
    status: CommonStatusEnum.ENABLE,
    temperature: undefined,
    maxTokens: undefined,
    maxContexts: undefined
  }
  formRef.value?.resetFields()
}
</script>
