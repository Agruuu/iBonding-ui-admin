<template>
  <el-table :data="socialUsers" :show-header="false">
    <el-table-column fixed="left" title="ID" type="seq" width="60" />
    <el-table-column align="left" label="Social Media Platforms" width="120">
      <template #default="{ row }">
        <img :src="row.img" alt="" class="h-5 align-middle" />
        <p class="mr-5">{{ row.title }}</p>
      </template>
    </el-table-column>
    <el-table-column align="center" label="Operation">
      <template #default="{ row }">
        <template v-if="row.openid">
          Already Bound
          <XTextButton class="mr-5" title="(Unbind)" type="primary" @click="unbind(row)" />
        </template>
        <template v-else>
          Unbound
          <XTextButton class="mr-5" title="(Bind)" type="primary" @click="bind(row)" />
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import { SystemUserSocialTypeEnum } from '@/utils/constants'
import { getUserProfile, ProfileVO } from '@/api/system/user/profile'
import { socialAuthRedirect, socialBind, socialUnbind } from '@/api/system/user/socialUser'

defineOptions({ name: 'UserSocial' })
defineProps<{
  activeName: string
}>()
const message = useMessage()
const socialUsers = ref<any[]>([])
const userInfo = ref<ProfileVO>()

const initSocial = async () => {
  socialUsers.value = [] // Reset to avoid infinite growth
  const res = await getUserProfile()
  userInfo.value = res
  for (const i in SystemUserSocialTypeEnum) {
    const socialUser = { ...SystemUserSocialTypeEnum[i] }
    socialUsers.value.push(socialUser)
    if (userInfo.value?.socialUsers) {
      for (const j in userInfo.value.socialUsers) {
        if (socialUser.type === userInfo.value.socialUsers[j].type) {
          socialUser.openid = userInfo.value.socialUsers[j].openid
          break
        }
      }
    }
  }
}
const route = useRoute()
const emit = defineEmits<{
  (e: 'update:activeName', v: string): void
}>()
const bindSocial = () => {
  // Social binding
  const type = getUrlValue('type')
  const code = route.query.code
  const state = route.query.state
  if (!code) {
    return
  }
  socialBind(type, code, state).then(() => {
    message.success('Binding Successful')
    emit('update:activeName', 'userSocial')
  })
}

// Double-layer encoding is applied, and the parameters need to be decoded after the callback.
function getUrlValue(key: string): string {
  const url = new URL(decodeURIComponent(location.href))
  return url.searchParams.get(key) ?? ''
}

const bind = (row) => {
  // Double-layer encoding can solve the problem of the "type" parameter being lost during the DingTalk callback.
  const redirectUri = location.origin + '/user/profile?' + encodeURIComponent(`type=${row.type}`)
  // Perform a jump
  socialAuthRedirect(row.type, encodeURIComponent(redirectUri)).then((res) => {
    window.location.href = res
  })
}
const unbind = async (row) => {
  const res = await socialUnbind(row.type, row.openid)
  if (res) {
    row.openid = undefined
  }
  message.success('Unbind Successfully')
}

onMounted(async () => {
  await initSocial()
})

watch(
  () => route,
  () => {
    bindSocial()
  },
  {
    immediate: true
  }
)
</script>
