<template>
  <Dialog v-model="dialogVisible" title="Notification Details" width="50%">
    <el-descriptions :column="2">
      <el-descriptions-item label="Merchant Order Number">
        <el-tag>{{ detailData.merchantOrderId }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Notify Status">
        <dict-tag :type="DICT_TYPE.PAY_NOTIFY_STATUS" :value="detailData.status" />
      </el-descriptions-item>

      <el-descriptions-item label="App ID">{{ detailData.appId }}</el-descriptions-item>
      <el-descriptions-item label="App Name">{{ detailData.appName }}</el-descriptions-item>

      <el-descriptions-item label="Association Number">{{ detailData.dataId }}</el-descriptions-item>
      <el-descriptions-item label="Notify type">
        <dict-tag :type="DICT_TYPE.PAY_NOTIFY_TYPE" :value="detailData.type" />
      </el-descriptions-item>

      <el-descriptions-item label="Notify Times">{{ detailData.notifyTimes }}</el-descriptions-item>
      <el-descriptions-item label="Maximum Number of Notifications">
        {{ detailData.maxNotifyTimes }}
      </el-descriptions-item>

      <el-descriptions-item label="Last Notify Time">
        {{ formatDate(detailData.lastExecuteTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Next Notify Time">
        {{ formatDate(detailData.nextNotifyTime) }}
      </el-descriptions-item>

      <el-descriptions-item label="Create Time">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Update Time">
        {{ formatDate(detailData.updateTime) }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- Dividing line -->
    <el-divider />

    <el-descriptions :column="1" direction="vertical" border>
      <el-descriptions-item label="Callback Log">
        <el-table :data="detailData.logs">
          <el-table-column label="Log Number" align="center" prop="id" />
          <el-table-column label="Notify Status" align="center" prop="status">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PAY_NOTIFY_STATUS" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="Notify Times" align="center" prop="notifyTimes" />
          <el-table-column label="Last Execute Time" align="center" prop="lastExecuteTime" width="180">
            <template #default="scope">
              <span>{{ formatDate(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Response Results" align="center" prop="response" />
        </el-table>
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import * as PayNotifyApi from '@/api/pay/notify'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'PayNotifyDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({})

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    detailData.value = await PayNotifyApi.getNotifyTaskDetail(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
