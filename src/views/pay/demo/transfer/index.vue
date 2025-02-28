<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button type="primary" plain @click="openForm('create')"
          ><Icon icon="ep:plus" />Create a business transfer order
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true">
      <el-table-column label="Order Number" align="center" prop="id" />
      <el-table-column label="Transfer Type" align="center" prop="type" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_TRANSFER_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="Transfer Amount" align="center" prop="price">
        <template #default="scope">
          <span>￥{{ (scope.row.price / 100.0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name of Payee" align="center" prop="userName" width="120" />
      <el-table-column label="Alipay Login Account" align="center" prop="alipayLogonId" width="180" />
      <el-table-column label="WeChat Openid" align="center" prop="openid" width="120" />
      <el-table-column label="Transfer Status" align="center" prop="transferStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_TRANSFER_STATUS" :value="scope.row.transferStatus" />
        </template>
      </el-table-column>
      <el-table-column label="Transfer Order Number" align="center" prop="payTransferId" />
      <el-table-column label="Payment Channel" align="center" prop="payChannelCode" />
      <el-table-column
        label="Transfer Time"
        align="center"
        prop="transferTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="Operation"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleTransfer(scope.row)"
            v-if="scope.row.transferStatus === 0"
            v-hasPermi="['pay:transfer:create']"
          >
            Initiate Transfer
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

  <!-- Form pop-up window：add/modify -->
  <DemoTransferForm ref="demoFormRef" @success="getList" />
  <CreatePayTransfer ref="payTransferRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as DemoTransferApi from '@/api/pay/demo/transfer'
import * as PayTransferApi from '@/api/pay/transfer'
import DemoTransferForm from './DemoTransferForm.vue'
import CreatePayTransfer from '../../transfer/CreatePayTransfer.vue'
import { DICT_TYPE } from '@/utils/dict'
const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref() // Search form

let payTransfer = {
  appId: undefined,
  merchantTransferId: undefined,
  type: undefined,
  price: undefined,
  subject: undefined,
  userName: undefined,
  alipayLogonId: undefined,
  openid: undefined
} as PayTransferApi.TransferVO // Data transmitted to transfer orders

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await DemoTransferApi.getDemoTransferPage(queryParams)
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

/** Create business transfer order operation */
const demoFormRef = ref()
const payTransferRef = ref()
const openForm = (type: string) => {
  demoFormRef.value.open(type)
}

/** Initiate transfer operation */
const handleTransfer = (row: any) => {
  payTransfer = { ...row }
  payTransfer.merchantTransferId = row.id.toString()
  payTransfer.subject = 'Example Transfer'
  payTransferRef.value.showPayTransfer(payTransfer)
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
