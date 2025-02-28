<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      v-loading="formLoading"
    >
      <el-form-item label="Template Code" prop="code">
        <el-input v-model="formData.code" placeholder="Please enter the template code" />
      </el-form-item>
      <el-form-item label="Template Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the template name" />
      </el-form-item>
      <el-form-item label="Sender Name" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="Please enter sender name" />
      </el-form-item>
      <el-form-item label="Template Content" prop="content">
        <el-input type="textarea" v-model="formData.content" placeholder="Please enter the template content" />
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-select v-model="formData.type" placeholder="Please select type">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Open Status" prop="status">
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
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as NotifyTemplateApi from '@/api/system/notify/template'
import { CommonStatusEnum } from '@/utils/constants'
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form
const formData = ref<NotifyTemplateApi.NotifyTemplateVO>({
  id: undefined,
  name: '',
  nickname: '',
  code: '',
  content: '',
  type: undefined,
  params: '',
  status: CommonStatusEnum.ENABLE,
  remark: ''
})
const formRules = reactive({
  type: [{ required: true, message: 'Message type cannot be empty', trigger: 'change' }],
  status: [{ required: true, message: 'The open status cannot be empty', trigger: 'blur' }],
  code: [{ required: true, message: 'Template code cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Template name cannot be empty', trigger: 'blur' }],
  nickname: [{ required: true, message: 'The sender name cannot be empty', trigger: 'blur' }],
  content: [{ required: true, message: 'Template content cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type
  formType.value = type
  resetForm()
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await NotifyTemplateApi.getNotifyTemplate(id)
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
  formLoading.value = true
  try {
    const data = formData.value as unknown as NotifyTemplateApi.NotifyTemplateVO
    if (formType.value === 'create') {
      await NotifyTemplateApi.createNotifyTemplate(data)
      message.success('Add Successfully')
    } else {
      await NotifyTemplateApi.updateNotifyTemplate(data)
      message.success('Edit Successfully')
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
    nickname: '',
    code: '',
    content: '',
    type: undefined,
    params: '',
    status: CommonStatusEnum.ENABLE,
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>
