<template>
  <Dialog v-model="dialogVisible" title="Transfer Order Details" width="700px">
    <el-descriptions :column="2" label-class-name="desc-label">
      <el-descriptions-item label="Merchant tracking number">
        <el-tag size="small">{{ detailData.merchantTransferId }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Transfer Order Number">
        <el-tag type="warning" size="small" v-if="detailData.no">{{ detailData.no }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Application Number">{{ detailData.appId }}</el-descriptions-item>
      <el-descriptions-item label="Transfer status">
        <dict-tag :type="DICT_TYPE.PAY_TRANSFER_STATUS" :value="detailData.status" size="small" />
      </el-descriptions-item>
      <el-descriptions-item label="Transfer amount">
        <el-tag type="success" size="small">￥{{ (detailData.price / 100.0).toFixed(2) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Transfer time">
        {{ formatDate(detailData.successTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Creation time">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- Dividing line -->
    <el-divider />
    <el-descriptions :column="2" label-class-name="desc-label">
      <el-descriptions-item label="Name of payee">{{ detailData.userName }}</el-descriptions-item>
      <el-descriptions-item label="Alipay login account" v-if="detailData.type === 1">
        {{ detailData.alipayLogonId }}
      </el-descriptions-item>
      <el-descriptions-item label="WeChat openid" v-if="detailData.type === 2">
        {{ detailData.openid }}
      </el-descriptions-item>
      <el-descriptions-item label="Payment channels">
        <dict-tag :type="DICT_TYPE.PAY_CHANNEL_CODE" :value="detailData.channelCode" />
      </el-descriptions-item>
      <el-descriptions-item label="payment IP">{{ detailData.userIp }}</el-descriptions-item>
      <el-descriptions-item label="Channel tracking number">
        <el-tag size="mini" type="success" v-if="detailData.channelTransferNo">
          {{ detailData.channelTransferNo }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="notice URL">{{ detailData.notifyUrl }}</el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <el-descriptions :column="1" label-class-name="desc-label" direction="vertical" border>
      <el-descriptions-item label="Transfer channel notification content">
        <el-text>{{ detailData.channelNotifyData }}</el-text>
      </el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <div style="text-align: right">
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import * as TransferApi from '@/api/pay/transfer'
import { formatDate } from '@/utils/formatTime'
defineOptions({ name: 'PayTransferDetail' })
const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({})
/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    detailData.value = await TransferApi.getTransfer(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>

<style scoped></style>
