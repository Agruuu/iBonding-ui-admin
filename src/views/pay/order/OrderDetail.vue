<template>
  <Dialog v-model="dialogVisible" title="Order Details" width="700px">
    <el-descriptions :column="2" label-class-name="desc-label">
      <el-descriptions-item label="Merchant tracking number">
        <el-tag size="small">{{ detailData.merchantOrderId }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Payment Order Number">
        <el-tag type="warning" size="small" v-if="detailData.no">{{ detailData.no }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="App ID">{{ detailData.appId }}</el-descriptions-item>
      <el-descriptions-item label="apply name">{{ detailData.appName }}</el-descriptions-item>
      <el-descriptions-item label="Payment status">
        <dict-tag :type="DICT_TYPE.PAY_ORDER_STATUS" :value="detailData.status" size="small" />
      </el-descriptions-item>
      <el-descriptions-item label="Payment amount">
        <el-tag type="success" size="small">￥{{ (detailData.price / 100.0).toFixed(2) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Service Charge">
        <el-tag type="warning" size="small">
          ￥{{ (detailData.channelFeePrice / 100.0).toFixed(2) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Handling fee ratio">
        {{ (detailData.channelFeeRate / 100.0).toFixed(2) }}%
      </el-descriptions-item>
      <el-descriptions-item label="Payment Time">
        {{ formatDate(detailData.successTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Expiration time">
        {{ formatDate(detailData.expireTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Creation time">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Update time">
        {{ formatDate(detailData.updateTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- Dividing line -->
    <el-divider />
    <el-descriptions :column="2" label-class-name="desc-label">
      <el-descriptions-item label="Product Title">{{ detailData.subject }}</el-descriptions-item>
      <el-descriptions-item label="Product Description">{{ detailData.body }}</el-descriptions-item>
      <el-descriptions-item label="Payment channels">
        <dict-tag :type="DICT_TYPE.PAY_CHANNEL_CODE" :value="detailData.channelCode" />
      </el-descriptions-item>
      <el-descriptions-item label="payment IP">{{ detailData.userIp }}</el-descriptions-item>
      <el-descriptions-item label="Channel tracking number">
        <el-tag size="mini" type="success" v-if="detailData.channelOrderNo">
          {{ detailData.channelOrderNo }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Channel users">{{ detailData.channelUserId }}</el-descriptions-item>
      <el-descriptions-item label="refund amount ">
        <el-tag size="mini" type="danger">
          ￥{{ (detailData.refundPrice / 100.0).toFixed(2) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="notice URL">{{ detailData.notifyUrl }}</el-descriptions-item>
    </el-descriptions>
    <!-- Dividing line -->
    <el-divider />
    <el-descriptions :column="1" label-class-name="desc-label" direction="vertical" border>
      <el-descriptions-item label="Asynchronous callback content of payment channel">
        <el-text style="white-space: pre-wrap; word-break: break-word">
          {{ detailData.extension.channelNotifyData }}
        </el-text>
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import * as OrderApi from '@/api/pay/order'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'PayOrderDetail' })

const dialogVisible = ref(false) // Is the pop-up displayed
const detailLoading = ref(false) // Form loading in progress
const detailData = ref({
  extension: {}
})

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  // Set data
  detailLoading.value = true
  try {
    detailData.value = await OrderApi.getOrderDetail(id)
    if (!detailData.value.extension) {
      detailData.value.extension = {}
    }
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
<style>
.tag-purple {
  color: #722ed1;
  background: #f9f0ff;
  border-color: #d3adf7;
}

.tag-pink {
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}
</style>
