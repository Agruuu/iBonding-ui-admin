<template>
  <Dialog title="Modify user level" v-model="dialogVisible" width="600">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="User ID" prop="id">
        <el-input v-model="formData.id" placeholder="Please enter user nickname" class="!w-240px" disabled />
      </el-form-item>
      <el-form-item label="User nickname" prop="nickname">
        <el-input
          v-model="formData.nickname"
          placeholder="Please enter user nickname"
          class="!w-240px"
          disabled
        />
      </el-form-item>
      <el-form-item label="User level" prop="levelId">
        <MemberLevelSelect v-model="formData.levelId" />
      </el-form-item>
      <el-form-item label="Reason for modification" prop="reason">
        <el-input type="textarea" v-model="formData.reason" placeholder="Please enter the reason for modification" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Indeed set</el-button>
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as UserApi from '@/api/member/user'
import MemberLevelSelect from '@/views/member/level/components/MemberLevelSelect.vue'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  id: undefined,
  nickname: undefined,
  levelId: undefined,
  reason: undefined
})
const formRules = reactive({
  reason: [{ required: true, message: 'Reason for modification cannot be empty', trigger: 'blur' }]
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
    await UserApi.updateUserLevel(formData.value)

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
    levelId: undefined,
    reason: undefined
  }
  formRef.value?.resetFields()
}
</script>
