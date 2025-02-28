<template>
  <Dialog v-model="dialogVisible" title="Modify user points" width="600">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="User ID" prop="id">
        <el-input v-model="formData.id" class="!w-240px" disabled />
      </el-form-item>
      <el-form-item label="User nickname" prop="nickname">
        <el-input v-model="formData.nickname" class="!w-240px" disabled />
      </el-form-item>
      <el-form-item label="Points before change" prop="point">
        <el-input-number v-model="formData.point" class="!w-240px" disabled />
      </el-form-item>
      <el-form-item label="Change type" prop="changeType">
        <el-radio-group v-model="formData.changeType">
          <el-radio :value="1">increase</el-radio>
          <el-radio :value="-1">reduce</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Variable points" prop="changePoint">
        <el-input-number v-model="formData.changePoint" :min="0" :precision="0" class="!w-240px" />
      </el-form-item>
      <el-form-item label="Points after changes">
        <el-input-number v-model="pointResult" class="!w-240px" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Indeed set</el-button>
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as UserApi from '@/api/member/user'

/** Modify user points form */
defineOptions({ name: 'UpdatePointForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  id: undefined,
  nickname: undefined,
  point: 0,
  changePoint: 0,
  changeType: 1
})
const formRules = reactive({
  changePoint: [{ required: true, message: 'Variable points cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (id?: number) => {
  dialogVisible.value = true
  resetForm()
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await UserApi.getUser(id)
      formData.value.changeType = 1 // Default point increase
      formData.value.changePoint = 0 // Default Change Points0
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

  if (formData.value.changePoint < 1) {
    message.error('The change points cannot be less than 1')
    return
  }
  if (pointResult.value < 0) {
    message.error('The changed integral cannot be less than 0')
    return
  }

  // Submit Request
  formLoading.value = true
  try {
    await UserApi.updateUserPoint({
      id: formData.value.id,
      point: formData.value.changePoint * formData.value.changeType
    })

    message.success(t('common.updateSuccess'))
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
    nickname: undefined,
    point: 0,
    changePoint: 0,
    changeType: 1
  }
  formRef.value?.resetFields()
}

/** Points after changes */
const pointResult = computed(
  () => formData.value.point + formData.value.changePoint * formData.value.changeType
)
</script>
