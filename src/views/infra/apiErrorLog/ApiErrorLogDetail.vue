<template>
  <Dialog v-model="dialogVisible" :max-height="500" :scroll="true" title="Details" width="800">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Log ID" min-width="120">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="Link Tracking">
        {{ detailData.traceId }}
      </el-descriptions-item>
      <el-descriptions-item label="Application Name">
        {{ detailData.applicationName }}
      </el-descriptions-item>
      <el-descriptions-item label="User ID">
        {{ detailData.userId }}
        <dict-tag :type="DICT_TYPE.USER_TYPE" :value="detailData.userType" />
      </el-descriptions-item>
      <el-descriptions-item label="User IP">
        {{ detailData.userIp }}
      </el-descriptions-item>
      <el-descriptions-item label="User UA">
        {{ detailData.userAgent }}
      </el-descriptions-item>
      <el-descriptions-item label="Request Information">
        {{ detailData.requestMethod }} {{ detailData.requestUrl }}
      </el-descriptions-item>
      <el-descriptions-item label="Request Parameters">
        {{ detailData.requestParams }}
      </el-descriptions-item>
      <el-descriptions-item label="Exception Time">
        {{ formatDate(detailData.exceptionTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Exception Name">
        {{ detailData.exceptionName }}
      </el-descriptions-item>
      <el-descriptions-item v-if="detailData.exceptionStackTrace" label="Exception Stack">
        <el-input
          v-model="detailData.exceptionStackTrace"
          :autosize="{ maxRows: 20 }"
          :readonly="true"
          type="textarea"
        />
      </el-descriptions-item>
      <el-descriptions-item label="Process Status">
        <dict-tag
          :type="DICT_TYPE.INFRA_API_ERROR_LOG_PROCESS_STATUS"
          :value="detailData.processStatus"
        />
      </el-descriptions-item>
      <el-descriptions-item v-if="detailData.processUserId" label="Processing User">
        {{ detailData.processUserId }}
      </el-descriptions-item>
      <el-descriptions-item v-if="detailData.processTime" label="Process Time">
        {{ formatDate(detailData.processTime) }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as ApiErrorLog from '@/api/infra/apiErrorLog'

defineOptions({ name: 'ApiErrorLogDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as ApiErrorLog.ApiErrorLogVO) // Detailed data

/** Open pop-up window */
const open = async (data: ApiErrorLog.ApiErrorLogVO) => {
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
