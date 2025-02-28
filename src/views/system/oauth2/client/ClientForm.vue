<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="500px" scroll>
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="160px"
    >
      <el-form-item label="ID" prop="secret">
        <el-input v-model="formData.clientId" placeholder="Please enter the client ID" />
      </el-form-item>
      <el-form-item label="Secret" prop="secret">
        <el-input v-model="formData.secret" placeholder="Please enter the client secret" />
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the application name" />
      </el-form-item>
      <el-form-item label="Logo">
        <UploadImg v-model="formData.logo" :limit="1" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="formData.description" placeholder="Please enter the application description" type="textarea" />
      </el-form-item>
      <el-form-item label="Status" prop="status">
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
      <el-form-item label="Access Token Validity Seconds" prop="accessTokenValiditySeconds">
        <el-input-number v-model="formData.accessTokenValiditySeconds" placeholder="Unit：second" />
      </el-form-item>
      <el-form-item label="Refresh Token Validity Seconds" prop="refreshTokenValiditySeconds">
        <el-input-number v-model="formData.refreshTokenValiditySeconds" placeholder="Unit：second" />
      </el-form-item>
      <el-form-item label="Authorized Grant Type" prop="authorizedGrantTypes">
        <el-select
          v-model="formData.authorizedGrantTypes"
          filterable
          multiple
          placeholder="Please enter the authorizad grant type"
          style="width: 500px"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.SYSTEM_OAUTH2_GRANT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Scope of Authorization" prop="scopes">
        <el-select
          v-model="formData.scopes"
          filterable
          multiple
          allow-create
          placeholder="Please enter the scope of authorization"
          style="width: 500px"
        >
          <el-option v-for="scope in formData.scopes" :key="scope" :label="scope" :value="scope" />
        </el-select>
      </el-form-item>
      <el-form-item label="Auto Approve Scope" prop="autoApproveScopes">
        <el-select
          v-model="formData.autoApproveScopes"
          filterable
          multiple
          placeholder="Please enter the aotu approve scope"
          style="width: 500px"
        >
          <el-option v-for="scope in formData.scopes" :key="scope" :label="scope" :value="scope" />
        </el-select>
      </el-form-item>
      <el-form-item label="Redirect URI" prop="redirectUris">
        <el-select
          v-model="formData.redirectUris"
          allow-create
          filterable
          multiple
          placeholder="Please enter a redirect URI address"
          style="width: 500px"
        >
          <el-option
            v-for="redirectUri in formData.redirectUris"
            :key="redirectUri"
            :label="redirectUri"
            :value="redirectUri"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Authorities" prop="authorities">
        <el-select
          v-model="formData.authorities"
          allow-create
          filterable
          multiple
          placeholder="Please enter authorities"
          style="width: 500px"
        >
          <el-option
            v-for="authority in formData.authorities"
            :key="authority"
            :label="authority"
            :value="authority"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Resource" prop="resourceIds">
        <el-select
          v-model="formData.resourceIds"
          allow-create
          filterable
          multiple
          placeholder="Please enter resource"
          style="width: 500px"
        >
          <el-option
            v-for="resourceId in formData.resourceIds"
            :key="resourceId"
            :label="resourceId"
            :value="resourceId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Additional Information" prop="additionalInformation">
        <el-input
          v-model="formData.additionalInformation"
          placeholder="Please enter additional information，JSON format data"
          type="textarea"
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
import { DICT_TYPE, getDictOptions, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as ClientApi from '@/api/system/oauth2/client'

defineOptions({ name: 'SystemOAuth2ClientForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  clientId: undefined,
  secret: undefined,
  name: undefined,
  logo: undefined,
  description: undefined,
  status: CommonStatusEnum.ENABLE,
  accessTokenValiditySeconds: 30 * 60,
  refreshTokenValiditySeconds: 30 * 24 * 60,
  redirectUris: [],
  authorizedGrantTypes: [],
  scopes: [],
  autoApproveScopes: [],
  authorities: [],
  resourceIds: [],
  additionalInformation: undefined
})
const formRules = reactive({
  clientId: [{ required: true, message: 'The client ID cannot be empty', trigger: 'blur' }],
  secret: [{ required: true, message: 'The client secret cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'The application name cannot be empty', trigger: 'blur' }],
  logo: [{ required: true, message: 'The application logo cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'blur' }],
  accessTokenValiditySeconds: [
    { required: true, message: 'The validity period of the access token cannot be empty', trigger: 'blur' }
  ],
  refreshTokenValiditySeconds: [
    { required: true, message: 'The validity period of the refresh token cannot be empty', trigger: 'blur' }
  ],
  redirectUris: [{ required: true, message: 'Redirect URI address cannot be empty', trigger: 'blur' }],
  authorizedGrantTypes: [{ required: true, message: 'Authorization type cannot be empty', trigger: 'blur' }]
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
      formData.value = await ClientApi.getOAuth2Client(id)
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
    const data = formData.value as unknown as ClientApi.OAuth2ClientVO
    if (formType.value === 'create') {
      await ClientApi.createOAuth2Client(data)
      message.success(t('common.createSuccess'))
    } else {
      await ClientApi.updateOAuth2Client(data)
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
    clientId: undefined,
    secret: undefined,
    name: undefined,
    logo: undefined,
    description: undefined,
    status: CommonStatusEnum.ENABLE,
    accessTokenValiditySeconds: 30 * 60,
    refreshTokenValiditySeconds: 30 * 24 * 60,
    redirectUris: [],
    authorizedGrantTypes: [],
    scopes: [],
    autoApproveScopes: [],
    authorities: [],
    resourceIds: [],
    additionalInformation: undefined
  }
  formRef.value?.resetFields()
}
</script>
