<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="number" prop="id" />
      <el-table-column align="center" label="Wallet number" prop="walletId" />
      <el-table-column align="center" label="Related business title" prop="title" />
      <el-table-column align="center" label="Transaction amount" prop="price">
        <template #default="{ row }"> {{ fenToYuan(row.price) }} element</template>
      </el-table-column>
      <el-table-column align="center" label="Wallet balance" prop="balance">
        <template #default="{ row }"> {{ fenToYuan(row.balance) }} element</template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Trading Time"
        prop="createTime"
        width="180px"
      />
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
import { dateFormatter } from '@/utils/formatTime'
import * as WalletTransactionApi from '@/api/pay/wallet/transaction'
import * as WalletApi from '@/api/pay/wallet/balance'
import { fenToYuan } from '@/utils'

defineOptions({ name: 'WalletTransactionList' })
const props = defineProps({
  walletId: {
    type: Number,
    required: false
  },
  userId: {
    type: Number,
    required: false
  }
})

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  walletId: null
})
const list = ref([]) // List of data
/** Query List */
const getList = async () => {
  loading.value = true
  try {
    if (props.userId) {
      const wallet = await WalletApi.getWallet({ userId: props.userId })
      queryParams.walletId = wallet.id as any
    } else {
      queryParams.walletId = props.walletId as any
    }
    const data = await WalletTransactionApi.getWalletTransactionPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
/** initialization **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped></style>
