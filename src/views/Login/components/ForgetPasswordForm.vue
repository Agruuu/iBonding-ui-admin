<template>
  <el-form
    v-show="getShow"
    ref="formSmsResetPassword"
    :model="resetPasswordData"
    :rules="rules"
    class="login-form"
    label-position="top"
    label-width="120px"
    size="large"
  >
    <el-row style="margin-right: -10px; margin-left: -10px">
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <LoginFormTitle style="width: 100%" />
        </el-form-item>
      </el-col>
      <!-- cell-phone number -->
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="mobile">
          <el-input
            v-model="resetPasswordData.mobile"
            :placeholder="t('login.mobileNumberPlaceholder')"
            :prefix-icon="iconCellphone"
          />
        </el-form-item>
      </el-col>
      <Verify
        ref="verify"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        mode="pop"
        @success="getSmsCode"
      />
      <!-- Verification Code -->
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="code">
          <el-row :gutter="5" justify="space-between" style="width: 100%">
            <el-col :span="24">
              <el-input
                v-model="resetPasswordData.code"
                :placeholder="t('login.codePlaceholder')"
                :prefix-icon="iconCircleCheck"
              >
                <template #append>
                  <span
                    v-if="mobileCodeTimer <= 0"
                    class="getMobileCode"
                    style="cursor: pointer"
                    @click="getCode"
                  >
                    {{ t('login.getSmsCode') }}
                  </span>
                  <span v-if="mobileCodeTimer > 0" class="getMobileCode" style="cursor: pointer">
                    You can request the verification code again after {{ mobileCodeTimer }} seconds
                  </span>
                </template>
              </el-input>
              <!-- </el-button> -->
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="password">
          <InputPassword
            v-model="resetPasswordData.password"
            :placeholder="t('login.passwordPlaceholder')"
            style="width: 100%"
            strength="true"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="check_password">
          <InputPassword
            v-model="resetPasswordData.check_password"
            :placeholder="t('login.checkPassword')"
            style="width: 100%"
            strength="true"
          />
        </el-form-item>
      </el-col>
      <!-- Login button / Return button -->
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <XButton
            :loading="loginLoading"
            :title="t('login.resetPassword')"
            class="w-[100%]"
            type="primary"
            @click="resetPassword()"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <XButton
            :loading="loginLoading"
            :title="t('login.backLogin')"
            class="w-[100%]"
            @click="handleBackLogin()"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useIcon } from '@/hooks/web/useIcon'

import { sendSmsCode, smsResetPassword } from '@/api/login'
import LoginFormTitle from './LoginFormTitle.vue'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'
import { ElLoading } from 'element-plus'
import * as authUtil from '@/utils/auth'
import * as LoginApi from '@/api/login'
defineOptions({ name: 'ForgetPasswordForm' })
const verify = ref()

const { t } = useI18n()
const message = useMessage()
const { currentRoute, push } = useRouter()
const formSmsResetPassword = ref()
const loginLoading = ref(false)
const iconHouse = useIcon({ icon: 'ep:house' })
const iconCellphone = useIcon({ icon: 'ep:cellphone' })
const iconCircleCheck = useIcon({ icon: 'ep:circle-check' })
const { validForm } = useFormValid(formSmsResetPassword)
const { handleBackLogin, getLoginState, setLoginState } = useLoginState()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD)
const captchaType = ref('blockPuzzle') // blockPuzzle slider clickWord Click on the text

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please enter your password again'))
  } else if (value !== resetPasswordData.password) {
    callback(new Error('The password entered twice is inconsistent!'))
  } else {
    callback()
  }
}

const rules = {
  mobile: [{ required: true, min: 11, max: 11, trigger: 'blur', message: 'The length of the mobile phone number should be 11 digits' }],
  password: [
    {
      required: true,
      min: 4,
      max: 16,
      validator: validatePass2,
      trigger: 'blur',
      message: 'The length should be between 4 and 16 characters'
    }
  ],
  check_password: [{ required: true, validator: validatePass2, trigger: 'blur' }],
  code: [required]
}

const resetPasswordData = reactive({
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  username: '',
  password: '',
  check_password: '',
  mobile: '',
  code: ''
})

const smsVO = reactive({
  mobile: '',
  captchaVerification: '',
  scene: 23
})
const mobileCodeTimer = ref(0)
const redirect = ref<string>('')

// Obtain verification code
const getCode = async () => {
  // Situation 1，Not activated：Then send the verification code directly
  if (resetPasswordData.captchaEnable === 'false') {
    await getSmsCode({})
  } else {
    // Scenario 2，Opened：Display the verification code；Only when the verification code is completed，Just sent the verification code
    // Pop up verification code
    verify.value.show()
  }
}

const getSmsCode = async (params) => {
  smsVO.captchaVerification = params.captchaVerification
  smsVO.mobile = resetPasswordData.mobile
  await sendSmsCode(smsVO).then(async () => {
    message.success(t('login.SmsSendMsg'))
    // Set countdown
    mobileCodeTimer.value = 60
    let msgTimer = setInterval(() => {
      mobileCodeTimer.value = mobileCodeTimer.value - 1
      if (mobileCodeTimer.value <= 0) {
        clearInterval(msgTimer)
      }
    }, 1000)
  })
}
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)


// reset password 
const resetPassword = async () => {
  const data = await validForm()
  if (!data) return
  loginLoading.value = true
  await smsResetPassword(resetPasswordData)
    .then(async () => {
      message.success(t('login.resetPasswordSuccess'))
      setLoginState(LoginStateEnum.LOGIN)
    })
    .catch(() => {})
    .finally(() => {
      loginLoading.value = false
      setTimeout(() => {
        const loadingInstance = ElLoading.service()
        loadingInstance.close()
      }, 400)
    })
}
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.smsbtn {
  margin-top: 33px;
}
</style>
