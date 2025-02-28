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
          placeholder="Please enter the userId"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="User Type" prop="userType">
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
      <el-form-item label="Application Name" prop="applicationName">
        <el-input
          v-model="queryParams.applicationName"
          placeholder="Please enter the application name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Request Time" prop="beginTime">
        <el-date-picker
          v-model="queryParams.beginTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Execution Duration" prop="duration">
        <el-input
          v-model="queryParams.duration"
          placeholder="Please enter the execution duration"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Result Code" prop="resultCode">
        <el-input
          v-model="queryParams.resultCode"
          placeholder="Please enter the result code"
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
          v-hasPermi="['infra:api-access-log:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Log ID" align="center" prop="id" width="100" fix="right" />
      <el-table-column label="User ID" align="center" prop="userId" />
      <el-table-column label="User Type" align="center" prop="userType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column label="Application Name" align="center" prop="applicationName" width="150" />
      <el-table-column label="Request Method" align="center" prop="requestMethod" width="80" />
      <el-table-column label="Request Url" align="center" prop="requestUrl" width="500" />
      <el-table-column label="Request Time" align="center" prop="beginTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.beginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Execution Duration" align="center" prop="duration" width="180">
        <template #default="scope"> {{ scope.row.duration }} ms </template>
      </el-table-column>
      <el-table-column label="Operation Result" align="center" prop="status">
        <template #default="scope">
          {{ scope.row.resultCode === 0 ? 'Success' : 'Fail(' + scope.row.resultMsg + ')' }}
        </template>
      </el-table-column>
      <el-table-column label="Operation Module" align="center" prop="operateModule" width="180" />
      <el-table-column label="Operation Name" align="center" prop="operateName" width="180" />
      <el-table-column label="Operation Type" align="center" prop="operateType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_OPERATE_TYPE" :value="scope.row.operateType" />
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" fixed="right" width="60">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row)"
            v-hasPermi="['infra:api-access-log:query']"
          >
            Detail
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

  <!-- Form pop-up window：details -->
  <ApiAccessLogDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import * as ApiAccessLogApi from '@/api/infra/apiAccessLog'
import ApiAccessLogDetail from './ApiAccessLogDetail.vue'

defineOptions({ name: 'InfraApiAccessLog' })

const message = useMessage() // Message pop-up window

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: null,
  userType: null,
  applicationName: null,
  requestUrl: null,
  duration: null,
  resultCode: null,
  beginTime: []
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ApiAccessLogApi.getApiAccessLogPage(queryParams)
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
const openDetail = (data: ApiAccessLogApi.ApiAccessLogVO) => {
  detailRef.value.open(data)
}

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await ApiAccessLogApi.exportApiAccessLog(queryParams)
    download.excel(data, 'API Access logs.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
