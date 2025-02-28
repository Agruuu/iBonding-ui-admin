<template>
  <Dialog title="set up" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
    >
      <el-form-item label="Role setting" prop="systemMessage">
        <el-input
          type="textarea"
          v-model="formData.systemMessage"
          rows="4"
          placeholder="Please enter the role settings"
        />
      </el-form-item>
      <el-form-item label="Model" prop="modelId">
        <el-select v-model="formData.modelId" placeholder="Please select a model">
          <el-option
            v-for="chatModel in chatModelList"
            :key="chatModel.id"
            :label="chatModel.name"
            :value="chatModel.id"
          />
        </el-select>
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
      <el-form-item label="Number of replies, Number of tokens" prop="maxTokens">
        <el-input-number
          v-model="formData.maxTokens"
          placeholder="Please enter the number of replies, Number of tokens"
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
import { CommonStatusEnum } from '@/utils/constants'
import { ChatModelApi, ChatModelVO } from '@/api/ai/model/chatModel'
import { ChatConversationApi, ChatConversationVO } from '@/api/ai/chat/conversation'

/** AI Update form for chat conversation */
defineOptions({ name: 'ChatConversationUpdateForm' })

const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  id: undefined,
  systemMessage: undefined,
  modelId: undefined,
  temperature: undefined,
  maxTokens: undefined,
  maxContexts: undefined
})
const formRules = reactive({
  modelId: [{ required: true, message: 'The model cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'blur' }],
  temperature: [{ required: true, message: 'The temperature parameter cannot be empty', trigger: 'blur' }],
  maxTokens: [{ required: true, message: 'Number of replies, Number of tokens cannot be empty', trigger: 'blur' }],
  maxContexts: [{ required: true, message: 'The number of contexts cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref
const chatModelList = ref([] as ChatModelVO[]) // Chat Model List

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  resetForm()
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      const data = await ChatConversationApi.getChatConversationMy(id)
      formData.value = Object.keys(formData.value).reduce((obj, key) => {
        if (data.hasOwnProperty(key)) {
          obj[key] = data[key]
        }
        return obj
      }, {})
    } finally {
      formLoading.value = false
    }
  }
  // get dropdown data
  chatModelList.value = await ChatModelApi.getChatModelSimpleList(CommonStatusEnum.ENABLE)
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
    const data = formData.value as unknown as ChatConversationVO
    await ChatConversationApi.updateChatConversationMy(data)
    message.success('Conversation configuration has been updated')
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
    systemMessage: undefined,
    modelId: undefined,
    temperature: undefined,
    maxTokens: undefined,
    maxContexts: undefined
  }
  formRef.value?.resetFields()
}
</script>
