<template>
  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    <IFrame :src="src" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { getRefreshToken } from '@/utils/auth'

defineOptions({ name: 'JimuReport' })

// The reason for using the `getRefreshToken()` method instead of the `getAccessToken()` method is that the JimuReport (Block Report) cannot easily refresh the access token.
const src = ref(import.meta.env.VITE_BASE_URL + '/jmreport/list?token=' + getRefreshToken())
</script>
