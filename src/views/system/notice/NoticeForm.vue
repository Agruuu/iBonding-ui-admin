<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="Title" prop="title">
        <el-input v-model="formData.title" placeholder="Please enter the notice title" />
      </el-form-item>
      <el-form-item label="Content" prop="content">
        <Editor v-model="formData.content" height="150px" />
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-select v-model="formData.type" clearable placeholder="Please select the type of notice">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_NOTICE_TYPE)"
            :key="parseInt(dict.value as any)"
            :label="dict.label"
            :value="parseInt(dict.value as any)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select v-model="formData.status" clearable placeholder="Please select the status">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="parseInt(dict.value as any)"
            :label="dict.label"
            :value="parseInt(dict.value as any)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Remarks" prop="remark">
        <el-input v-model="formData.remark" placeholder="Please enter remark" type="textarea" />
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
import { CommonStatusEnum } from '@/utils/constants'
import * as NoticeApi from '@/api/system/notice'

defineOptions({ name: 'SystemNoticeForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  title: '',
  type: undefined,
  content: '',
  status: CommonStatusEnum.ENABLE,
  remark: ''
})
const formRules = reactive({
  title: [{ required: true, message: 'Notice title cannot be empty', trigger: 'blur' }],
  type: [{ required: true, message: 'Notice type cannot be empty', trigger: 'change' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'change' }],
  content: [{ required: true, message: 'Notice content cannot be empty', trigger: 'blur' }]
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
      formData.value = await NoticeApi.getNotice(id)
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
    const data = formData.value as unknown as NoticeApi.NoticeVO
    if (formType.value === 'create') {
      await NoticeApi.createNotice(data)
      message.success(t('common.createSuccess'))
    } else {
      await NoticeApi.updateNotice(data)
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
    title: '',
    type: undefined,
    content: '',
    status: CommonStatusEnum.ENABLE,
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>
