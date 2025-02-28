<template>
  <!-- search -->
  <ContentWrap>
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="Product Name" prop="spuName">
        <el-input
          v-model="queryParams.spuName"
          class="!w-280px"
          clearable
          placeholder="Please enter the product SPU name"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Refund number" prop="no">
        <el-input
          v-model="queryParams.no"
          class="!w-280px"
          clearable
          placeholder="Please enter the refund number"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Order Number" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          class="!w-280px"
          clearable
          placeholder="Please enter the order number"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="After sales status" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-280px"
          clearable
          placeholder="Please select after-sales status"
        >
          <el-option label="whole" value="0" />
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.TRADE_AFTER_SALE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="After sales method" prop="way">
        <el-select
          v-model="queryParams.way"
          class="!w-280px"
          clearable
          placeholder="Please choose the after-sales service method"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.TRADE_AFTER_SALE_WAY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="After sales type" prop="type">
        <el-select
          v-model="queryParams.type"
          class="!w-280px"
          clearable
          placeholder="Please select the after-sales type"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.TRADE_AFTER_SALE_TYPE)"
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

  <ContentWrap>
    <el-tabs v-model="queryParams.status" @tab-click="tabClick">
      <el-tab-pane
        v-for="item in statusTabs"
        :key="item.label"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>
    <!-- list -->
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="Refund number" min-width="200" prop="no" />
      <el-table-column align="center" label="Order Number" min-width="200" prop="orderNo">
        <template #default="{ row }">
          <el-button link type="primary" @click="openOrderDetail(row.orderId)">
            {{ row.orderNo }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Product information" min-width="600" prop="spuName">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.picUrl"
              class="mr-10px h-30px w-30px"
              @click="imagePreview(row.picUrl)"
            />
            <span class="mr-10px">{{ row.spuName }}</span>
            <el-tag v-for="property in row.properties" :key="property.propertyId" class="mr-10px">
              {{ property.propertyName }}: {{ property.valueName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Order amount" min-width="120" prop="refundPrice">
        <template #default="scope">
          <span>{{ fenToYuan(scope.row.refundPrice) }} element</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Application time" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="After sales status" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRADE_AFTER_SALE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="After sales method">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRADE_AFTER_SALE_WAY" :value="scope.row.way" />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="operation" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="openAfterSaleDetail(row.id)">Process refund</el-button>
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
</template>
<script lang="ts" setup>
import * as AfterSaleApi from '@/api/mall/trade/afterSale/index'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { createImageViewer } from '@/components/ImageViewer'
import { TabsPaneContext } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { fenToYuan } from '@/utils'

defineOptions({ name: 'UserAfterSaleList' })

const { push } = useRouter() // Route jump
const props = defineProps<{
  userId: number
}>()
const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref<AfterSaleApi.TradeAfterSaleVO[]>([]) // List of data
const statusTabs = ref([
  {
    label: 'whole',
    value: '0'
  }
])
const queryFormRef = ref() // Search form
// Query parameters
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  no: null,
  status: '0',
  orderNo: null,
  spuName: null,
  createTime: [],
  way: null,
  type: null,
  userId: null
})

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = cloneDeep(queryParams.value)
    // Deal with all states，Not transmitting is everything
    if (data.status === '0') {
      delete data.status
    }
    // Execute query
    if (props.userId) {
      data.userId = props.userId as any
    }
    const res = await AfterSaleApi.getAfterSalePage(data)
    list.value = res.list as AfterSaleApi.TradeAfterSaleVO[]
    total.value = res.total
  } finally {
    loading.value = false
  }
}

/** Search button operation */
const handleQuery = async () => {
  queryParams.value.pageNo = 1
  await getList()
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** tab switch */
const tabClick = async (tab: TabsPaneContext) => {
  queryParams.value.status = tab.paneName as any
  await getList()
}

/** Process refund */
const openAfterSaleDetail = (id: number) => {
  push({ name: 'TradeAfterSaleDetail', params: { id } })
}

/** View order details */
const openOrderDetail = (id: number) => {
  push({ name: 'TradeOrderDetail', params: { id } })
}

/** Product image preview */
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    urlList: [imgUrl]
  })
}

onMounted(async () => {
  await getList()
  // set up statuses filter
  for (const dict of getDictOptions(DICT_TYPE.TRADE_AFTER_SALE_STATUS)) {
    statusTabs.value.push({
      label: dict.label,
      value: dict.value
    })
  }
})
</script>
