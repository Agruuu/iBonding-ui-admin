<template>
  <div>
    <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="Fee Rate" label-width="180px" prop="feeRate">
          <el-input
            v-model="formData.feeRate"
            :style="{ width: '100%' }"
            clearable
            placeholder="Please enter the channel fee rate"
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="WeChat APPID" label-width="180px" prop="config.appId">
          <el-input
            v-model="formData.config.appId"
            :style="{ width: '100%' }"
            clearable
            placeholder="Please enter WeChat APPID"
          />
        </el-form-item>
        <el-form-item label-width="180px">
          <a
            href="https://pay.weixin.qq.com/index.php/extend/merchant_appid/mapay_platform/account_manage"
            target="_blank"
          >
            Go to the WeChat Merchant Platform to view the APPID.
          </a>
        </el-form-item>
        <el-form-item label="Merchant No." label-width="180px" prop="config.mchId">
          <el-input v-model="formData.config.mchId" :style="{ width: '100%' }" />
        </el-form-item>

        <el-form-item label-width="180px">
          <a href="https://pay.weixin.qq.com/index.php/extend/pay_setting" target="_blank">
            Go to the WeChat Merchant Platform to check the merchant ID.
          </a>
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
        <el-form-item label="API Version" label-width="180px" prop="config.apiVersion">
          <el-radio-group v-model="formData.config.apiVersion">
            <el-radio value="v2">v2</el-radio>
            <el-radio value="v3">v3</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="formData.config.apiVersion === 'v2'">
          <el-form-item label="Merchant Key" label-width="180px" prop="config.mchKey">
            <el-input v-model="formData.config.mchKey" clearable placeholder="Please enter merchant key" />
          </el-form-item>
          <el-form-item
            label="apiclient_cert.p12 certificate"
            label-width="180px"
            prop="config.keyContent"
          >
            <el-input
              v-model="formData.config.keyContent"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              placeholder="Please upload apiclient_cert.p12 certificate"
              readonly
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="" label-width="180px">
            <el-upload
              :before-upload="p12FileBeforeUpload"
              :http-request="keyContentUpload"
              :limit="1"
              accept=".p12"
              action=""
            >
              <el-button type="primary">
                <Icon class="mr-5px" icon="ep:upload" />
                Click to Upload
              </el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div v-if="formData.config.apiVersion === 'v3'">
          <el-form-item label="API V3 Secret Key" label-width="180px" prop="config.apiV3Key">
            <el-input
              v-model="formData.config.apiV3Key"
              clearable
              placeholder="Please enter API V3 Secret Key"
            />
          </el-form-item>
          <el-form-item
            label="apiclient_key.pem certificate"
            label-width="180px"
            prop="config.privateKeyContent"
          >
            <el-input
              v-model="formData.config.privateKeyContent"
              :autosize="{ minRows: 8, maxRows: 8 }"
              :style="{ width: '100%' }"
              placeholder="Please upload apiclient_key.pem certificate"
              readonly
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="" label-width="180px" prop="privateKeyContentFile">
            <el-upload
              ref="privateKeyContentFile"
              :before-upload="pemFileBeforeUpload"
              :http-request="privateKeyContentUpload"
              :limit="1"
              accept=".pem"
              action=""
            >
              <el-button type="primary">
                <Icon class="mr-5px" icon="ep:upload" />
                Click to Upload
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="Certificate Serial Number" label-width="180px" prop="config.certSerialNo">
            <el-input
              v-model="formData.config.certSerialNo"
              clearable
              placeholder="Please enter the certificate serial number"
            />
          </el-form-item>
          <el-form-item label-width="180px">
            <a
              href="https://pay.weixin.qq.com/index.php/core/cert/api_cert#/api-cert-manage"
              target="_blank"
            >
              Go to the WeChat Merchant Platform to view the certificate serial number.
            </a>
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

defineOptions({ name: 'WeixinChannelForm' })

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
    mchId: '',
    apiVersion: '',
    mchKey: '',
    keyContent: '',
    privateKeyContent: '',
    certSerialNo: '',
    apiV3Key: ''
  }
})
const formRules = {
  feeRate: [{ required: true, message: 'Please enter the channel rate', trigger: 'blur' }],
  status: [{ required: true, message: 'Channel status cannot be empty', trigger: 'blur' }],
  'config.mchId': [{ required: true, message: 'Please enter the merchant account', trigger: 'blur' }],
  'config.appId': [{ required: true, message: 'Please enter the MP account APPID', trigger: 'blur' }],
  'config.apiVersion': [{ required: true, message: 'APIVersion cannot be empty', trigger: 'blur' }],
  'config.mchKey': [{ required: true, message: 'Please enter merchant key', trigger: 'blur' }],
  'config.keyContent': [
    { required: true, message: 'Please upload apiclient_cert.p12 certificate', trigger: 'blur' }
  ],
  'config.privateKeyContent': [
    { required: true, message: 'Please upload apiclient_key.pem certificate', trigger: 'blur' }
  ],
  'config.certSerialNo': [{ required: true, message: 'Please enter the certificate serial number', trigger: 'blur' }],
  'config.apiV3Key': [{ required: true, message: 'Please upload api V3 Key value', trigger: 'blur' }]
}
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
    feeRate: undefined,
    remark: '',
    config: {
      appId: '',
      mchId: '',
      apiVersion: '',
      mchKey: '',
      keyContent: '',
      privateKeyContent: '',
      certSerialNo: '',
      apiV3Key: ''
    }
  }
  formRef.value?.resetFields()
}

/**
 * apiclient_cert.p12、apiclient_key.pem Verification before uploading
 */
const fileBeforeUpload = (file, fileAccept) => {
  let format = '.' + file.name.split('.')[1]
  if (format !== fileAccept) {
    message.error('Please upload in the specified format "' + fileAccept + '"f ile')
    return false
  }
  let isRightSize = file.size / 1024 / 1024 < 2
  if (!isRightSize) {
    message.error('The file size exceeds 2MB')
  }
  return isRightSize
}

const p12FileBeforeUpload = (file) => {
  fileBeforeUpload(file, '.p12')
}

const pemFileBeforeUpload = (file) => {
  fileBeforeUpload(file, '.pem')
}

/**
 * read apiclient_key.pem to privateKeyContent field
 */
const privateKeyContentUpload = async (event) => {
  const readFile = new FileReader()
  readFile.onload = (e: any) => {
    formData.value.config.privateKeyContent = e.target.result
  }
  readFile.readAsText(event.file)
}

/**
 * read apiclient_cert.p12 to keyContent field
 */
const keyContentUpload = async (event) => {
  const readFile = new FileReader()
  readFile.onload = (e: any) => {
    formData.value.config.keyContent = e.target.result.split(',')[1]
  }
  readFile.readAsDataURL(event.file) // Read as base64
}
</script>
