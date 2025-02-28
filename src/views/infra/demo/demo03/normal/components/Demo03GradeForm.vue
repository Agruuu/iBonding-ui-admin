<template>
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
    <el-form-item label="Teacher" prop="teacher">
      <el-input v-model="formData.teacher" placeholder="Please enter the teacher" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import * as Demo03StudentApi from '@/api/infra/demo/demo03/normal'

const props = defineProps<{
  studentId: undefined // Student ID（Associated fields of the main table）
}>()
const formLoading = ref(false) // Form loading in progress
const formData = ref([])
const formRules = reactive({
  studentId: [{ required: true, message: 'Student ID cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Name cannot be empty', trigger: 'blur' }],
  teacher: [{ required: true, message: 'The teacher cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Monitor changes in associated fields of the main table，Load the corresponding sub table data */
watch(
  () => props.studentId,
  async (val) => {
    // 1. Reset Form 
    formData.value = {
      id: undefined,
      studentId: undefined,
      name: undefined,
      teacher: undefined
    }
    // 2. val Non empty，Then load the data
    if (!val) {
      return
    }
    try {
      formLoading.value = true
      const data = await Demo03StudentApi.getDemo03GradeByStudentId(val)
      if (!data) {
        return
      }
      formData.value = data
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** Form verification */
const validate = () => {
  return formRef.value.validate()
}

/** Form value */
const getData = () => {
  return formData.value
}

defineExpose({ validate, getData })
</script>
