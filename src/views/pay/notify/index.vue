<template>
  <!-- Search Work Bar -->
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
          v-model="queryParams.appId"
          placeholder="Please select application information"
          clearable
          filterable
          class="!w-240px"
        >
          <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Notify Type" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="Please select notification type"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PAY_NOTIFY_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Association Number" prop="dataId">
        <el-input
          v-model="queryParams.dataId"
          placeholder="Please enter the associated number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Notify Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select notification status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PAY_NOTIFY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Merchant Order Number" prop="merchantOrderId">
        <el-input
          v-model="queryParams.merchantOrderId"
          placeholder="Please enter the merchant order number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Create Time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          style="width: 240px"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Task Number" align="center" prop="id" />
      <el-table-column label="Application Number" align="center" prop="appName" />
      <el-table-column label="Merchant Order Number" align="center" prop="merchantOrderId" />
      <el-table-column label="Notify Type" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_NOTIFY_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="Association Number" align="center" prop="dataId" />
      <el-table-column label="Notify Status" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_NOTIFY_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="Last Notify Time"
        align="center"
        prop="lastExecuteTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="Next Notify Time"
        align="center"
        prop="nextNotifyTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Notify Times" align="center" prop="notifyTimes">
        <template #default="scope">
          <el-tag size="small" type="success">
            {{ scope.row.notifyTimes }} / {{ scope.row.maxNotifyTimes }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row.id)"
            v-hasPermi="['pay:notify:query']"
          >
            View Details
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Paging component -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- Form pop-up window：preview -->
  <NotifyDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import * as PayNotifyApi from '@/api/pay/notify'
import * as PayAppApi from '@/api/pay/app'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import NotifyDetail from './NotifyDetail.vue'

defineOptions({ name: 'PayNotify' })

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref() // List of data
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  appId: null,
  type: null,
  dataId: null,
  status: null,
  merchantOrderId: null,
  createTime: []
})
const queryFormRef = ref() // Search form
const appList = ref([]) // Collection of payment application lists
// Display pop-up layer or not
const open = ref(false)
// Notification Details
const notifyDetail = ref<any>({
  logs: []
})

/** Search button operation */
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
}

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await PayNotifyApi.getNotifyTaskPage(queryParams.value)
    list.value = data.list
    total.value = data.total
    loading.value = false
  } finally {
    loading.value = false
  }
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** Details button operation */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** initialization **/
onMounted(async () => {
  await getList()
  // Get filtering options
  appList.value = await PayAppApi.getAppList()
})
</script>
