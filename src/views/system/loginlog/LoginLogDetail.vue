<template>
  <Dialog v-model="dialogVisible" title="Details" width="800">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="ID" min-width="120">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="Log Type">
        <dict-tag :type="DICT_TYPE.SYSTEM_LOGIN_TYPE" :value="detailData.logType" />
      </el-descriptions-item>
      <el-descriptions-item label="Username">
        {{ detailData.username }}
      </el-descriptions-item>
      <el-descriptions-item label="User IP">
        {{ detailData.userIp }}
      </el-descriptions-item>
      <el-descriptions-item label="Browser">
        {{ detailData.userAgent }}
      </el-descriptions-item>
      <el-descriptions-item label="Login Result">
        <dict-tag :type="DICT_TYPE.SYSTEM_LOGIN_RESULT" :value="detailData.result" />
      </el-descriptions-item>
      <el-descriptions-item label="Login Date">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as LoginLogApi from '@/api/system/loginLog'

defineOptions({ name: 'SystemLoginLogDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({} as LoginLogApi.LoginLogVO) // Detailed data

/** Open pop-up window */
const open = async (data: LoginLogApi.LoginLogVO) => {
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
