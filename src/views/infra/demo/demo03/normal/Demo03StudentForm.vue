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
          placeholder="Select date of birth"
        />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <Editor v-model="formData.description" height="150px" />
      </el-form-item>
    </el-form>
    <!-- Form of sub table -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="Student Course" name="demo03Course">
        <Demo03CourseForm ref="demo03CourseFormRef" :student-id="formData.id" />
      </el-tab-pane>
      <el-tab-pane label="Student Class" name="demo03Grade">
        <Demo03GradeForm ref="demo03GradeFormRef" :student-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as Demo03StudentApi from '@/api/infra/demo/demo03/normal'
import Demo03CourseForm from './components/Demo03CourseForm.vue'
import Demo03GradeForm from './components/Demo03GradeForm.vue'

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
  description: undefined
})
const formRules = reactive({
  name: [{ required: true, message: 'Name cannot be empty', trigger: 'blur' }],
  sex: [{ required: true, message: 'Gender cannot be empty', trigger: 'blur' }],
  birthday: [{ required: true, message: 'Birthday cannot be empty', trigger: 'blur' }],
  description: [{ required: true, message: 'Description cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Form of sub table */
const subTabsName = ref('demo03Course')
const demo03CourseFormRef = ref()
const demo03GradeFormRef = ref()

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
      formData.value = await Demo03StudentApi.getDemo03Student(id)
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
  // Verify sub forms
  try {
    await demo03CourseFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'demo03Course'
    return
  }
  try {
    await demo03GradeFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'demo03Grade'
    return
  }
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value as unknown as Demo03StudentApi.Demo03StudentVO
    // Splicing data from sub tables
    data.demo03Courses = demo03CourseFormRef.value.getData()
    data.demo03Grade = demo03GradeFormRef.value.getData()
    if (formType.value === 'create') {
      await Demo03StudentApi.createDemo03Student(data)
      message.success(t('common.createSuccess'))
    } else {
      await Demo03StudentApi.updateDemo03Student(data)
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
    description: undefined
  }
  formRef.value?.resetFields()
}
</script>
