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
      <el-form-item label="User ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="Please enter the user ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="customer type" prop="userType">
        <el-select
          v-model="queryParams.userType"
          placeholder="Please select user type"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.USER_TYPE)"
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
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="number" align="center" prop="id" />
      <el-table-column label="User ID" align="center" prop="userId" />
      <el-table-column label="customer type" align="center" prop="userType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column label="balance" align="center" prop="balance">
        <template #default="{ row }"> {{ fenToYuan(row.balance) }} element</template>
      </el-table-column>
      <el-table-column label="Accumulated expenditure" align="center" prop="totalExpense">
        <template #default="{ row }"> {{ fenToYuan(row.totalExpense) }} element</template>
      </el-table-column>
      <el-table-column label="Accumulated recharge" align="center" prop="totalRecharge">
        <template #default="{ row }"> {{ fenToYuan(row.totalRecharge) }} element</template>
      </el-table-column>
      <el-table-column label="Freeze amount" align="center" prop="freezePrice">
        <template #default="{ row }"> {{ fenToYuan(row.freezePrice) }} element</template>
      </el-table-column>
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="operation" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm(scope.row.id)">details</el-button>
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

  <!-- pop-up notification -->
  <WalletForm ref="formRef" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { fenToYuan } from '@/utils'
import * as WalletApi from '@/api/pay/wallet/balance'
import WalletForm from './WalletForm.vue'

defineOptions({ name: 'WalletBalance' })

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: null,
  userType: null,
  createTime: []
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await WalletApi.getWalletPage(queryParams)
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
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id)
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
