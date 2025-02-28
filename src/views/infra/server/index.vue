<template>
  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    <IFrame v-if="!loading" v-loading="loading" :src="src" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import * as ConfigApi from '@/api/infra/config'

defineOptions({ name: 'InfraAdminServer' })

const loading = ref(true) // Is it loading
const src = ref(import.meta.env.VITE_BASE_URL + '/admin/applications')

/** initialization */
onMounted(async () => {
  try {
    // Friendly reminder：There may be a 404 issue
    const data = await ConfigApi.getConfigKey('url.spring-boot-admin')
    if (data && data.length > 0) {
      src.value = data
    }
  } finally {
    loading.value = false
  }
})
</script>
