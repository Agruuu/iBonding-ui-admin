<template>
  <!-- search -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="App Name" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="Please enter the application name"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="Please select the enabled status"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Create Time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="End Date"
          start-placeholder="Start Date"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          Search
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          Reset
        </el-button>
        <el-button v-hasPermi="['pay:app:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          Add
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="App Key" prop="appKey" />
      <el-table-column align="center" label="App Name" min-width="90" prop="name" />
      <el-table-column align="center" label="Status" prop="status">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Alipay Config">
        <el-table-column
          v-for="channel in alipayChannels"
          :key="channel.code"
          :label="channel.name.replace('Alipay', '')"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, channel.code)"
              circle
              size="small"
              type="success"
              @click="openChannelForm(scope.row, channel.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button
              v-else
              circle
              size="small"
              type="danger"
              @click="openChannelForm(scope.row, channel.code)"
            >
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="WeChat Config">
        <el-table-column
          v-for="channel in wxChannels"
          :key="channel.code"
          :label="channel.name.replace('WeChat', '')"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, channel.code)"
              circle
              size="small"
              type="success"
              @click="openChannelForm(scope.row, channel.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button
              v-else
              circle
              size="small"
              type="danger"
              @click="openChannelForm(scope.row, channel.code)"
            >
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="Wallet Payment Config">
        <el-table-column :label="PayChannelEnum.WALLET.name" align="center">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.WALLET.code)"
              circle
              size="small"
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.WALLET.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button
              v-else
              circle
              size="small"
              type="danger"
              @click="openChannelForm(scope.row, PayChannelEnum.WALLET.code)"
            >
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="Simulate Payment config">
        <el-table-column :label="PayChannelEnum.MOCK.name" align="center">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.MOCK.code)"
              circle
              size="small"
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.MOCK.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button
              v-else
              circle
              size="small"
              type="danger"
              @click="openChannelForm(scope.row, PayChannelEnum.MOCK.code)"
            >
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Operation" min-width="110">
        <template #default="scope">
          <el-button
            v-hasPermi="['pay:app:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            Edit
          </el-button>
          <el-button
            v-hasPermi="['pay:app:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- paging -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <AppForm ref="formRef" @success="getList" />
  <AlipayChannelForm ref="alipayFormRef" @success="getList" />
  <WeixinChannelForm ref="weixinFormRef" @success="getList" />
  <MockChannelForm ref="mockFormRef" @success="getList" />
  <WalletChannelForm ref="walletFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as AppApi from '@/api/pay/app'
import AppForm from './components/AppForm.vue'
import { CommonStatusEnum, PayChannelEnum } from '@/utils/constants'
import AlipayChannelForm from './components/channel/AlipayChannelForm.vue'
import WeixinChannelForm from './components/channel/WeixinChannelForm.vue'
import MockChannelForm from './components/channel/MockChannelForm.vue'
import WalletChannelForm from './components/channel/WalletChannelForm.vue'

defineOptions({ name: 'PayApp' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  remark: undefined,
  payNotifyUrl: undefined,
  refundNotifyUrl: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form

const alipayChannels = [
  PayChannelEnum.ALIPAY_APP,
  PayChannelEnum.ALIPAY_PC,
  PayChannelEnum.ALIPAY_WAP,
  PayChannelEnum.ALIPAY_QR,
  PayChannelEnum.ALIPAY_BAR
]

const wxChannels = [
  PayChannelEnum.WX_LITE,
  PayChannelEnum.WX_PUB,
  PayChannelEnum.WX_APP,
  PayChannelEnum.WX_NATIVE,
  PayChannelEnum.WX_WAP,
  PayChannelEnum.WX_BAR
]

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await AppApi.getAppPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Search button operation */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** Application status modification */
const handleStatusChange = async (row: any) => {
  let text = row.status === CommonStatusEnum.ENABLE ? 'Enable' : 'Disable'
  try {
    await message.confirm('Confirm to "' + text + ' ""' + row.name + '" application?')
    await AppApi.changeAppStatus({ id: row.id, status: row.status })
    message.success(text + 'success')
  } catch {
    row.status =
      row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await AppApi.deleteApp(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/**
 * Determine whether the channel list exists based on the channel code
 *
 * @param channels Channel List
 * @param channelCode Channel code
 */
const isChannelExists = (channels, channelCode) => {
  if (!channels) {
    return false
  }
  return channels.indexOf(channelCode) !== -1
}

/**
 * Add payment channel information
 */
const alipayFormRef = ref()
const weixinFormRef = ref()
const mockFormRef = ref()
const walletFormRef = ref()
const channelParam = reactive({
  appId: null, // application ID
  payCode: null // Channel code
})
const openChannelForm = async (row, payCode) => {
  channelParam.appId = row.id
  channelParam.payCode = payCode
  if (payCode.indexOf('alipay_') === 0) {
    alipayFormRef.value.open(row.id, payCode)
    return
  }
  if (payCode.indexOf('wx_') === 0) {
    weixinFormRef.value.open(row.id, payCode)
    return
  }
  if (payCode.indexOf('mock') === 0) {
    mockFormRef.value.open(row.id, payCode)
  }
  if (payCode.indexOf('wallet') === 0) {
    mockFormRef.value.open(row.id, payCode)
  }
}

/** initialization **/
onMounted(async () => {
  await getList()
})
</script>
