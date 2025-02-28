<template>
  <!-- search -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="Table Name" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          class="!w-240px"
          clearable
          placeholder="Please enter the table name"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Table Comment" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          class="!w-240px"
          clearable
          placeholder="Please enter a table comment"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Create time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="End Date"
          start-placeholder="Start Date"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          Search
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          Reset
        </el-button>
        <el-button v-hasPermi="['infra:codegen:create']" type="primary" @click="openImportTable()">
          <Icon class="mr-5px" icon="ep:zoom-in" />
          Import
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="Data Source">
        <template #default="scope">
          {{
            dataSourceConfigList.find((config) => config.id === scope.row.dataSourceConfigId)?.name
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Table Name" prop="tableName" width="200" />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="Table Comment"
        prop="tableComment"
        width="200"
      />
      <el-table-column align="center" label="Entity" prop="className" width="200" />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Create Time"
        prop="createTime"
        width="180"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Update Time"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" fixed="right" label="Operation" width="300px">
        <template #default="scope">
          <el-button
            v-hasPermi="['infra:codegen:preview']"
            link
            type="primary"
            @click="handlePreview(scope.row)"
          >
            Preview
          </el-button>
          <el-button
            v-hasPermi="['infra:codegen:update']"
            link
            type="primary"
            @click="handleUpdate(scope.row.id)"
          >
            Edit
          </el-button>
          <el-button
            v-hasPermi="['infra:codegen:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            Delete
          </el-button>
          <el-button
            v-hasPermi="['infra:codegen:update']"
            link
            type="primary"
            @click="handleSyncDB(scope.row)"
          >
            Synchronization
          </el-button>
          <el-button
            v-hasPermi="['infra:codegen:download']"
            link
            type="primary"
            @click="handleGenTable(scope.row)"
          >
            Generate Code
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- paging -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- pop-up notification：Import Table -->
  <ImportTable ref="importRef" @success="getList" />
  <!-- pop-up notification：Preview code -->
  <PreviewCode ref="previewRef" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as CodegenApi from '@/api/infra/codegen'
import * as DataSourceConfigApi from '@/api/infra/dataSourceConfig'
import ImportTable from './ImportTable.vue'
import PreviewCode from './PreviewCode.vue'

defineOptions({ name: 'InfraCodegen' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization
const { push } = useRouter() // Route jump

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tableName: undefined,
  tableComment: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form
const dataSourceConfigList = ref<DataSourceConfigApi.DataSourceConfigVO[]>([]) // Data source list

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await CodegenApi.getCodegenTablePage(queryParams)
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

/** Import operation */
const importRef = ref()
const openImportTable = () => {
  importRef.value.open()
}

/** Editing operation */
const handleUpdate = (id: number) => {
  push('/codegen/edit?id=' + id)
}

/** Preview operation */
const previewRef = ref()
const handlePreview = (row: CodegenApi.CodegenTableVO) => {
  previewRef.value.open(row.id)
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await CodegenApi.deleteCodegenTable(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** Synchronization operation  */
const handleSyncDB = async (row: CodegenApi.CodegenTableVO) => {
  // Based on DB synchronization
  const tableName = row.tableName
  try {
    await message.confirm('Are you sure you want to force synchronization of the ' + tableName + ' table structure?', t('common.reminder'))
    await CodegenApi.syncCodegenFromDB(row.id)
    message.success('Synchronization successful')
  } catch {}
}

/** Generate code operation */
const handleGenTable = async (row: CodegenApi.CodegenTableVO) => {
  const res = await CodegenApi.downloadCodegen(row.id)
  download.zip(res, 'codegen-' + row.className + '.zip')
}

/** initialization **/
onMounted(async () => {
  await getList()
  // Load data source list
  dataSourceConfigList.value = await DataSourceConfigApi.getDataSourceConfigList()
})
</script>
