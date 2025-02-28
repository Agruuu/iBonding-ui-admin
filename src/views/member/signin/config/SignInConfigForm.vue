<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="Check in days" prop="day">
        <el-input-number v-model="formData.day" :min="1" :max="7" :precision="0" />
        <el-text class="mx-1" style="margin-left: 10px" type="danger">
          Only allow settings 1-7，Default check-in 7 Day is a cycle
        </el-text>
      </el-form-item>
      <el-form-item label="Reward Points" prop="point">
        <el-input-number v-model="formData.point" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="Reward Experience" prop="experience">
        <el-input-number v-model="formData.experience" :min="0" :precision="0" />
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
<script lang="ts" setup>
import * as SignInConfigApi from '@/api/member/signin/config'
import { CommonStatusEnum } from '@/utils/constants'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref<SignInConfigApi.SignInConfigVO>({} as SignInConfigApi.SignInConfigVO)
// Reward verification rules
const awardValidator = (rule: any, _value: any, callback: any) => {
  if (!formData.value.point && !formData.value.experience) {
    callback(new Error('At least one reward point and reward experience should be configured'))
    return
  }

  // Clear the error prompt for another field
  const otherAwardField = rule?.field === 'point' ? 'experience' : 'point'
  formRef.value.validateField(otherAwardField, () => null)
  callback()
}
const formRules = reactive({
  day: [{ required: true, message: 'Check in days cannot be empty', trigger: 'blur' }],
  point: [
    { required: true, message: 'Reward points cannot be empty', trigger: 'blur' },
    { validator: awardValidator, trigger: 'blur' }
  ],
  experience: [
    { required: true, message: 'Reward experience cannot be empty', trigger: 'blur' },
    { validator: awardValidator, trigger: 'blur' }
  ]
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
      formData.value = await SignInConfigApi.getSignInConfig(id)
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
    if (formType.value === 'create') {
      await SignInConfigApi.createSignInConfig(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await SignInConfigApi.updateSignInConfig(formData.value)
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
    day: undefined,
    point: 0,
    experience: 0,
    status: CommonStatusEnum.ENABLE
  }
  formRef.value?.resetFields()
}
</script>
