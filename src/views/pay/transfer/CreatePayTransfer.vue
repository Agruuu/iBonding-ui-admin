<template>
  <Dialog title="Initiate transfer" v-model="dialogVisible" width="800px">
    <el-card style="margin-top: 10px">
      <el-descriptions title="Transfer information" :column="2" border>
        <el-descriptions-item label="Transfer type">
          {{ typeName }}
        </el-descriptions-item>
        <el-descriptions-item label="Transfer amount(element)">
          ￥{{ (transfer.price / 100.0).toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item label="Name of payee">
          {{ transfer.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="Alipay login account" v-if="transfer.type === 1">
          {{ transfer.alipayLogonId }}
        </el-descriptions-item>
        <el-descriptions-item label="WeChat openid" v-if="transfer.type === 2">
          {{ transfer.openid }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>Select transfer channel</span>
        </div>
      </template>
      <div>
        <el-radio-group v-model="channelCode">
          <el-radio
            value="alipay_pc"
            :disabled="transfer.type === 2 || transfer.type === 3 || transfer.type === 4"
          >
            <img :src="svg_alipay_app" />
          </el-radio>
          <el-radio
            value="wx_app"
            :disabled="transfer.type === 1 || transfer.type === 3 || transfer.type === 4"
          >
            <img :src="svg_wx_app" />
          </el-radio>
        </el-radio-group>
      </div>
    </el-card>
    <el-divider />
    <div style="text-align: right">
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Indeed set</el-button>
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import * as PayTransferApi from '@/api/pay/transfer'
import { computed, PropType } from 'vue'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
// Import icon
import svg_alipay_app from '@/assets/svgs/pay/icon/alipay_app.svg'
import svg_wx_app from '@/assets/svgs/pay/icon/wx_app.svg'
import { yuanToFen } from '@/utils'
const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window
const formLoading = ref(false) // The submit button is disabled
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
defineOptions({ name: 'CreatePayTransfer' })

// Submit data
let submitTransferData: PayTransferApi.TransferVO

const transfer = reactive({
  appId: undefined,
  channelCode: undefined,
  merchantTransferId: undefined,
  type: undefined,
  price: undefined,
  subject: undefined,
  userName: undefined,
  alipayLogonId: undefined,
  openid: undefined
})
const dialogVisible = ref(false)
const typeName = computed(() => {
  return getDictLabel(DICT_TYPE.PAY_TRANSFER_TYPE, transfer.type)
})
const channelCode = computed(() => {
  let channelCode = 'alipay_pc'
  if (transfer.type === 2) {
    channelCode = 'wx_app'
  }
  // TODO Bank cards and wallets Transfer pending implementation
  return channelCode
})

/** Open pop-up window */
const showPayTransfer = async (payTransfer: PayTransferApi.TransferVO) => {
  dialogVisible.value = true
  submitTransferData = payTransfer
  transfer.merchantTransferId = payTransfer.merchantTransferId
  transfer.price = payTransfer.price
  transfer.userName = payTransfer.userName
  transfer.type = payTransfer.type
  transfer.appId = payTransfer.appId
  transfer.subject = payTransfer.subject
  transfer.alipayLogonId = payTransfer.alipayLogonId
  transfer.openid = payTransfer.openid
}
/** Close the pop-up window */
const close = async () => {
  dialogVisible.value = false
}
defineExpose({ showPayTransfer, close }) // provide showPayTransfer， close method，Used to open, Close the pop-up window

const submitForm = async () => {
  // validate form 
  formLoading.value = true
  try {
    submitTransferData.channelCode = channelCode.value
    await PayTransferApi.createTransfer(submitTransferData)
    message.success('Successfully initiated transfer. Is the transfer successful,Based on the status of the transfer order')
    // Event of successful sending operation
    emit('success')
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
