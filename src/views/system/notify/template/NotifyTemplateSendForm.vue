<template>
  <Dialog v-model="dialogVisible" title="Test Sending" :max-height="500">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-form-item label="Template Content" prop="content">
        <el-input
          v-model="formData.content"
          placeholder="Please enter the template content"
          readonly
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="User Type" prop="userType">
        <el-radio-group v-model="formData.userType">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.USER_TYPE)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="formData.userType === 1" label="RecipientID" prop="userId">
        <el-input v-model="formData.userId" style="width: 160px" />
      </el-form-item>
      <el-form-item v-show="formData.userType === 2" label="Recipient" prop="userId">
        <el-select v-model="formData.userId" placeholder="Please select recipient">
          <el-option
            v-for="item in userOption"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="param in formData.params"
        :key="param"
        :label="'Parameter {' + param + '}'"
        :prop="'templateParams.' + param"
      >
        <el-input
          v-model="formData.templateParams[param]"
          :placeholder="'Please enter ' + param + ' parameter'"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as UserApi from '@/api/system/user'
import * as NotifyTemplateApi from '@/api/system/notify/template'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

defineOptions({ name: 'SystemNotifyTemplateSendForm' })

const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  content: '',
  params: {},
  userId: undefined,
  userType: 1,
  templateCode: '',
  templateParams: new Map()
})
const formRules = reactive({
  userId: [{ required: true, message: 'User ID cannot be empty', trigger: 'change' }],
  templateCode: [{ required: true, message: 'Template Code cannot be empty', trigger: 'blur' }],
  templateParams: {}
})
const formRef = ref() // form  Ref
const userOption = ref<UserApi.UserVO[]>([])

const open = async (id: number) => {
  dialogVisible.value = true
  resetForm()
  // Set data
  formLoading.value = true
  try {
    const data = await NotifyTemplateApi.getNotifyTemplate(id)
    // Set up dynamic forms
    formData.value.content = data.content
    formData.value.params = data.params
    formData.value.templateCode = data.code
    formData.value.templateParams = data.params.reduce((obj, item) => {
      obj[item] = '' // Assign values to each dynamic attribute，Avoiding unreadable issues
      return obj
    }, {})
    formRules.templateParams = data.params.reduce((obj, item) => {
      obj[item] = { required: true, message: 'parameter ' + item + ' cannot be empty', trigger: 'blur' }
      return obj
    }, {})
  } finally {
    formLoading.value = false
  }
  // Load user list
  userOption.value = await UserApi.getSimpleUserList()
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
    const data = formData.value as unknown as NotifyTemplateApi.NotifySendReqVO
    const logId = await NotifyTemplateApi.sendNotify(data)
    if (logId) {
      message.success('The submission and sending were successful! For the sending result, please refer to the sending log number: ' + logId)
    }
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** Reset Form  */
const resetForm = () => {
  formData.value = {
    content: '',
    params: {},
    mobile: '',
    templateCode: '',
    templateParams: new Map(),
    userType: 1
  } as any
  formRef.value?.resetFields()
}
</script>
