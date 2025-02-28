<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px lt-xl:px-10px"
  >
    <div class="relative mx-auto h-full flex">
      <div
        :class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px lt-xl:hidden overflow-x-hidden overflow-y-auto`"
      >
        <!-- The one in the upper left corner logo + System Title -->
        <div class="relative flex items-center text-white">
          <img alt="" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />
          <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <!-- Background image on the left + Welcome language -->
        <div class="h-[calc(100%-60px)] flex items-center justify-center">
          <TransitionGroup
            appear
            enter-active-class="animate__animated animate__bounceInLeft"
            tag="div"
          >
            <img key="1" alt="" class="w-350px" src="@/assets/svgs/login-box-bg.svg" />
            <div key="2" class="text-3xl text-white">{{ t('login.welcome') }}</div>
            <div key="3" class="mt-5 text-14px font-normal text-white">
              {{ t('login.message') }}
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div
        class="relative flex-1 p-30px dark:bg-[var(--login-bg-color)] lt-sm:p-10px overflow-x-hidden overflow-y-auto"
      >
        <!-- Theme in the upper right corner、Language selection -->
        <div
          class="flex items-center justify-between text-white at-2xl:justify-end at-xl:justify-end"
        >
          <div class="flex items-center at-2xl:hidden at-xl:hidden">
            <img alt="" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>
          <div class="flex items-center justify-end space-x-10px h-48px">
            <ThemeSwitch />
          </div>
        </div>
        <!-- The login interface on the right -->
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="m-auto h-[calc(100%-60px)] w-[100%] flex items-center at-2xl:max-w-500px at-lg:max-w-500px at-md:max-w-500px at-xl:max-w-500px"
          >
            <!-- Account login -->
            <el-form
              v-show="getShow"
              ref="formLogin"
              :model="loginData.loginForm"
              :rules="LoginRules"
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
                      v-model="loginData.loginForm.username"
                      :placeholder="t('login.usernamePlaceholder')"
                      :prefix-icon="iconAvatar"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
                  <el-form-item prop="password">
                    <el-input
                      v-model="loginData.loginForm.password"
                      :placeholder="t('login.passwordPlaceholder')"
                      :prefix-icon="iconLock"
                      show-password
                      type="password"
                      @keyup.enter="getCode()"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="24"
                  style="
                    padding-right: 10px;
                    padding-left: 10px;
                    margin-top: -20px;
                    margin-bottom: -20px;
                  "
                >
                  <el-form-item>
                    <el-row justify="space-between" style="width: 100%">
                      <el-col :span="6">
                        <el-checkbox v-model="loginData.loginForm.rememberMe">
                          {{ t('login.remember') }}
                        </el-checkbox>
                      </el-col>
                      <el-col :offset="6" :span="12">
                        <el-link style="float: right" type="primary"
                          >{{ t('login.forgetPassword') }}
                        </el-link>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
                  <el-form-item>
                    <XButton
                      :loading="loginLoading"
                      :title="t('login.login')"
                      class="w-[100%]"
                      type="primary"
                      @click="getCode()"
                    />
                  </el-form-item>
                </el-col>
                <Verify
                  v-if="loginData.captchaEnable === true"
                  ref="verify"
                  :captchaType="captchaType"
                  :imgSize="{ width: '400px', height: '200px' }"
                  mode="pop"
                  @success="handleLogin"
                />
              </el-row>
            </el-form>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { ElLoading } from 'element-plus'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { useIcon } from '@/hooks/web/useIcon'
import { usePermissionStore } from '@/store/modules/permission'

import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LoginStateEnum, useFormValid, useLoginState } from './components/useLogin'
import LoginFormTitle from './components/LoginFormTitle.vue'
import router from '@/router'

defineOptions({ name: 'SocialLogin' })

const { t } = useI18n()
const route = useRoute()

const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
const iconHouse = useIcon({ icon: 'ep:house' })
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref<any>()
const { validForm } = useFormValid(formLogin)
const { getLoginState } = useLoginState()
const { push } = useRouter()
const permissionStore = usePermissionStore()
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle slider clickWord Click on the text

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE !== 'false',
  loginForm: {
    username: 'admin',
    password: 'admin123',
    captchaVerification: '',
    rememberMe: false
  }
})

// Obtain verification code
const getCode = async () => {
  // Situation 1，Not activated：Then log in directly
  if (!loginData.captchaEnable) {
    await handleLogin({})
  } else {
    // Scenario 2，Opened：Display the verification code；Only when the verification code is completed，Just logged in
    // Pop up verification code
    verify.value.show()
  }
}
// Remember me
const getCookie = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe ? true : false
    }
  }
}
const loading = ref() // ElLoading.service Returned instances

// tricky: In conjunction with the `redirectUri` in `LoginForm.vue`, the parameters need to be encoded. And they need to be decoded after the callback.
function getUrlValue(key: string): string {
  const url = new URL(decodeURIComponent(location.href))
  return url.searchParams.get(key) ?? ''
}

// Try logging in: When the account is already bound, `socialLogin` will directly obtain the token.
const tryLogin = async () => {
  try {
    const type = getUrlValue('type')
    const redirect = getUrlValue('redirect')
    const code = route?.query?.code as string
    const state = route?.query?.state as string

    const res = await LoginApi.socialLogin(type, code, state)
    authUtil.setToken(res)

    router.push({ path: redirect || '/' })
  } catch (err) {}
}

// Sign in
const handleLogin = async (params) => {
  loginLoading.value = true
  try {
    const data = await validForm()
    if (!data) {
      return
    }

    let redirect = getUrlValue('redirect')

    const type = getUrlValue('type')
    const code = route?.query?.code as string
    const state = route?.query?.state as string

    const loginDataLoginForm = { ...loginData.loginForm }
    const res = await LoginApi.login({
      // Account password login
      username: loginDataLoginForm.username,
      password: loginDataLoginForm.password,
      captchaVerification: params.captchaVerification,
      // Social login
      socialCode: code,
      socialState: state,
      socialType: type
    })
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: 'Loading into the system...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginDataLoginForm.rememberMe) {
      authUtil.setLoginForm(loginDataLoginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect) {
      redirect = '/'
    }
    // Determine whether it is SSO login.
    if (redirect.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      push({ path: redirect || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value.close()
  }
}

onMounted(() => {
  getCookie()
  tryLogin()
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
</style>
