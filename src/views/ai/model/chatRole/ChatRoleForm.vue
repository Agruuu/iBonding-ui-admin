<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="Role Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the role name" />
      </el-form-item>
      <el-form-item label="Role avatar" prop="avatar">
        <UploadImg v-model="formData.avatar" height="60px" width="60px" />
      </el-form-item>
      <el-form-item label="Binding model" prop="modelId" v-if="!isUser">
        <el-select v-model="formData.modelId" placeholder="Please select a model" clearable>
          <el-option
            v-for="chatModel in chatModelList"
            :key="chatModel.id"
            :label="chatModel.name"
            :value="chatModel.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Role category" prop="category" v-if="!isUser">
        <el-input v-model="formData.category" placeholder="Please enter the role category" />
      </el-form-item>
      <el-form-item label="Role description" prop="description">
        <el-input type="textarea" v-model="formData.description" placeholder="Please enter role description" />
      </el-form-item>
      <el-form-item label="Role setting" prop="systemMessage">
        <el-input type="textarea" v-model="formData.systemMessage" placeholder="Please enter the role settings" />
      </el-form-item>
      <el-form-item label="Public status" prop="publicStatus" v-if="!isUser">
        <el-radio-group v-model="formData.publicStatus">
          <el-radio
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Role sorting" prop="sort" v-if="!isUser">
        <el-input-number v-model="formData.sort" placeholder="Please enter role sorting" class="!w-1/1" />
      </el-form-item>
      <el-form-item label="Open status" prop="status" v-if="!isUser">
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
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">confirm</el-button>
      <el-button @click="dialogVisible = false">cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { ChatRoleApi, ChatRoleVO } from '@/api/ai/model/chatRole'
import { CommonStatusEnum } from '@/utils/constants'
import { ChatModelApi, ChatModelVO } from '@/api/ai/model/chatModel'
import { FormRules } from 'element-plus'

/** AI Chat Role form  */
defineOptions({ name: 'ChatRoleForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - add；update - modify
const formData = ref({
  id: undefined,
  modelId: undefined,
  name: undefined,
  avatar: undefined,
  category: undefined,
  sort: undefined,
  description: undefined,
  systemMessage: undefined,
  publicStatus: true,
  status: CommonStatusEnum.ENABLE
})
const formRef = ref() // form  Ref
const chatModelList = ref([] as ChatModelVO[]) // Chat Model List

/** whether【I】Create your own，Private role */
const isUser = computed(() => {
  return formType.value === 'my-create' || formType.value === 'my-update'
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: 'The role name cannot be empty', trigger: 'blur' }],
  avatar: [{ required: true, message: 'The role avatar cannot be empty', trigger: 'blur' }],
  category: [{ required: true, message: 'The role category cannot be empty', trigger: 'blur' }],
  sort: [{ required: true, message: 'The role sorting cannot be empty', trigger: 'blur' }],
  description: [{ required: true, message: 'The role description cannot be empty', trigger: 'blur' }],
  systemMessage: [{ required: true, message: 'The role setting cannot be empty', trigger: 'blur' }],
  publicStatus: [{ required: true, message: 'Public status cannot be empty', trigger: 'blur' }]
})

/** Open pop-up window */
// TODO @Agruuu：Is it more reasonable to judge and generate the title by checking whether the title converges to the type
const open = async (type: string, id?: number, title?: string) => {
  dialogVisible.value = true
  dialogTitle.value = title || t('action.' + type)
  formType.value = type
  resetForm()
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ChatRoleApi.getChatRole(id)
    } finally {
      formLoading.value = false
    }
  }
  // Obtain dropdown data
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
    const data = formData.value as unknown as ChatRoleVO
    // tip: `my-create` and `my-update` are called by the chat role repository.
    // tip: create、else is a backend management call
    if (formType.value === 'my-create') {
      await ChatRoleApi.createMy(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'my-update') {
      await ChatRoleApi.updateMy(data)
      message.success(t('common.updateSuccess'))
    } else if (formType.value === 'create') {
      await ChatRoleApi.createChatRole(data)
      message.success(t('common.createSuccess'))
    } else {
      await ChatRoleApi.updateChatRole(data)
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
    modelId: undefined,
    name: undefined,
    avatar: undefined,
    category: undefined,
    sort: undefined,
    description: undefined,
    systemMessage: undefined,
    publicStatus: true,
    status: CommonStatusEnum.ENABLE
  }
  formRef.value?.resetFields()
}
</script>
