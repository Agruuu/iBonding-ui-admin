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
      <el-form-item label="Gender" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Birthday" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          value-format="x"
          placeholder="Choose year of birthday"
        />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <Editor v-model="formData.description" height="150px" />
      </el-form-item>
      <el-form-item label="Avatar" prop="avatar">
        <UploadImg v-model="formData.avatar" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as Demo01ContactApi from '@/api/infra/demo/demo01'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  name: undefined,
  sex: undefined,
  birthday: undefined,
  description: undefined,
  avatar: undefined
})
const formRules = reactive({
  name: [{ required: true, message: 'The ame cannot be empty', trigger: 'blur' }],
  sex: [{ required: true, message: 'The gender cannot be empty', trigger: 'blur' }],
  birthday: [{ required: true, message: 'The birthday cannot be empty', trigger: 'blur' }],
  description: [{ required: true, message: 'The introduction cannot be empty', trigger: 'blur' }]
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
      formData.value = await Demo01ContactApi.getDemo01Contact(id)
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
    const data = formData.value as unknown as Demo01ContactApi.Demo01ContactVO
    if (formType.value === 'create') {
      await Demo01ContactApi.createDemo01Contact(data)
      message.success(t('common.createSuccess'))
    } else {
      await Demo01ContactApi.updateDemo01Contact(data)
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
    sex: undefined,
    birthday: undefined,
    description: undefined,
    avatar: undefined
  }
  formRef.value?.resetFields()
}
</script>
