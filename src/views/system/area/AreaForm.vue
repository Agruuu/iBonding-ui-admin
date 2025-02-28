<template>
  <Dialog v-model="dialogVisible" title="IP Query">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="IP" prop="ip">
        <el-input v-model="formData.ip" placeholder="Please enter IP address" />
      </el-form-item>
      <el-form-item label="Address" prop="result">
        <el-input v-model="formData.result" placeholder="Display query IP result" readonly />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as AreaApi from '@/api/system/area'

defineOptions({ name: 'SystemAreaForm' })

const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：The submit button is disabled
const formData = ref({
  ip: '',
  result: undefined
})
const formRules = reactive({
  ip: [{ required: true, message: 'IP The address cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async () => {
  dialogVisible.value = true
  resetForm()
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    formData.value.result = await AreaApi.getAreaByIp(formData.value.ip!.trim())
    message.success('Query Was Successful')
  } finally {
    formLoading.value = false
  }
}

/** Reset Form  */
const resetForm = () => {
  formData.value = {
    ip: '',
    result: undefined
  }
  formRef.value?.resetFields()
}
</script>
