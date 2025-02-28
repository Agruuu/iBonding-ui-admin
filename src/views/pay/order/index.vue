<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="App ID" prop="appId">
        <el-select
          clearable
          v-model="queryParams.appId"
          placeholder="Please select application information"
          class="!w-240px"
        >
          <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Channel Code" prop="channelCode">
        <el-select
          v-model="queryParams.channelCode"
          placeholder="Please choose a payment channel code"
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
      <el-form-item label="Merchant Tracking No." prop="merchantOrderId">
        <el-input
          v-model="queryParams.merchantOrderId"
          placeholder="Please enter the merchant tracking number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Payment Order No." prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="Please enter the payment order number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Channel Tracking No." prop="channelOrderNo">
        <el-input
          v-model="queryParams.channelOrderNo"
          placeholder="Please enter the channel tracking number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Payment Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select payment status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PAY_ORDER_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Create Time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['pay:order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column
        label="Create Time"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Payment Amount" align="center" prop="price" width="100">
        <template #default="scope"> ￥{{ parseFloat(scope.row.price / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="Refund Amount " align="center" prop="refundPrice" width="100">
        <template #default="scope">
          ￥{{ parseFloat(scope.row.refundPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="Transaction Amount" align="center" prop="channelFeePrice" width="100">
        <template #default="scope">
          ￥{{ parseFloat(scope.row.channelFeePrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="Order No." align="left" width="300">
        <template #default="scope">
          <p class="order-font">
            <el-tag size="small"> Merchant</el-tag> {{ scope.row.merchantOrderId }}
          </p>
          <p class="order-font" v-if="scope.row.no">
            <el-tag size="small" type="warning">Payment</el-tag> {{ scope.row.no }}
          </p>
          <p class="order-font" v-if="scope.row.channelOrderNo">
            <el-tag size="small" type="success">Channel</el-tag> {{ scope.row.channelOrderNo }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Payment Status" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_ORDER_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Channel Code" align="center" prop="channelCode" width="140">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_CHANNEL_CODE" :value="scope.row.channelCode" />
        </template>
      </el-table-column>
      <el-table-column
        label="Pay Time"
        align="center"
        prop="successTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="App Name" align="center" prop="appName" width="100" />
      <el-table-column label="Product Title" align="center" prop="subject" width="180" />
      <el-table-column label="Operation" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openDetail(scope.row.id)"
            v-hasPermi="['pay:order:query']"
          >
            Details
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
  <OrderDetail ref="detailRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as OrderApi from '@/api/pay/order'
import OrderDetail from './OrderDetail.vue'
import download from '@/utils/download'
import { getAppList } from '@/api/pay/app'

defineOptions({ name: 'PayOrder' })

const message = useMessage() // Message pop-up window

const loading = ref(false) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  appId: null,
  channelCode: null,
  merchantOrderId: null,
  channelOrderNo: null,
  no: null,
  status: null,
  createTime: []
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
    const data = await OrderApi.getOrderPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await OrderApi.exportOrder(queryParams)
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
  appList.value = await getAppList()
})
</script>
<style>
.order-font {
  padding: 2px 0;
  font-size: 12px;
}
</style>
