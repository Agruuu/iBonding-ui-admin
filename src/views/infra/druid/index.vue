<template>
  <ContentWrap :bodyStyle="{ padding: '0px' }" class="!mb-0">
    <IFrame v-if="!loading" v-loading="loading" :src="url" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import * as ConfigApi from '@/api/infra/config'

defineOptions({ name: 'InfraDruid' })

const loading = ref(true) // Is it loading
const url = ref(import.meta.env.VITE_BASE_URL + '/druid/index.html')

/** initialization */
onMounted(async () => {
  try {
    const data = await ConfigApi.getConfigKey('url.druid')
    if (data && data.length > 0) {
      url.value = data
    }
  } finally {
    loading.value = false
  }
})
</script>
