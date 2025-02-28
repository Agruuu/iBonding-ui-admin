<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >
      <el-form-item label="Package Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the package name" />
      </el-form-item>
      <el-form-item label="Payment amount(element)" prop="payPrice">
        <el-input-number v-model="formData.payPrice" :min="0" :precision="2" :step="0.01" />
      </el-form-item>
      <el-form-item label="Gift amount(element)" prop="bonusPrice">
        <el-input-number v-model="formData.bonusPrice" :min="0" :precision="2" :step="0.01" />
      </el-form-item>
      <el-form-item label="Open status" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Indeed set</el-button>
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as WalletRechargePackageApi from '@/api/pay/wallet/rechargePackage'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { fenToYuan, yuanToFen } from '@/utils'
const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  name: undefined,
  payPrice: undefined,
  bonusPrice: undefined,
  status: undefined
})
const formRules = reactive({
  name: [{ required: true, message: 'Package name cannot be empty', trigger: 'blur' }],
  payPrice: [{ required: true, message: 'The payment amount cannot be empty', trigger: 'blur' }],
  bonusPrice: [{ required: true, message: 'The gift amount cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'blur' }]
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
      formData.value = await WalletRechargePackageApi.getWalletRechargePackage(id)
      formData.value.payPrice = fenToYuan(formData.value.payPrice)
      formData.value.bonusPrice = fenToYuan(formData.value.bonusPrice)
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
    const data = { ...formData.value }
    data.payPrice = yuanToFen(data.payPrice)
    data.bonusPrice = yuanToFen(data.bonusPrice)
    if (formType.value === 'create') {
      await WalletRechargePackageApi.createWalletRechargePackage(data)
      message.success(t('common.createSuccess'))
    } else {
      await WalletRechargePackageApi.updateWalletRechargePackage(data)
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
    payPrice: undefined,
    bonusPrice: undefined,
    status: undefined
  }
  formRef.value?.resetFields()
}
</script>
