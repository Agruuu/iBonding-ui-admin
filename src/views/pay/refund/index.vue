<template>
  <!-- Search Work Bar -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="App ID" prop="appId">
        <el-select
          v-model="queryParams.appId"
          clearable
          placeholder="Please select application information"
          class="!w-240px"
        >
          <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Refund channel" prop="channelCode">
        <el-select
          v-model="queryParams.channelCode"
          placeholder="Please choose a refund channel"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PAY_CHANNEL_CODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Merchant Payment Order Number" prop="merchantOrderId">
        <el-input
          v-model="queryParams.merchantOrderId"
          placeholder="Please enter the merchant payment tracking number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Merchant refund order number" prop="merchantRefundId">
        <el-input
          v-model="queryParams.merchantRefundId"
          placeholder="Please enter the merchant refund order number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Channel payment tracking number" prop="channelOrderNo">
        <el-input
          v-model="queryParams.channelOrderNo"
          placeholder="Please enter the channel payment tracking number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Channel refund order number" prop="channelRefundNo">
        <el-input
          v-model="queryParams.channelRefundNo"
          placeholder="Please enter the channel refund order number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Refund status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select refund status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PAY_REFUND_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Creation time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" class="mr-5px" /> search </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" /> Reset </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
        >
          <Icon icon="ep:download" class="mr-5px" /> export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="number"  align="center" prop="id" />
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="Payment amount" align="center" prop="payPrice" width="100">
        <template #default="scope">
          ￥{{ parseFloat(scope.row.payPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="refund amount " align="center" prop="refundPrice" width="100">
        <template #default="scope">
          ￥{{ parseFloat(scope.row.refundPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="Refund order number" align="left" width="300">
        <template #default="scope">
          <p class="order-font">
            <el-tag size="small">Merchant</el-tag> {{ scope.row.merchantRefundId }}
          </p>
          <p class="order-font">
            <el-tag size="small" type="warning">refund</el-tag> {{ scope.row.no }}
          </p>
          <p class="order-font" v-if="scope.row.channelRefundNo">
            <el-tag size="small" type="success">channel</el-tag> {{ scope.row.channelRefundNo }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Payment order number" align="left" width="300">
        <template #default="scope">
          <p class="order-font">
            <el-tag size="small">Merchant</el-tag> {{ scope.row.merchantOrderId }}
          </p>
          <p class="order-font">
            <el-tag size="small" type="success">channel</el-tag> {{ scope.row.channelOrderNo }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Refund status" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_REFUND_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Refund channels" align="center" width="140">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_CHANNEL_CODE" :value="scope.row.channelCode" />
        </template>
      </el-table-column>
      <el-table-column
        label="Success time"
        align="center"
        prop="successTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Payment application" align="center" prop="successTime" width="100">
        <template #default="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="operation" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openDetail(scope.row.id)"
            v-hasPermi="['pay:order:query']"
          >
            details
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- paging -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- Form pop-up window：preview -->
  <RefundDetail ref="detailRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as RefundApi from '@/api/pay/refund'
import * as AppApi from '@/api/pay/app'
import RefundDetail from './RefundDetail.vue'
import download from '@/utils/download'

defineOptions({ name: 'PayRefund' })

const message = useMessage() // Message pop-up window

const loading = ref(false) // List Mask Layer
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  merchantId: undefined,
  appId: undefined,
  channelCode: undefined,
  merchantOrderId: undefined,
  merchantRefundId: undefined,
  status: undefined,
  payPrice: undefined,
  refundPrice: undefined,
  channelOrderNo: undefined,
  channelRefundNo: undefined,
  createTime: [],
  successTime: []
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // Export waiting
const appList = ref([]) // Collection of payment application lists

/** Search button operation */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await RefundApi.getRefundPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await RefundApi.exportRefund(queryParams)
    download.excel(data, 'Payment Order.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** Preview Details */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** initialization **/
onMounted(async () => {
  await getList()
  appList.value = await AppApi.getAppList()
})
</script>
<style>
.order-font {
  padding: 2px 0;
  font-size: 12px;
}
</style>
