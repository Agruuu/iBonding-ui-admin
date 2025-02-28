<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="ID" type="index" width="100" />
      <el-table-column label="Name" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.name`" :rules="formRules.name" class="mb-0px!">
            <el-input v-model="row.name" placeholder="Please enter a name" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Score" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.score`" :rules="formRules.score" class="mb-0px!">
            <el-input v-model="row.score" placeholder="Please enter the score" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Operation" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ Add Student Course</el-button>
  </el-row>
</template>
<script setup lang="ts">
import * as Demo03StudentApi from '@/api/infra/demo/demo03/inner'

const props = defineProps<{
  studentId: undefined // Student ID（Associated fields of the main table）
}>()
const formLoading = ref(false) // Form loading in progress
const formData = ref([])
const formRules = reactive({
  studentId: [{ required: true, message: 'Student ID cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Name cannot be empty', trigger: 'blur' }],
  score: [{ required: true, message: 'Score cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Monitor changes in associated fields of the main table，Load the corresponding sub table data */
watch(
  () => props.studentId,
  async (val) => {
    // 1. Reset Form 
    formData.value = []
    // 2. val Non empty，Then load the data
    if (!val) {
      return
    }
    try {
      formLoading.value = true
      formData.value = await Demo03StudentApi.getDemo03CourseListByStudentId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** Add button operation */
const handleAdd = () => {
  const row = {
    id: undefined,
    studentId: undefined,
    name: undefined,
    score: undefined
  }
  row.studentId = props.studentId
  formData.value.push(row)
}

/** Delete button operation */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

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
