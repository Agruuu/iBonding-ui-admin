<template>
  <Dialog v-model="dialogVisible" title="Details">
    <Descriptions :data="detailData" :schema="allSchemas.detailSchema" />
  </Dialog>
</template>
<script lang="ts" setup>
import * as MailAccountApi from '@/api/system/mail/account'
import { allSchemas } from './account.data'

defineOptions({ name: 'SystemMailAccountDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref() // Detailed data

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    detailData.value = await MailAccountApi.getMailAccount(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
