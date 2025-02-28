<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="Handler Name" prop="handlerName">
        <el-input
          v-model="queryParams.handlerName"
          placeholder="Please enter the handler name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Start Time" prop="beginTime">
        <el-date-picker
          v-model="queryParams.beginTime"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select the start time"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="End Time" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select the end time"
          clearable
          :default-time="new Date('1 23:59:59')"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Task Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select the task status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_JOB_LOG_STATUS)"
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
          v-hasPermi="['infra:job:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Job ID" align="center" prop="jobId" />
      <el-table-column label="Handler Name" align="center" prop="handlerName" />
      <el-table-column label="Handler Param" align="center" prop="handlerParam" />
      <el-table-column label="Execute Index" align="center" prop="executeIndex" />
      <el-table-column label="Execution Time" align="center" width="170s">
        <template #default="scope">
          <span>{{ formatDate(scope.row.beginTime) + ' ~ ' + formatDate(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Execution Duration" align="center" prop="duration">
        <template #default="scope">
          <span>{{ scope.row.duration + ' Millisecond' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Task Status" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_JOB_LOG_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openDetail(scope.row.id)"
            v-hasPermi="['infra:job:query']"
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

  <!-- Form pop-up window：see -->
  <JobLogDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import JobLogDetail from './JobLogDetail.vue'
import * as JobLogApi from '@/api/infra/jobLog'

defineOptions({ name: 'InfraJobLog' })

const message = useMessage() // Message pop-up window
const { query } = useRoute() // Query parameters

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  jobId: query.id,
  handlerName: undefined,
  beginTime: undefined,
  endTime: undefined,
  status: undefined
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await JobLogApi.getJobLogPage(queryParams)
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

/** View operation */
const detailRef = ref()
const openDetail = (rowId?: number) => {
  detailRef.value.open(rowId)
}

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await JobLogApi.exportJobLog(queryParams)
    download.excel(data, 'Scheduled task execution log.xls')
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
