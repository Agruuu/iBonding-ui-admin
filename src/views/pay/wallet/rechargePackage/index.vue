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
      <el-form-item label="Package Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please enter the package name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="state" prop="status">
        <el-select v-model="queryParams.status" placeholder="Please select the status" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['pay:wallet-recharge-package:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> newly added
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="number" align="center" prop="id" />
      <el-table-column label="Package Name" align="center" prop="name" />
      <el-table-column label="Payment amount" align="center" prop="payPrice">
        <template #default="{ row }"> {{ fenToYuan(row.payPrice) }} element</template>
      </el-table-column>
      <el-table-column label="Gift amount" align="center" prop="bonusPrice">
        <template #default="{ row }"> {{ fenToYuan(row.bonusPrice) }} element</template>
      </el-table-column>
      <el-table-column label="state" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
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
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['pay:wallet-recharge-package:update']"
          >
            edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['pay:wallet-recharge-package:delete']"
          >
            delete
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

  <!-- Form pop-up window：add to/modify -->
  <WalletRechargePackageForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as WalletRechargePackageApi from '@/api/pay/wallet/rechargePackage'
import WalletRechargePackageForm from './WalletRechargePackageForm.vue'
import { fenToYuan } from '@/utils'

defineOptions({ name: 'WalletRechargePackage' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null,
  payPrice: null,
  bonusPrice: null,
  status: null,
  createTime: []
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await WalletRechargePackageApi.getWalletRechargePackagePage(queryParams)
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await WalletRechargePackageApi.deleteWalletRechargePackage(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}
/** initialization **/
onMounted(() => {
  getList()
})
</script>
