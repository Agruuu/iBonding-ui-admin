<template>
  <Dialog v-model="dialogVisible" :max-height="500" :scroll="true" title="Details" width="800">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Log ID" min-width="120">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="SMS Channel">
        {{ channelList.find((channel) => channel.id === detailData.channelId)?.signature }}
        <dict-tag :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE" :value="detailData.channelCode" />
      </el-descriptions-item>
      <el-descriptions-item label="SMS Template">
        {{ detailData.templateId }} | {{ detailData.templateCode }}
        <dict-tag :type="DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE" :value="detailData.templateType" />
      </el-descriptions-item>
      <el-descriptions-item label="API Template No.">
        {{ detailData.apiTemplateId }}
      </el-descriptions-item>
      <el-descriptions-item label="User Information">
        {{ detailData.mobile }}
        <span v-if="detailData.userType && detailData.userId">
          <dict-tag :type="DICT_TYPE.USER_TYPE" :value="detailData.userType" />
          ({{ detailData.userId }})
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="SMS Content">
        {{ detailData.templateContent }}
      </el-descriptions-item>
      <el-descriptions-item label="SMS Parameters">
        {{ detailData.templateParams }}
      </el-descriptions-item>
      <el-descriptions-item label="Create Time">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Send Status">
        <dict-tag :type="DICT_TYPE.SYSTEM_SMS_SEND_STATUS" :value="detailData.sendStatus" />
      </el-descriptions-item>
      <el-descriptions-item label="Send Time">
        {{ formatDate(detailData.sendTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="API Send Result">
        {{ detailData.apiSendCode }} | {{ detailData.apiSendMsg }}
      </el-descriptions-item>
      <el-descriptions-item label="API SerialNo">
        {{ detailData.apiSerialNo }}
      </el-descriptions-item>
      <el-descriptions-item label="API RequestNo">
        {{ detailData.apiRequestId }}
      </el-descriptions-item>
      <el-descriptions-item label="API Receive Status">
        <dict-tag :type="DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS" :value="detailData.receiveStatus" />
        {{ formatDate(detailData.receiveTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="API Receive Result">
        {{ detailData.apiReceiveCode }} | {{ detailData.apiReceiveMsg }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as SmsLogApi from '@/api/system/sms/smsLog'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'

defineOptions({ name: 'SystemSmsLogDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref() // Detailed data
const channelList = ref([]) // List of SMS channels

/** Open pop-up window */
const open = async (data: SmsLogApi.SmsLogVO) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    detailData.value = data
  } finally {
    detailLoading.value = false
  }
  // Load channel list
  channelList.value = await SmsChannelApi.getSimpleSmsChannelList()
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
