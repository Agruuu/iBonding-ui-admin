<template>
  <!-- Payment Information -->
  <el-card v-loading="loading">
    <el-descriptions title="Payment Information" :column="3" border>
      <el-descriptions-item label="Payment Order ID">{{ payOrder.id }}</el-descriptions-item>
      <el-descriptions-item label="Product Title">{{ payOrder.subject }}</el-descriptions-item>
      <el-descriptions-item label="Product Content">{{ payOrder.body }}</el-descriptions-item>
      <el-descriptions-item label="Payment Amount">
        ￥{{ (payOrder.price / 100.0).toFixed(2) }}
      </el-descriptions-item>
      <el-descriptions-item label="Create Time">
        {{ formatDate(payOrder.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="Expire Time">
        {{ formatDate(payOrder.expireTime) }}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>

  <!-- Payment selection box -->
  <el-card style="margin-top: 10px" v-loading="submitLoading" element-loading-text="Submitting payment...">
    <!-- Alipay -->
    <el-descriptions title="Select Alipay to Pay" />
    <div class="pay-channel-container">
      <div
        class="box"
        v-for="channel in channelsAlipay"
        :key="channel.code"
        @click="submit(channel.code)"
      >
        <img :src="channel.icon" />
        <div class="title">{{ channel.name }}</div>
      </div>
    </div>
    <!-- WeChat Pay -->
    <el-descriptions title="Choose WeChat Pay" style="margin-top: 20px" />
    <div class="pay-channel-container">
      <div
        class="box"
        v-for="channel in channelsWechat"
        :key="channel.code"
        @click="submit(channel.code)"
      >
        <img :src="channel.icon" />
        <div class="title">{{ channel.name }}</div>
      </div>
    </div>
    <!-- Other payments -->
    <el-descriptions title="Choose Another Payment Option" style="margin-top: 20px" />
    <div class="pay-channel-container">
      <div
        class="box"
        v-for="channel in channelsMock"
        :key="channel.code"
        @click="submit(channel.code)"
      >
        <img :src="channel.icon" />
        <div class="title">{{ channel.name }}</div>
      </div>
    </div>
  </el-card>

  <!-- Display format：QR code URL -->
  <Dialog
    :title="qrCode.title"
    v-model="qrCode.visible"
    width="350px"
    append-to-body
    :close-on-press-escape="false"
  >
    <Qrcode :text="qrCode.url" :width="310" />
  </Dialog>

  <!-- Display format：BarCode bar code -->
  <Dialog
    :title="barCode.title"
    v-model="barCode.visible"
    width="500px"
    append-to-body
    :close-on-press-escape="false"
  >
    <el-form ref="form" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="Barcode" prop="name">
            <el-input v-model="barCode.value" placeholder="Please enter the barcode" required />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="text-align: right">
            or use
            <el-link
              type="danger"
              target="_blank"
              href="https://baike.baidu.com/item/Barcode Pay /10711903"
            >
              (Barcode scanner gun/Scan code box)
            </el-link>
            Scan the code
          </div>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        @click="submit0(barCode.channelCode)"
        :disabled="barCode.value.length === 0"
      >
        Confirm Payment
      </el-button>
      <el-button @click="barCode.visible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { Qrcode } from '@/components/Qrcode'
import * as PayOrderApi from '@/api/pay/order'
import { PayChannelEnum, PayDisplayModeEnum, PayOrderStatusEnum } from '@/utils/constants'
import { formatDate } from '@/utils/formatTime'
import { useTagsViewStore } from '@/store/modules/tagsView'

// Import icon
import svg_alipay_pc from '@/assets/svgs/pay/icon/alipay_pc.svg'
import svg_alipay_wap from '@/assets/svgs/pay/icon/alipay_wap.svg'
import svg_alipay_app from '@/assets/svgs/pay/icon/alipay_app.svg'
import svg_alipay_qr from '@/assets/svgs/pay/icon/alipay_qr.svg'
import svg_alipay_bar from '@/assets/svgs/pay/icon/alipay_bar.svg'
import svg_wx_pub from '@/assets/svgs/pay/icon/wx_pub.svg'
import svg_wx_lite from '@/assets/svgs/pay/icon/wx_lite.svg'
import svg_wx_app from '@/assets/svgs/pay/icon/wx_app.svg'
import svg_wx_native from '@/assets/svgs/pay/icon/wx_native.svg'
import svg_wx_bar from '@/assets/svgs/pay/icon/wx_bar.svg'
import svg_mock from '@/assets/svgs/pay/icon/mock.svg'

defineOptions({ name: 'PayCashier' })

const message = useMessage() // Message pop-up window
const route = useRoute() // route
const { push, currentRoute } = useRouter() // route
const { delView } = useTagsViewStore() // View operation

const id = ref(undefined) // Payment Order Number
const returnUrl = ref<string | undefined>(undefined) // The callback address after payment has been completed
const loading = ref(false) // Payment Information loading
const payOrder = ref({}) // Payment Information
const channelsAlipay = [
  {
    name: 'Alipay PC Website Payment',
    icon: svg_alipay_pc,
    code: 'alipay_pc'
  },
  {
    name: 'Alipay Wap Website Payment',
    icon: svg_alipay_wap,
    code: 'alipay_wap'
  },
  {
    name: 'Alipay App Website Payment',
    icon: svg_alipay_app,
    code: 'alipay_app'
  },
  {
    name: 'Alipay Code Scanning Payment',
    icon: svg_alipay_qr,
    code: 'alipay_qr'
  },
  {
    name: 'Alipay Barcode Payment',
    icon: svg_alipay_bar,
    code: 'alipay_bar'
  }
]
const channelsWechat = [
  {
    name: 'WeChat MP Payment',
    icon: svg_wx_pub,
    code: 'wx_pub'
  },
  {
    name: 'WeChat Mini Program Payment',
    icon: svg_wx_lite,
    code: 'wx_lite'
  },
  {
    name: 'WeChat App Payment',
    icon: svg_wx_app,
    code: 'wx_app'
  },
  {
    name: 'WeChat QR code payment',
    icon: svg_wx_native,
    code: 'wx_native'
  },
  {
    name: 'WeChat Barcode Payment',
    icon: svg_wx_bar,
    code: 'wx_bar'
  }
]
const channelsMock = [
  {
    name: 'Simulated Payment',
    icon: svg_mock,
    code: 'mock'
  }
]

const submitLoading = ref(false) // Submit payment loading
const interval = ref<any>(undefined) // Scheduled tasks，Polling whether payment has been completed
const qrCode = ref({
  // Display format：QR code
  url: '',
  title: '',
  visible: false
})
const barCode = ref({
  // Display format：barcode
  channelCode: '',
  value: '',
  title: '',
  visible: false
})

/** Obtain payment information */
const getDetail = async () => {
  // 1.1 Order number not transmitted
  if (!id.value) {
    message.error('Payment order number not transmitted，Unable to view corresponding payment information')
    goReturnUrl('cancel')
    return
  }
  const data = await PayOrderApi.getOrder(id.value, true)
  payOrder.value = data
  // 1.2 Unable to retrieve payment information
  if (!data) {
    message.error('The payment order does not exist，Please check!')
    goReturnUrl('cancel')
    return
  }
  // 1.3 If paid、Or it has been closed，Then jump directly
  if (data.status === PayOrderStatusEnum.SUCCESS.status) {
    message.success('Payment successful')
    goReturnUrl('success')
    return
  } else if (data.status === PayOrderStatusEnum.CLOSED.status) {
    message.error('Unable to pay，reason：Order has been closed')
    goReturnUrl('close')
    return
  }
}

/** Submit payment */
const submit = (channelCode) => {
  // Barcode payment，Special handling is required
  if (channelCode === PayChannelEnum.ALIPAY_BAR.code) {
    barCode.value = {
      channelCode: channelCode,
      value: '',
      title: '“Alipay”Barcode Pay ',
      visible: true
    }
    return
  }
  if (channelCode === PayChannelEnum.WX_BAR.code) {
    barCode.value = {
      channelCode: channelCode,
      value: '',
      title: '“WeChat”Barcode Pay ',
      visible: true
    }
    return
  }

  // WeChat official account、Mini program payment，Cannot be in PC On the webpage
  if (channelCode === PayChannelEnum.WX_PUB.code) {
    message.error('WeChat official account payment：I wont support it PC website')
    return
  }
  if (channelCode === PayChannelEnum.WX_LITE.code) {
    message.error('WeChat Mini Program：I wont support it PC website')
    return
  }

  // Default submission processing
  submit0(channelCode)
}

const submit0 = async (channelCode) => {
  submitLoading.value = true
  try {
    const formData = {
      id: id.value,
      channelCode: channelCode,
      returnUrl: location.href, // After successful payment，Payment channel redirects back to the current page；From the current page again，Jump back {@link returnUrl} Corresponding address
      ...buildSubmitParam(channelCode)
    }
    const data = await PayOrderApi.submitOrder(formData)
    // Directly return the paid situation，For example, scan code payment
    if (data.status === PayOrderStatusEnum.SUCCESS.status) {
      clearQueryInterval()
      message.success('Payment successful!')
      goReturnUrl('success')
      return
    }

    // Display the corresponding interface
    if (data.displayMode === PayDisplayModeEnum.URL.mode) {
      displayUrl(channelCode, data)
    } else if (data.displayMode === PayDisplayModeEnum.QR_CODE.mode) {
      displayQrCode(channelCode, data)
    } else if (data.displayMode === PayDisplayModeEnum.APP.mode) {
      displayApp(channelCode)
    }

    // Open polling task
    createQueryInterval()
  } finally {
    submitLoading.value = false
  }
}

/** Build additional parameters for submitting payments */
const buildSubmitParam = (channelCode) => {
  // ① Alipay BarCode when making payment，Need to transmit authCode barcode
  if (channelCode === PayChannelEnum.ALIPAY_BAR.code) {
    return {
      channelExtras: {
        auth_code: barCode.value.value
      }
    }
  }
  // ② WeChat BarCode when making payment，Need to transmit authCode bar code
  if (channelCode === PayChannelEnum.WX_BAR.code) {
    return {
      channelExtras: {
        authCode: barCode.value.value
      }
    }
  }
  return {}
}

/** After submitting payment，URL Presentation format */
const displayUrl = (_channelCode, data) => {
  location.href = data.displayContent
  submitLoading.value = false
}

/** After submitting payment（Scan code payment） */
const displayQrCode = (channelCode, data) => {
  let title = 'Please use a mobile browser“scan”'
  if (channelCode === PayChannelEnum.ALIPAY_WAP.code) {
    // in consideration of WAP test，So guide mobile browsers to do it
  } else if (channelCode.indexOf('alipay_') === 0) {
    title = 'Please use Alipay“scan”Scan code payment'
  } else if (channelCode.indexOf('wx_') === 0) {
    title = 'Please use WeChat“scan”Scan code payment'
  }
  qrCode.value = {
    title: title,
    url: data.displayContent,
    visible: true
  }
  submitLoading.value = false
}

/** After submitting payment（App） */
const displayApp = (channelCode) => {
  if (channelCode === PayChannelEnum.ALIPAY_APP.code) {
    message.error('Alipay App Payment：Unable to make payment on the webpage！')
  }
  if (channelCode === PayChannelEnum.WX_APP.code) {
    message.error('WeChat App Payment：Unable to make payment on the webpage！')
  }
  submitLoading.value = false
}

/** Polling query task */
const createQueryInterval = () => {
  if (interval.value) {
    return
  }
  interval.value = setInterval(async () => {
    const data = await PayOrderApi.getOrder(id.value)
    // Paid already
    if (data.status === PayOrderStatusEnum.SUCCESS.status) {
      clearQueryInterval()
      message.success('Payment successful!')
      goReturnUrl('success')
    }
    // Cancelled
    if (data.status === PayOrderStatusEnum.CLOSED.status) {
      clearQueryInterval()
      message.error('Payment has been closed!')
      goReturnUrl('close')
    }
  }, 1000 * 2)
}

/** Clear query task */
const clearQueryInterval = () => {
  // Clear various pop ups
  qrCode.value = {
    title: '',
    url: '',
    visible: false
  }
  // Clear Task
  clearInterval(interval.value)
  interval.value = undefined
}

/**
 * Returning to Business URL
 *
 * @param payResult Payment results
 *                  ① success：Payment successful
 *                  ② cancel：Cancel payment
 *                  ③ close：Payment has been closed
 */
const goReturnUrl = (payResult) => {
  // Cleaning task
  clearQueryInterval()

  // Without configuration，Can only be closed
  if (!returnUrl.value) {
    delView(unref(currentRoute))
    return
  }

  const url =
    returnUrl.value.indexOf('?') >= 0
      ? returnUrl.value + '&payResult=' + payResult
      : returnUrl.value + '?payResult=' + payResult
  // If there is configuration，start with http ，Then the browser jumps to
  if (returnUrl.value.indexOf('http') === 0) {
    location.href = url
  } else {
    delView(unref(currentRoute))
    push({
      path: url
    })
  }
}

/** initialization */
onMounted(() => {
  id.value = route.query.id
  if (route.query.returnUrl) {
    returnUrl.value = decodeURIComponent(route.query.returnUrl)
  }
  getDetail()
})
</script>

<style lang="scss" scoped>
.pay-channel-container {
  display: flex;
  margin-top: -10px;

  .box {
    width: 160px;
    padding-top: 10px;
    padding-bottom: 5px;
    margin-right: 10px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #e6ebf5;

    img {
      width: 40px;
      height: 40px;
    }

    .title {
      padding-top: 5px;
    }
  }
}
</style>
