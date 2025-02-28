<template>
  <Dialog v-model="dialogVisible" title="Modify user balance" width="600">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="User ID" prop="id">
        <el-input v-model="formData.id" class="!w-240px" disabled />
      </el-form-item>
      <el-form-item label="User nickname" prop="nickname">
        <el-input v-model="formData.nickname" class="!w-240px" disabled />
      </el-form-item>
      <el-form-item label="Balance before change(element)" prop="balance">
        <el-input :model-value="formData.balance" class="!w-240px" disabled />
      </el-form-item>
      <el-form-item label="Change type" prop="changeType">
        <el-radio-group v-model="formData.changeType">
          <el-radio :label="1">increase</el-radio>
          <el-radio :label="-1">reduce</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Variable balance(element)" prop="changeBalance">
        <el-input-number
          v-model="formData.changeBalance"
          :min="0"
          :precision="2"
          :step="0.1"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Balance after change(element)">
        <el-input :model-value="balanceResult" class="!w-240px" disabled />
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
import * as WalletApi from '@/api/pay/wallet/balance'
import { convertToInteger, formatToFraction } from '@/utils'

/** Modify User Balance Form */
defineOptions({ name: 'UpdateBalanceForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  id: undefined,
  nickname: undefined,
  balance: '0',
  changeBalance: 0,
  changeType: 1
})
const formRules = reactive({
  changeBalance: [{ required: true, message: 'Variable balance cannot be empty', trigger: 'blur' }]
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
      const user = await UserApi.getUser(id)
      const wallet = await WalletApi.getWallet({ userId: user.id || 0 })
      formData.value.id = user.id
      formData.value.nickname = user.nickname
      formData.value.balance = formatToFraction(wallet.balance)
      formData.value.changeType = 1 // Default increase balance
      formData.value.changeBalance = 0 // Default Change Balance0
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

  if (formData.value.changeBalance <= 0) {
    message.error('Variable balance cannot be zero')
    return
  }
  if (convertToInteger(balanceResult.value) < 0) {
    message.error('The balance after the change cannot be less than 0')
    return
  }

  // Submit Request
  formLoading.value = true
  try {
    await WalletApi.updateWalletBalance({
      userId: formData.value.id,
      balance: convertToInteger(formData.value.changeBalance) * formData.value.changeType
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
    balance: '0',
    changeBalance: 0,
    changeType: 1
  }
  formRef.value?.resetFields()
}

/** Adjusted balance */
const balanceResult = computed(() =>
  formatToFraction(
    convertToInteger(formData.value.balance) +
      convertToInteger(formData.value.changeBalance) * formData.value.changeType
  )
)
</script>
