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
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please enter the task name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select the task status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_JOB_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Handler Name" prop="handlerName">
        <el-input
          v-model="queryParams.handlerName"
          placeholder="Please enter the Handler Name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['infra:job:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> Add
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['infra:job:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
        <el-button type="info" plain @click="handleJobLog()" v-hasPermi="['infra:job:query']">
          <Icon icon="ep:zoom-in" class="mr-5px" /> Execution Log
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Status" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_JOB_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Handler Name" align="center" prop="handlerName" />
      <el-table-column label="Handler Param" align="center" prop="handlerParam" />
      <el-table-column label="CRON Expression" align="center" prop="cronExpression" />
      <el-table-column label="Operation" align="center" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['infra:job:update']"
          >
            Edit
          </el-button>
          <el-button
            type="primary"
            link
            @click="handleChangeStatus(scope.row)"
            v-hasPermi="['infra:job:update']"
          >
            {{ scope.row.status === InfraJobStatusEnum.STOP ? 'Launch' : 'Suspend' }}
          </el-button>
          <el-button
            type="danger"
            link
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['infra:job:delete']"
          >
            Delete
          </el-button>
          <el-dropdown
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['infra:job:trigger', 'infra:job:query']"
          >
            <el-button type="primary" link><Icon icon="ep:d-arrow-right" /> More</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="handleRun" v-if="checkPermi(['infra:job:trigger'])">
                  Execute Once
                </el-dropdown-item>
                <el-dropdown-item command="openDetail" v-if="checkPermi(['infra:job:query'])">
                  Task Detail
                </el-dropdown-item>
                <el-dropdown-item command="handleJobLog" v-if="checkPermi(['infra:job:query'])">
                  Scheduling Log
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

  <!-- Form pop-up window：add/modify -->
  <JobForm ref="formRef" @success="getList" />
  <!-- Form pop-up window：see -->
  <JobDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { checkPermi } from '@/utils/permission'
import JobForm from './JobForm.vue'
import JobDetail from './JobDetail.vue'
import download from '@/utils/download'
import * as JobApi from '@/api/infra/job'
import { InfraJobStatusEnum } from '@/utils/constants'

defineOptions({ name: 'InfraJob' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window
const { push } = useRouter() // route

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  handlerName: undefined
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await JobApi.getJobPage(queryParams)
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

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await JobApi.exportJob(queryParams)
    download.excel(data, 'Scheduled Tasks.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Modify status operation */
const handleChangeStatus = async (row: JobApi.JobVO) => {
  try {
    // Secondary confirmation of modification status
    const text = row.status === InfraJobStatusEnum.STOP ? 'Start' : 'Close'
    await message.confirm(
      'Are you sure you want to ' + text + ' the data item with the scheduled task ID: "' + row.id + '"?',
      t('common.reminder')
    )
    const status =
      row.status === InfraJobStatusEnum.STOP ? InfraJobStatusEnum.NORMAL : InfraJobStatusEnum.STOP
    await JobApi.updateJobStatus(row.id, status)
    message.success(text + ' Success')
    // Refresh List 
    await getList()
  } catch {}
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await JobApi.deleteJob(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** 'more'Operation button */
const handleCommand = (command, row) => {
  switch (command) {
    case 'handleRun':
      handleRun(row)
      break
    case 'openDetail':
      openDetail(row.id)
      break
    case 'handleJobLog':
      handleJobLog(row?.id)
      break
    default:
      break
  }
}

/** Execute once */
const handleRun = async (row: JobApi.JobVO) => {
  try {
    // Secondary confirmation
    await message.confirm('Confirm to execute immediately once ' + row.name + '?', t('common.reminder'))
    // Submit for execution
    await JobApi.runJob(row.id)
    message.success('Execution Successful')
    // Refresh List 
    await getList()
  } catch {}
}

/** View operation */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** Jump execution log */
const handleJobLog = (id?: number) => {
  if (id && id > 0) {
    push('/job/job-log?id=' + id)
  } else {
    push('/job/job-log')
  }
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
