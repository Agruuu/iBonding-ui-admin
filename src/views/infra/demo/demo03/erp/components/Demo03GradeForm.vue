<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter a name" />
      </el-form-item>
      <el-form-item label="Class Teacher" prop="teacher">
        <el-input v-model="formData.teacher" placeholder="Please enter the class teacher" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as Demo03StudentApi from '@/api/infra/demo/demo03/erp'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  studentId: undefined,
  name: undefined,
  teacher: undefined
})
const formRules = reactive({
  studentId: [{ required: true, message: 'Student ID cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Name cannot be empty', trigger: 'blur' }],
  teacher: [{ required: true, message: 'The class teacher cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (type: string, id?: number, studentId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.studentId = studentId
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await Demo03StudentApi.getDemo03Grade(id)
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
  await formRef.value.validate()
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value
    if (formType.value === 'create') {
      await Demo03StudentApi.createDemo03Grade(data)
      message.success(t('common.createSuccess'))
    } else {
      await Demo03StudentApi.updateDemo03Grade(data)
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
    studentId: undefined,
    name: undefined,
    teacher: undefined
  }
  formRef.value?.resetFields()
}
</script>
