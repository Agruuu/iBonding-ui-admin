<template>
  <Dialog v-model="dialogVisible" :max-height="500" :scroll="true" title="details">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID" min-width="120">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="User Type">
        <dict-tag :type="DICT_TYPE.USER_TYPE" :value="detailData.userType" />
      </el-descriptions-item>
      <el-descriptions-item label="User ID">
        {{ detailData.userId }}
      </el-descriptions-item>
      <el-descriptions-item label="Template ID">
        {{ detailData.templateId }}
      </el-descriptions-item>
      <el-descriptions-item label="Template Code">
        {{ detailData.templateCode }}
      </el-descriptions-item>
      <el-descriptions-item label="Sender Name">
        {{ detailData.templateNickname }}
      </el-descriptions-item>
      <el-descriptions-item label="Template Content">
        {{ detailData.templateContent }}
      </el-descriptions-item>
      <el-descriptions-item label="Template Parameters">
        {{ detailData.templateParams }}
      </el-descriptions-item>
      <el-descriptions-item label="Template Type">
        <dict-tag :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE" :value="detailData.templateType" />
      </el-descriptions-item>
      <el-descriptions-item label="Read Status">
        <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="detailData.readStatus" />
      </el-descriptions-item>
      <el-descriptions-item label="Read Time">
        {{ formatDate(detailData.readTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Create Time">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'

defineOptions({ name: 'SystemNotifyMessageDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as NotifyMessageApi.NotifyMessageVO) // Detailed data

/** Open pop-up window */
const open = async (data: NotifyMessageApi.NotifyMessageVO) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    detailData.value = data
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
