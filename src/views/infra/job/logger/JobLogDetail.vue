<template>
  <Dialog v-model="dialogVisible" title="Task Detail" width="700px">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID" min-width="60">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="Job ID">
        {{ detailData.jobId }}
      </el-descriptions-item>
      <el-descriptions-item label="Handler Name">
        {{ detailData.handlerName }}
      </el-descriptions-item>
      <el-descriptions-item label="Handler Param">
        {{ detailData.handlerParam }}
      </el-descriptions-item>
      <el-descriptions-item label="Execute Index">
        {{ detailData.executeIndex }}
      </el-descriptions-item>
      <el-descriptions-item label="Execution Time">
        {{ formatDate(detailData.beginTime) + ' ~ ' + formatDate(detailData.endTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Execution Duration">
        {{ detailData.duration + ' Millisecond' }}
      </el-descriptions-item>
      <el-descriptions-item label="Task Status">
        <dict-tag :type="DICT_TYPE.INFRA_JOB_LOG_STATUS" :value="detailData.status" />
      </el-descriptions-item>
      <el-descriptions-item label="Execution Result">
        {{ detailData.result }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as JobLogApi from '@/api/infra/jobLog'

defineOptions({ name: 'JobLogDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as JobLogApi.JobLogVO) // Detailed data

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // see，Set data
  if (id) {
    detailLoading.value = true
    try {
      detailData.value = await JobLogApi.getJobLog(id)
    } finally {
      detailLoading.value = false
    }
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
