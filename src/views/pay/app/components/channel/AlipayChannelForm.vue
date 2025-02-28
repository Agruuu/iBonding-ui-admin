<template>
  <div>
    <Dialog v-model="dialogVisible" :title="dialogTitle" width="830px" @closed="close">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="Fee Rate" label-width="180px" prop="feeRate">
          <el-input v-model="formData.feeRate" clearable placeholder="Please enter the fee rate">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Open Platform APPID" label-width="180px" prop="config.appId">
          <el-input v-model="formData.config.appId" clearable placeholder="Please enter open platform APPID" />
        </el-form-item>
        <el-form-item label="Status" label-width="180px" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio
              v-for="dict in getDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="parseInt(dict.value)"
              :value="parseInt(dict.value)"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Gateway Url" label-width="180px" prop="config.serverUrl">
          <el-radio-group v-model="formData.config.serverUrl">
            <el-radio value="https://openapi.alipay.com/gateway.do">Online Environment</el-radio>
            <el-radio value="https://openapi-sandbox.dl.alipaydev.com/gateway.do">
              Sandbox Environment 
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="AlgorithmType" label-width="180px" prop="config.signType">
          <el-radio-group v-model="formData.config.signType">
            <el-radio key="RSA2" value="RSA2">RSA2</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Public Key Type" label-width="180px" prop="config.mode">
          <el-radio-group v-model="formData.config.mode">
            <el-radio key="Public Key Mode" :value="1">Public Key Mode</el-radio>
            <el-radio key="Certificate Mode" :value="2">Certificate Mode</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="formData.config.mode === 1">
          <el-form-item label="Apply Private Key" label-width="180px" prop="config.privateKey">
            <el-input
              v-model="formData.config.privateKey"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              clearable
              placeholder="Please enter the application private key"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="Alipay Public Key" label-width="180px" prop="config.alipayPublicKey">
            <el-input
              v-model="formData.config.alipayPublicKey"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              clearable
              placeholder="Please enter Alipay public key"
              type="textarea"
            />
          </el-form-item>
        </div>
        <div v-if="formData.config.mode === 2">
          <el-form-item label="Apply Private Key" label-width="180px" prop="config.privateKey">
            <el-input
              v-model="formData.config.privateKey"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              clearable
              placeholder="Please enter the application private key"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="Merchant App Cert" label-width="180px" prop="config.appCertContent">
            <el-input
              v-model="formData.config.appCertContent"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              placeholder="Please upload the merchant's public key application certificate"
              readonly
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="" label-width="180px">
            <el-upload
              ref="privateKeyContentFile"
              :accept="fileAccept"
              :before-upload="fileBeforeUpload"
              :http-request="appCertUpload"
              :limit="1"
              action=""
            >
              <el-button type="primary">
                <Icon class="mr-5px" icon="ep:upload" />
                Click to Upload
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="Alipay Public Key Cert"
            label-width="180px"
            prop="config.alipayPublicCertContent"
          >
            <el-input
              v-model="formData.config.alipayPublicCertContent"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              placeholder="Please upload Alipay public key certificate"
              readonly
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="" label-width="180px">
            <el-upload
              ref="privateCertContentFile"
              :accept="fileAccept"
              :before-upload="fileBeforeUpload"
              :http-request="alipayPublicCertUpload"
              :limit="1"
              action=""
            >
              <el-button type="primary">
                <Icon class="mr-5px" icon="ep:upload" />
                Click to Upload
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="Root Certificate" label-width="180px" prop="config.rootCertContent">
            <el-input
              v-model="formData.config.rootCertContent"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              placeholder="Please upload the root certificate"
              readonly
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="" label-width="180px">
            <el-upload
              ref="privateCertContentFile"
              :accept="fileAccept"
              :before-upload="fileBeforeUpload"
              :http-request="rootCertUpload"
              :limit="1"
              action=""
            >
              <el-button type="primary">
                <Icon class="mr-5px" icon="ep:upload" />
                Click to Upload
              </el-button>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item label="Encrypt Type" label-width="180px" prop="config.encryptType">
          <el-radio-group v-model="formData.config.encryptType">
            <el-radio key="NONE" label="">No Encrypt</el-radio>
            <el-radio key="AES" label="AES">AES</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="formData.config.encryptType === 'AES'">
          <el-form-item label="Encrypt Key" label-width="180px" prop="config.encryptKey">
            <el-input
              v-model="formData.config.encryptKey"
              clearable
              placeholder="Please enter the encryption key for the interface content"
            />
          </el-form-item>
        </div>

        <el-form-item label="Remarks" label-width="180px" prop="remark">
          <el-input v-model="formData.remark" :style="{ width: '100%' }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { CommonStatusEnum } from '@/utils/constants'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
import * as ChannelApi from '@/api/pay/channel'

defineOptions({ name: 'AlipayChannelForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref<any>({
  appId: '',
  code: '',
  status: undefined,
  feeRate: undefined,
  remark: '',
  config: {
    appId: '',
    serverUrl: null,
    signType: '',
    mode: null,
    privateKey: '',
    alipayPublicKey: '',
    appCertContent: '',
    alipayPublicCertContent: '',
    rootCertContent: '',
    encryptType: '',
    encryptKey: ''
  }
})
const formRules = {
  feeRate: [{ required: true, message: 'Please enter the channel fee rate', trigger: 'blur' }],
  status: [{ required: true, message: 'Channel status cannot be empty', trigger: 'blur' }],
  'config.appId': [{ required: true, message: 'Please enter the application created on the open platform ID', trigger: 'blur' }],
  'config.serverUrl': [{ required: true, message: 'Please provide the gateway address', trigger: 'blur' }],
  'config.signType': [{ required: true, message: 'Please input the type of signature algorithm', trigger: 'blur' }],
  'config.mode': [{ required: true, message: 'The public key type cannot be empty', trigger: 'blur' }],
  'config.privateKey': [{ required: true, message: 'Please enter the merchants private key', trigger: 'blur' }],
  'config.alipayPublicKey': [
    { required: true, message: 'Please enter Alipay public key string', trigger: 'blur' }
  ],
  'config.appCertContent': [{ required: true, message: 'Please upload the merchants public key application certificate', trigger: 'blur' }],
  'config.alipayPublicCertContent': [
    { required: true, message: 'Please upload Alipay public key certificate', trigger: 'blur' }
  ],
  'config.rootCertContent': [{ required: true, message: 'Please upload the specified root certificate', trigger: 'blur' }],
  'config.encryptKey': [{ required: true, message: 'Please enter the encryption key for the interface content', trigger: 'blur' }]
}
const fileAccept = '.crt'
const formRef = ref() // form  Ref

/** Open pop-up window */
const open = async (appId, code) => {
  dialogVisible.value = true
  formLoading.value = true
  resetForm(appId, code)
  // Load data
  try {
    const data = await ChannelApi.getChannel(appId, code)
    if (data && data.id) {
      formData.value = data
      formData.value.config = JSON.parse(data.config)
    }
    dialogTitle.value = !formData.value.id ? 'Create payment channels' : 'Edit payment channels'
  } finally {
    formLoading.value = false
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
    const data = { ...formData.value } as unknown as ChannelApi.ChannelVO
    data.config = JSON.stringify(formData.value.config)
    if (!data.id) {
      await ChannelApi.createChannel(data)
      message.success(t('common.createSuccess'))
    } else {
      await ChannelApi.updateChannel(data)
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
const resetForm = (appId, code) => {
  formData.value = {
    appId: appId,
    code: code,
    status: CommonStatusEnum.ENABLE,
    remark: '',
    feeRate: null,
    config: {
      appId: '',
      serverUrl: null,
      signType: 'RSA2',
      mode: null,
      privateKey: '',
      alipayPublicKey: '',
      appCertContent: '',
      alipayPublicCertContent: '',
      rootCertContent: '',
      encryptType: '',
      encryptKey: ''
    }
  }
  formRef.value?.resetFields()
}

const fileBeforeUpload = (file) => {
  let format = '.' + file.name.split('.')[1]
  if (format !== fileAccept) {
    message.error(`Please upload in the specified format "${fileAccept}" file`)
    return false
  }
  let isRightSize = file.size / 1024 / 1024 < 2
  if (!isRightSize) {
    message.error('The file size exceeds 2MB')
  }
  return isRightSize
}

const appCertUpload = (event) => {
  const readFile = new FileReader()
  readFile.onload = (e: any) => {
    formData.value.config.appCertContent = e.target.result
  }
  readFile.readAsText(event.file)
}

const alipayPublicCertUpload = (event) => {
  const readFile = new FileReader()
  readFile.onload = (e: any) => {
    formData.value.config.alipayPublicCertContent = e.target.result
  }
  readFile.readAsText(event.file)
}

const rootCertUpload = (event) => {
  const readFile = new FileReader()
  readFile.onload = (e: any) => {
    formData.value.config.rootCertContent = e.target.result
  }
  readFile.readAsText(event.file)
}
</script>
