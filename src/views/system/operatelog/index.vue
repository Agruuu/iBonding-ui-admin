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
      <el-form-item label="Operator" prop="userId">
        <el-select
          v-model="queryParams.userId"
          clearable
          filterable
          placeholder="Please enter the operator"
          class="!w-240px"
        >
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickname"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Module" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="Please enter the operation module"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Name" prop="subType">
        <el-input
          v-model="queryParams.subType"
          placeholder="Please enter the operation name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="content" prop="action">
        <el-input
          v-model="queryParams.action"
          placeholder="Please enter the operation name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Operation Time" prop="createTime">
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
      <el-form-item label="Business Number" prop="bizId">
        <el-input
          v-model="queryParams.bizId"
          placeholder="Please enter the business number"
          clearable
          @keyup.enter="handleQuery"
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
          v-hasPermi="['infra:operate-log:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Log ID" align="center" prop="id" width="100" />
      <el-table-column label="Operator" align="center" prop="userName" width="120" />
      <el-table-column label="Module" align="center" prop="type" width="120" />
      <el-table-column label="Name" align="center" prop="subType" width="160" />
      <el-table-column label="Content" align="center" prop="action" />
      <el-table-column
        label="Operation Time"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Business Number" align="center" prop="bizId" width="120" />
      <el-table-column label="Operation IP" align="center" prop="userIp" width="120" />
      <el-table-column label="Operation" align="center" fixed="right" width="60">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row)"
            v-hasPermi="['infra:operate-log:query']"
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

  <!-- Form pop-up window：details -->
  <OperateLogDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as OperateLogApi from '@/api/system/operatelog'
import OperateLogDetail from './OperateLogDetail.vue'
import * as UserApi from '@/api/system/user'
const userList = ref<UserApi.UserVO[]>([]) // User List

defineOptions({ name: 'SystemOperateLog' })

const message = useMessage() // Message pop-up window

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  type: undefined,
  subType: undefined,
  action: undefined,
  createTime: [],
  bizId: undefined
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await OperateLogApi.getOperateLogPage(queryParams)
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

/** Detailed operation */
const detailRef = ref()
const openDetail = (data: OperateLogApi.OperateLogVO) => {
  detailRef.value.open(data)
}

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await OperateLogApi.exportOperateLog(queryParams)
    download.excel(data, 'Operation log.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** initialization **/
onMounted(async () => {
  await getList()
  // Obtain user list
  userList.value = await UserApi.getSimpleUserList()
})
</script>
