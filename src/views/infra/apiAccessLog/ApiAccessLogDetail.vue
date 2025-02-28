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
      <el-descriptions-item label="User Information">
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
      <el-descriptions-item label="Request Result">
        {{ detailData.responseBody }}
      </el-descriptions-item>
      <el-descriptions-item label="Request Time">
        {{ formatDate(detailData.beginTime) }} ~ {{ formatDate(detailData.endTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Request Time Consumption">{{ detailData.duration }} ms</el-descriptions-item>
      <el-descriptions-item label="Operation Result">
        <div v-if="detailData.resultCode === 0">normal</div>
        <div v-else-if="detailData.resultCode > 0">
          fail | {{ detailData.resultCode }} | {{ detailData.resultMsg }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="Operation Module">
        {{ detailData.operateModule }}
      </el-descriptions-item>
      <el-descriptions-item label="Operation Name">
        {{ detailData.operateName }}
      </el-descriptions-item>
      <el-descriptions-item label="Operation Type">
        <dict-tag :type="DICT_TYPE.INFRA_OPERATE_TYPE" :value="detailData.operateType" />
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>

<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as ApiAccessLog from '@/api/infra/apiAccessLog'

defineOptions({ name: 'ApiAccessLogDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as ApiAccessLog.ApiAccessLogVO) // Detailed data

/** Open pop-up window */
const open = async (data: ApiAccessLog.ApiAccessLogVO) => {
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
