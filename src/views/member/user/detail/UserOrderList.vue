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
      <el-form-item label="Order status" prop="status">
        <el-select v-model="queryParams.status" class="!w-280px" clearable placeholder="whole">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TRADE_ORDER_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Payment method" prop="payChannelCode">
        <el-select
          v-model="queryParams.payChannelCode"
          class="!w-280px"
          clearable
          placeholder="whole"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PAY_CHANNEL_CODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Creation time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-280px"
          end-placeholder="Custom Time"
          start-placeholder="Custom Time"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="Order source" prop="terminal">
        <el-select v-model="queryParams.terminal" class="!w-280px" clearable placeholder="whole">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TERMINAL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Order type" prop="type">
        <el-select v-model="queryParams.type" class="!w-280px" clearable placeholder="whole">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TRADE_ORDER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Delivery method" prop="deliveryType">
        <el-select v-model="queryParams.deliveryType" class="!w-280px" clearable placeholder="whole">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TRADE_DELIVERY_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="queryParams.deliveryType === DeliveryTypeEnum.EXPRESS.type"
        label="Courier Services Company"
        prop="logisticsId"
      >
        <el-select v-model="queryParams.logisticsId" class="!w-280px" clearable placeholder="whole">
          <el-option
            v-for="item in deliveryExpressList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="queryParams.deliveryType === DeliveryTypeEnum.PICK_UP.type"
        label="Self pickup store"
        prop="pickUpStoreId"
      >
        <el-select
          v-model="queryParams.pickUpStoreId"
          class="!w-280px"
          clearable
          multiple
          placeholder="whole"
        >
          <el-option
            v-for="item in pickUpStoreList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="queryParams.deliveryType === DeliveryTypeEnum.PICK_UP.type"
        label="Verification code"
        prop="pickUpVerifyCode"
      >
        <el-input
          v-model="queryParams.pickUpVerifyCode"
          class="!w-280px"
          clearable
          placeholder="Please enter the self pickup verification code"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Aggregate search">
        <el-input
          v-show="true"
          v-model="queryParams[queryType.queryParam]"
          class="!w-280px"
          clearable
          placeholder="Please enter"
        >
          <template #prepend>
            <el-select
              v-model="queryType.queryParam"
              class="!w-110px"
              clearable
              placeholder="whole"
              @change="inputChangeSelect"
            >
              <el-option
                v-for="dict in dynamicSearchList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          search
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          Reset
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <!-- add to row-key="id" Resolve column data table#header The problem of data not refreshing  -->
    <el-table v-loading="loading" :data="list" row-key="id">
      <OrderTableColumn :list="list" :pick-up-store-list="pickUpStoreList">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row.id)">
            <Icon icon="ep:notification" />
            details
          </el-button>
        </template>
      </OrderTableColumn>
    </el-table>
    <!-- paging -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>
<script lang="ts" setup>
import * as OrderApi from '@/api/mall/trade/order/index'
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import * as PickUpStoreApi from '@/api/mall/trade/delivery/pickUpStore'
import * as DeliveryExpressApi from '@/api/mall/trade/delivery/express'
import { FormInstance } from 'element-plus'
import { OrderTableColumn } from '@/views/mall/trade/order/components'
import { DeliveryTypeEnum } from '@/utils/constants'

const { push } = useRouter() // Route jump

const { userId } = defineProps<{
  userId: number
}>()

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const pickUpStoreList = ref<PickUpStoreApi.DeliveryPickUpStoreVO[]>([]) // Simplified list of self pickup stores
const deliveryExpressList = ref<DeliveryExpressApi.DeliveryExpressVO[]>([]) // logistics company
const queryFormRef = ref<FormInstance>() // Search form
// Form Search
const queryParams = ref({
  pageNo: 1, // the number of pages
  pageSize: 10, // Quantity displayed per page
  userId: userId,
  status: undefined, // Order status
  payChannelCode: undefined, // Payment method
  createTime: undefined, // Creation time
  terminal: undefined, // Order source
  type: undefined, // Order type
  deliveryType: undefined, // Delivery method
  logisticsId: undefined, // Courier Services Company
  pickUpStoreId: undefined, // Self pickup store
  pickUpVerifyCode: undefined // Self withdrawal verification code
})
const queryType = reactive({ queryParam: '' }) // Order search type queryParam

// Order aggregation search select Type configuration（Dynamic search）
const dynamicSearchList = ref([
  { value: 'no', label: 'order number' },
  { value: 'userNickname', label: 'User nickname' },
  { value: 'userMobile', label: 'User phone number' }
])
/**
 * Triggered when switching query objects in aggregate search
 * @param val
 */
const inputChangeSelect = (val: string) => {
  dynamicSearchList.value
    .filter((item) => item.value !== val)
    ?.forEach((item1) => {
      // Clear set search for useless attributes
      if (queryParams.value.hasOwnProperty(item1.value)) {
        delete queryParams.value[item1.value]
      }
    })
}

/** Search button operation */
const handleQuery = async () => {
  queryParams.value.pageNo = 1
  await getList()
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.value.userId = userId
  handleQuery()
}
/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderApi.getOrderPage(queryParams.value)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** View order details */
const openDetail = (id: number) => {
  push({ name: 'TradeOrderDetail', params: { id } })
}

/** initialization **/
onMounted(async () => {
  await getList()
  pickUpStoreList.value = await PickUpStoreApi.getSimpleDeliveryPickUpStoreList()
  deliveryExpressList.value = await DeliveryExpressApi.getSimpleDeliveryExpressList()
})
</script>
