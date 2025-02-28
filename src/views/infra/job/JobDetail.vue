<template>
  <Dialog v-model="dialogVisible" title="Task Detail" width="700px">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID" min-width="60">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="Name">
        {{ detailData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="Status">
        <dict-tag :type="DICT_TYPE.INFRA_JOB_STATUS" :value="detailData.status" />
      </el-descriptions-item>
      <el-descriptions-item label="Handler Name">
        {{ detailData.handlerName }}
      </el-descriptions-item>
      <el-descriptions-item label="Handler Param">
        {{ detailData.handlerParam }}
      </el-descriptions-item>
      <el-descriptions-item label="Cron Expression">
        {{ detailData.cronExpression }}
      </el-descriptions-item>
      <el-descriptions-item label="Retry Count">
        {{ detailData.retryCount }}
      </el-descriptions-item>
      <el-descriptions-item label="Retry Interval ">
        {{ detailData.retryInterval + ' Millisecond' }}
      </el-descriptions-item>
      <el-descriptions-item label="Monitoring Timeout">
        {{ detailData.monitorTimeout > 0 ? detailData.monitorTimeout + ' Millisecond' : 'Not activated' }}
      </el-descriptions-item>
      <el-descriptions-item label="Subsequent Execution Time">
        <el-timeline>
          <el-timeline-item
            v-for="(nextTime, index) in nextTimes"
            :key="index"
            :timestamp="formatDate(nextTime)"
          >
            The {{ index + 1 }} time
          </el-timeline-item>
        </el-timeline>
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as JobApi from '@/api/infra/job'

defineOptions({ name: 'InfraJobDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as JobApi.JobVO) // Detailed data
const nextTimes = ref([]) // Array of next round execution time

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // see，Set data
  if (id) {
    detailLoading.value = true
    try {
      detailData.value = await JobApi.getJob(id)
      // Get the next execution time
      nextTimes.value = await JobApi.getJobNextTimes(id)
    } finally {
      detailLoading.value = false
    }
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
