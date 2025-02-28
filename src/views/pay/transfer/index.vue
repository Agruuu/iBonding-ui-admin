<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="Transfer Order Number" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="Please enter the transfer order number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Transfer channel" prop="channelCode">
        <el-select
          v-model="queryParams.channelCode"
          placeholder="Please choose a payment channel"
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
      <el-form-item label="Merchant tracking number" prop="merchantTransferId">
        <el-input
          v-model="queryParams.merchantTransferId"
          placeholder="Please enter the merchant tracking number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="type" prop="type">
        <el-select v-model="queryParams.type" placeholder="Please select type" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PAY_TRANSFER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Transfer status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select the transfer status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PAY_TRANSFER_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Name of payee" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="Please enter the name of the payee"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Channel tracking number" prop="channelTransferNo">
        <el-input
          v-model="queryParams.channelTransferNo"
          placeholder="Channel tracking number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="number" align="center" prop="id" />
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="Application Number" align="center" prop="appId" />
      <el-table-column label="type" align="center" prop="type" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_TRANSFER_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="Transfer amount" align="center" prop="price">
        <template #default="scope">
          <span>￥{{ (scope.row.price / 100.0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Transfer status" align="center" prop="status" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_TRANSFER_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="order number" align="left" width="300">
        <template #default="scope">
          <p class="transfer-font">
            <el-tag size="small"> Merchant</el-tag>
            {{ scope.row.merchantTransferId }}
          </p>
          <p class="transfer-font" v-if="scope.row.no">
            <el-tag size="small" type="warning">transfer accounts</el-tag>
            {{ scope.row.no }}
          </p>
          <p class="transfer-font" v-if="scope.row.channelTransferNo">
            <el-tag size="small" type="success">channel</el-tag>
            {{ scope.row.channelTransferNo }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Name of payee" align="center" prop="userName" width="120" />
      <el-table-column label="Collection account" align="left" width="200">
        <template #default="scope">
          <p class="transfer-font" v-if="scope.row.alipayLogonId">
            <el-tag size="small">Alipay login number</el-tag>
            {{ scope.row.alipayLogonId }}
          </p>
          <p class="transfer-font" v-if="scope.row.openid">
            <el-tag size="small">WeChat openId</el-tag>
            {{ scope.row.openid }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Transfer Title" align="center" prop="subject" width="120" />
      <el-table-column label="Transfer channel" align="center" prop="channelCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_CHANNEL_CODE" :value="scope.row.channelCode" />
        </template>
      </el-table-column>
      <el-table-column
        label="Time of successful transfer"
        align="center"
        prop="successTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="operation" align="center" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openDetail(scope.row.id)"> details </el-button>
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
    <TransferDetail ref="detailRef" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as TransferApi from '@/api/pay/transfer'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import TransferDetail from './TransferDetail.vue'
defineOptions({ name: 'PayTransfer' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: null,
  appId: null,
  channelId: null,
  channelCode: null,
  merchantTransferId: null,
  type: null,
  status: null,
  successTime: [],
  price: null,
  subject: null,
  userName: null,
  alipayLogonId: null,
  openid: null,
  createTime: []
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await TransferApi.getTransferPage(queryParams)
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

/** add to/Modify operation */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
.transfer-font {
  padding: 2px 0;
  font-size: 12px;
}
</style>
