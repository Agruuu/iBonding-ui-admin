<template>
  <div v-show="ssoVisible" class="form-cont">
    <!-- Application Name -->
    <LoginFormTitle style="width: 100%" />
    <el-tabs class="form" style="float: none" value="uname">
      <el-tab-pane :label="client.name" name="uname" />
    </el-tabs>
    <div>
      <el-form :model="formData" class="login-form">
        <!-- Selection of Authorization Scope -->
        This third-party application requests the following permissions:
        <el-form-item prop="scopes">
          <el-checkbox-group v-model="formData.scopes">
            <el-checkbox
              v-for="scope in queryParams.scopes"
              :key="scope"
              :value="scope"
              style="display: block; margin-bottom: -10px"
            >
              {{ formatScope(scope) }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- The login button below -->
        <el-form-item class="w-1/1">
          <el-button
            :loading="formLoading"
            class="w-6/10"
            type="primary"
            @click.prevent="handleAuthorize(true)"
          >
            <span v-if="!formLoading">Agree to authorize</span>
            <span v-else>Authorizing...</span>
          </el-button>
          <el-button class="w-3/10" @click.prevent="handleAuthorize(false)">Refuse</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LoginFormTitle from './LoginFormTitle.vue'
import * as OAuth2Api from '@/api/login/oauth2'
import { LoginStateEnum, useLoginState } from './useLogin'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

defineOptions({ name: 'SSOLogin' })

const route = useRoute() // route
const { currentRoute } = useRouter() // route
const { getLoginState, setLoginState } = useLoginState()

const client = ref({
  // Client Information
  name: '',
  logo: ''
})
interface queryType {
  responseType: string
  clientId: string
  redirectUri: string
  state: string
  scopes: string[]
}
const queryParams = reactive<queryType>({
  // Parameters such as "client_id" and "scope" in the URL.
  responseType: '',
  clientId: '',
  redirectUri: '',
  state: '',
  scopes: [] // Retrieve the parameters from the query parameters first. If they are not passed, obtain them from the backend.
})
const ssoVisible = computed(() => unref(getLoginState) === LoginStateEnum.SSO) // Is it displayed SSO Login form
interface formType {
  scopes: string[]
}
const formData = reactive<formType>({
  scopes: [] // Selected scope array
})
const formLoading = ref(false) // Is the form being submitted

/** Initialize authorization information */
const init = async () => {
  // Prevent recurring pop ups without logging in
  if (typeof route.query.client_id === 'undefined') return
  // Analyze parameters
  // For example, say【Automatic authorization failed】：client_id=default&redirect_uri=https%3A%2F%2Fwww.ibonding.com&response_type=code&scope=user.read%20user.write
  // For example, say【Automatic authorization passed】：client_id=default&redirect_uri=https%3A%2F%2Fwww.ibonding.com&response_type=code&scope=user.read
  queryParams.responseType = route.query.response_type as string
  queryParams.clientId = route.query.client_id as string
  queryParams.redirectUri = route.query.redirect_uri as string
  queryParams.state = route.query.state as string
  if (route.query.scope) {
    queryParams.scopes = (route.query.scope as string).split(' ')
  }

  // If there is scope parameter，Perform automatic authorization once first，Check if it has been authorized before。
  if (queryParams.scopes.length > 0) {
    const data = await doAuthorize(true, queryParams.scopes, [])
    if (data) {
      location.href = data
      return
    }
  }

  // Basic information of obtaining authorization page
  const data = await OAuth2Api.getAuthorize(queryParams.clientId)
  client.value = data.client
  // analysis scope
  let scopes
  // 1.1 If `params.scope` is not empty, filter the returned `scopes`.
  if (queryParams.scopes.length > 0) {
    scopes = []
    for (const scope of data.scopes) {
      if (queryParams.scopes.indexOf(scope.key) >= 0) {
        scopes.push(scope)
      }
    }
    // 1.2 If `params.scope` is empty, set it with the returned `scopes`.
  } else {
    scopes = data.scopes
    for (const scope of scopes) {
      queryParams.scopes.push(scope.key)
    }
  }
  // Generate selected ones checkedScopes
  for (const scope of scopes) {
    if (scope.value) {
      formData.scopes.push(scope.key)
    }
  }
}

/** Submit authorization processing */
const handleAuthorize = async (approved) => {
  // calculation checkedScopes + uncheckedScopes
  let checkedScopes
  let uncheckedScopes
  if (approved) {
    // Agree to authorize，According to the user's choice
    checkedScopes = formData.scopes
    uncheckedScopes = queryParams.scopes.filter((item) => checkedScopes.indexOf(item) === -1)
  } else {
    // refuse，All of them are cancelled
    checkedScopes = []
    uncheckedScopes = queryParams.scopes
  }
  // Submit authorization request
  formLoading.value = true
  try {
    const data = await doAuthorize(false, checkedScopes, uncheckedScopes)
    if (!data) {
      return
    }
    location.href = data
  } finally {
    formLoading.value = false
  }
}

/** Call authorization API interface */
const doAuthorize = (autoApprove, checkedScopes, uncheckedScopes) => {
  return OAuth2Api.authorize(
    queryParams.responseType,
    queryParams.clientId,
    queryParams.redirectUri,
    queryParams.state,
    autoApprove,
    checkedScopes,
    uncheckedScopes
  )
}

/** format scope text */
const formatScope = (scope) => {
  // Format the scope of authorization to make it easier for users to understand.
  // This is just a demo. You can consider entering the data into the dictionary. For example, for the dictionary type "system_oauth2_scope", each scope is an entry in the dictionary data.
  switch (scope) {
    case 'user.read':
      return 'Accessing your personal information'
    case 'user.write':
      return 'Modify your personal information'
    default:
      return scope
  }
}

/** Monitor the current route as SSOLogin When，Initialize data */
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    if (route.name === 'SSOLogin') {
      setLoginState(LoginStateEnum.SSO)
      init()
    }
  },
  { immediate: true }
)
</script>
