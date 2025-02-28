<template>
  <el-form
    v-show="getShow"
    ref="formLogin"
    :model="registerData.registerForm"
    :rules="registerRules"
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
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="username">
          <el-input
            v-model="registerData.registerForm.username"
            :placeholder="t('login.username')"
            size="large"
            :prefix-icon="iconAvatar"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="username">
          <el-input
            v-model="registerData.registerForm.nickname"
            placeholder="Nickname"
            size="large"
            :prefix-icon="iconAvatar"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="password">
          <el-input
            v-model="registerData.registerForm.password"
            type="password"
            auto-complete="off"
            :placeholder="t('login.password')"
            size="large"
            :prefix-icon="iconLock"
            show-password
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerData.registerForm.confirmPassword"
            type="password"
            size="large"
            auto-complete="off"
            :placeholder="t('login.checkPassword')"
            :prefix-icon="iconLock"
            show-password
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <XButton
            :loading="loginLoading"
            :title="t('login.register')"
            class="w-[100%]"
            type="primary"
            @click="getCode()"
          />
        </el-form-item>
      </el-col>
      <Verify
        v-if="registerData.captchaEnable === 'true'"
        ref="verify"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        mode="pop"
        @success="handleRegister"
      />
    </el-row>
    <XButton :title="t('login.hasUser')" class="w-[100%]" @click="handleBackLogin()" />
  </el-form>
</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import LoginFormTitle from './LoginFormTitle.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'
import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useLoginState } from './useLogin'

defineOptions({ name: 'RegisterForm' })

const { t } = useI18n()
const iconHouse = useIcon({ icon: 'ep:house' })
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { handleBackLogin, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle slider clickWord Click on the text

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER)

const equalToPassword = (rule, value, callback) => {
  if (registerData.registerForm.password !== value) {
    callback(new Error('The passwords entered twice are inconsistent'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, trigger: 'blur', message: 'Please enter your account' },
    { min: 4, max: 30, message: 'The length of the user account must be between 4 and 30 characters', trigger: 'blur' }
  ],
  nickname: [
    { required: true, trigger: 'blur', message: 'Please enter your nickname' },
    { min: 0, max: 30, message: 'Nickname length must be between 0 and 30 between', trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', message: 'Please enter your password' },
    { min: 5, max: 20, message: 'The length of the user password must be between 5 and 20 characters', trigger: 'blur' },
    { pattern: /^[^<>"'|\\]+$/, message: 'Cannot contain illegal characters：< > " \' \\\ |', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: 'Please enter your password again' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
}

const registerData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  registerForm: {
    nickname: '',
    username: '',
    password: '',
    confirmPassword: '',
    captchaVerification: ''
  }
})

// Submit registration
const handleRegister = async (params: any) => {
  loading.value = true
  try {
    if (registerData.captchaEnable) {
      registerData.registerForm.captchaVerification = params.captchaVerification
    }

    const res = await LoginApi.register(registerData.registerForm)
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: 'Loading into the system...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    authUtil.removeLoginForm()

    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    // Determine whether it is SSO login.
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value.close()
  }
}

// Obtain verification code
const getCode = async () => {
  // Situation 1，Not activated：Register directly
  if (registerData.captchaEnable === 'false') {
    await handleRegister({})
  } else {
    // Scenario 2，Opened：Display the verification code；Only when the verification code is completed，Just registered
    // Pop up verification code
    verify.value.show()
  }
}

const loading = ref() // ElLoading.service Returned instances

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  // getCookie()
  // getTenantByWebsite()
})
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
