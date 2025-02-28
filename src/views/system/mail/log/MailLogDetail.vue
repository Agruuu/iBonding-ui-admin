<template>
  <Dialog v-model="dialogVisible" :max-height="500" :scroll="true" title="Details">
    <Descriptions :data="detailData" :schema="allSchemas.detailSchema">
      <!-- Exhibition HTML content -->
      <template #templateContent="{ row }">
        <div v-dompurify-html="row.templateContent"></div>
      </template>
    </Descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import * as MailLogApi from '@/api/system/mail/log'
import { allSchemas } from './log.data'

defineOptions({ name: 'SystemMailLogDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref() // Detailed data

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    detailData.value = await MailLogApi.getMailLog(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
