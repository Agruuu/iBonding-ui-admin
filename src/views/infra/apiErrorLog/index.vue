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
      <el-form-item label="Exception Time" prop="exceptionTime">
        <el-date-picker
          v-model="queryParams.exceptionTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Process Status" prop="processStatus">
        <el-select
          v-model="queryParams.processStatus"
          placeholder="Please select the process status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_API_ERROR_LOG_PROCESS_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['infra:api-error-log:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Log Number" align="center" prop="id" />
      <el-table-column label="User ID" align="center" prop="userId" />
      <el-table-column label="User Type" align="center" prop="userType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column label="Application Name" align="center" prop="applicationName" width="200" />
      <el-table-column label="Request Method" align="center" prop="requestMethod" width="80" />
      <el-table-column label="Request Url" align="center" prop="requestUrl" width="180" />
      <el-table-column
        label="Exception Time"
        align="center"
        prop="exceptionTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Exception Name" align="center" prop="exceptionName" width="180" />
      <el-table-column label="Process Status" align="center" prop="processStatus">
        <template #default="scope">
          <dict-tag
            :type="DICT_TYPE.INFRA_API_ERROR_LOG_PROCESS_STATUS"
            :value="scope.row.processStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row)"
            v-hasPermi="['infra:api-error-log:query']"
          >
            Detail
          </el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.processStatus === InfraApiErrorLogProcessStatusEnum.INIT"
            @click="handleProcess(scope.row.id, InfraApiErrorLogProcessStatusEnum.DONE)"
            v-hasPermi="['infra:api-error-log:update-status']"
          >
            Processed
          </el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.processStatus === InfraApiErrorLogProcessStatusEnum.INIT"
            @click="handleProcess(scope.row.id, InfraApiErrorLogProcessStatusEnum.IGNORE)"
            v-hasPermi="['infra:api-error-log:update-status']"
          >
            Neglected
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
  <ApiErrorLogDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ApiErrorLogApi from '@/api/infra/apiErrorLog'
import ApiErrorLogDetail from './ApiErrorLogDetail.vue'
import { InfraApiErrorLogProcessStatusEnum } from '@/utils/constants'

defineOptions({ name: 'InfraApiErrorLog' })

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
  processStatus: null,
  exceptionTime: []
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ApiErrorLogApi.getApiErrorLogPage(queryParams)
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
const openDetail = (data: ApiErrorLogApi.ApiErrorLogVO) => {
  detailRef.value.open(data)
}

/** Processed already processed / Operation ignored **/
const handleProcess = async (id: number, processStatus: number) => {
  try {
    // Secondary confirmation of operation
    const type = processStatus === InfraApiErrorLogProcessStatusEnum.DONE ? 'Processed' : 'Neglected'
    await message.confirm('Confirm marked as ' + type + '?')
    // Execute operation
    await ApiErrorLogApi.updateApiErrorLogPage(id, processStatus)
    await message.success(type)
    // Refresh List 
    await getList()
  } catch {}
}

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await ApiErrorLogApi.exportApiErrorLog(queryParams)
    download.excel(data, 'Exception log.xls')
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
