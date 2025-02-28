<template>
  <Dialog v-model="dialogVisible" title="details" width="700px">
    <el-descriptions :column="2" label-class-name="desc-label">
      <el-descriptions-item label="Merchant refund order number">
        <el-tag size="small">{{ refundDetail.merchantRefundId }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Channel refund order number">
        <el-tag type="success" size="small" v-if="refundDetail.channelRefundNo">{{
          refundDetail.channelRefundNo
        }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Merchant Payment Order Number">
        <el-tag size="small">{{ refundDetail.merchantOrderId }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Channel payment tracking number">
        <el-tag type="success" size="small">{{ refundDetail.channelOrderNo }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Application Number">{{ refundDetail.appId }}</el-descriptions-item>
      <el-descriptions-item label="apply name">{{ refundDetail.appName }}</el-descriptions-item>
      <el-descriptions-item label="Payment amount">
        <el-tag type="success" size="small">
          ￥{{ (refundDetail.payPrice / 100.0).toFixed(2) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="refund amount ">
        <el-tag size="mini" type="danger">
          ￥{{ (refundDetail.refundPrice / 100.0).toFixed(2) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Refund status">
        <dict-tag :type="DICT_TYPE.PAY_REFUND_STATUS" :value="refundDetail.status" />
      </el-descriptions-item>
      <el-descriptions-item label="Refund time">
        {{ formatDate(refundDetail.successTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Creation time">
        {{ formatDate(refundDetail.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Update time">
        {{ formatDate(refundDetail.updateTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- Dividing line -->
    <el-divider />
    <el-descriptions :column="2" label-class-name="desc-label">
      <el-descriptions-item label="Refund channels">
        <dict-tag :type="DICT_TYPE.PAY_CHANNEL_CODE" :value="refundDetail.channelCode" />
      </el-descriptions-item>
      <el-descriptions-item label="Reason for refund">{{ refundDetail.reason }}</el-descriptions-item>
      <el-descriptions-item label="refund IP">{{ refundDetail.userIp }}</el-descriptions-item>
      <el-descriptions-item label="notice URL">{{ refundDetail.notifyUrl }}</el-descriptions-item>
    </el-descriptions>
    <!-- Dividing line -->
    <el-divider />
    <el-descriptions :column="2" label-class-name="desc-label">
      <el-descriptions-item label="Channel error code">
        {{ refundDetail.channelErrorCode }}
      </el-descriptions-item>
      <el-descriptions-item label="Channel error code description">
        {{ refundDetail.channelErrorMsg }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="1" label-class-name="desc-label" direction="vertical" border>
      <el-descriptions-item label="Asynchronous callback content of payment channel">
        <el-text style="white-space: pre-wrap; word-break: break-word">
          {{ refundDetail.channelNotifyData }}
        </el-text>
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as RefundApi from '@/api/pay/refund'

defineOptions({ name: 'PayRefundDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const refundDetail = ref({})

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    refundDetail.value = await RefundApi.getRefund(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
