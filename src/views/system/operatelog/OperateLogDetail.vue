<template>
  <Dialog v-model="dialogVisible" :max-height="500" :scroll="true" title="Details" width="800">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID" min-width="120">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="Link Tracking" v-if="detailData.traceId">
        {{ detailData.traceId }}
      </el-descriptions-item>
      <el-descriptions-item label="Operator ID">
        {{ detailData.userId }}
      </el-descriptions-item>
      <el-descriptions-item label="Operator Name">
        {{ detailData.userName }}
      </el-descriptions-item>
      <el-descriptions-item label="Operator IP">
        {{ detailData.userIp }}
      </el-descriptions-item>
      <el-descriptions-item label="Operator UA">
        {{ detailData.userAgent }}
      </el-descriptions-item>
      <el-descriptions-item label="Operation Module">
        {{ detailData.type }}
      </el-descriptions-item>
      <el-descriptions-item label="Operation Name">
        {{ detailData.subType }}
      </el-descriptions-item>
      <el-descriptions-item label="Operation Content">
        {{ detailData.action }}
      </el-descriptions-item>
      <el-descriptions-item v-if="detailData.extra" label="Operational Extra">
        {{ detailData.extra }}
      </el-descriptions-item>
      <el-descriptions-item label="Request URL">
        {{ detailData.requestMethod }} {{ detailData.requestUrl }}
      </el-descriptions-item>
      <el-descriptions-item label="Operation Time">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Business Number">
        {{ detailData.bizId }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import * as OperateLogApi from '@/api/system/operatelog'

defineOptions({ name: 'SystemOperateLogDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as OperateLogApi.OperateLogVO) // Detailed data

/** Open pop-up window */
const open = async (data: OperateLogApi.OperateLogVO) => {
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
