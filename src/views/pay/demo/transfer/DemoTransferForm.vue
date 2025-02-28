<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="Transfer Type" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.PAY_TRANSFER_TYPE)"
            :key="dict.value"
            :value="dict.value"
            :disabled="dict.value === 2 || dict.value === 3 || dict.value === 4"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Transfer Amount(Euro)" prop="price">
        <el-input-number
          v-model="formData.price"
          :min="0"
          :precision="2"
          :step="0.01"
          placeholder="Please enter the transfer amount"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="Name of Payee" prop="userName">
        <el-input v-model="formData.userName" placeholder="Please enter the name of the payee" />
      </el-form-item>
      <el-form-item v-show="formData.type === 1" label="Alipay Login Account" prop="alipayLogonId">
        <el-input v-model="formData.alipayLogonId" placeholder="Please enter your Alipay login account" />
      </el-form-item>
      <el-form-item v-show="formData.type === 2" label="WeChat openid" prop="openid">
        <el-input v-model="formData.openid" placeholder="Please enter WeChat openid" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as DemoTransferApi from '@/api/pay/demo/transfer'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { yuanToFen } from '@/utils'
const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  price: undefined,
  type: undefined,
  userName: undefined,
  alipayLogonId: undefined,
  openid: undefined
})
const formRules = reactive({
  price: [{ required: true, message: 'The transfer amount cannot be empty', trigger: 'blur' }],
  type: [{ required: true, message: 'Transfer type cannot be empty', trigger: 'change' }]
})
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (type: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
}
/** Close the pop-up window */
const close = async () => {
  dialogVisible.value = false
  resetForm()
}
defineExpose({ open, close }) // provide open， close method，Used to open, Close the pop-up window

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
    const data = { ...formData.value }
    data.price = yuanToFen(data.price)
    if (formType.value === 'create') {
      await DemoTransferApi.createDemoTransfer(data)
      message.success(t('common.createSuccess'))
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
    price: undefined,
    userName: undefined,
    alipayLogonId: undefined,
    openid: undefined
  }
  formRef.value?.resetFields()
}
</script>
