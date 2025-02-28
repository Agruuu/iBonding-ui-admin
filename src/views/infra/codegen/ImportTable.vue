<template>
  <Dialog v-model="dialogVisible" title="Import Table" width="800px">
    <!-- Search bar -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="Data Source" prop="dataSourceConfigId">
        <el-select
          v-model="queryParams.dataSourceConfigId"
          class="!w-240px"
          placeholder="Please select a data source"
        >
          <el-option
            v-for="config in dataSourceConfigList"
            :key="config.id"
            :label="config.name"
            :value="config.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Table Name" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="Please enter the table name"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="Table Comment" prop="comment">
        <el-input
          v-model="queryParams.comment"
          class="!w-240px"
          clearable
          placeholder="Please enter a table comment"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getList">
          <Icon class="mr-5px" icon="ep:search" />
          Search
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          Reset
        </el-button>
      </el-form-item>
    </el-form>
    <!-- list -->
    <el-row>
      <el-table
        ref="tableRef"
        v-loading="dbTableLoading"
        :data="dbTableList"
        height="260px"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :show-overflow-tooltip="true" label="Table Name" prop="name" />
        <el-table-column :show-overflow-tooltip="true" label="Table Comment" prop="comment" />
      </el-table>
    </el-row>
    <!-- operation -->
    <template #footer>
      <el-button :disabled="tableList.length === 0" type="primary" @click="handleImportTable">
        Import
      </el-button>
      <el-button @click="close">Close</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as CodegenApi from '@/api/infra/codegen'
import * as DataSourceConfigApi from '@/api/infra/dataSourceConfig'
import { ElTable } from 'element-plus'

defineOptions({ name: 'InfraCodegenImportTable' })

const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dbTableLoading = ref(true) // Loading of data source
const dbTableList = ref<CodegenApi.DatabaseTableVO[]>([]) // List of Tables
const queryParams = reactive({
  name: undefined,
  comment: undefined,
  dataSourceConfigId: 0
})
const queryFormRef = ref() // Search form
const dataSourceConfigList = ref<DataSourceConfigApi.DataSourceConfigVO[]>([]) // Data source list

/** Query table data */
const getList = async () => {
  dbTableLoading.value = true
  try {
    dbTableList.value = await CodegenApi.getSchemaTableList(queryParams)
  } finally {
    dbTableLoading.value = false
  }
}

/** Reset operation */
const resetQuery = async () => {
  queryParams.name = undefined
  queryParams.comment = undefined
  queryParams.dataSourceConfigId = dataSourceConfigList.value[0].id as number
  await getList()
}

/** Open pop-up window */
const open = async () => {
  // List of loading data sources
  dataSourceConfigList.value = await DataSourceConfigApi.getDataSourceConfigList()
  queryParams.dataSourceConfigId = dataSourceConfigList.value[0].id as number
  dialogVisible.value = true
  // List of loaded tables
  await getList()
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Close the pop-up window */
const close = () => {
  dialogVisible.value = false
  tableList.value = []
}

const tableRef = ref<typeof ElTable>() // The table's Ref
const tableList = ref<string[]>([]) // Selected table name

/** Process clicks on a certain line */
const handleRowClick = (row) => {
  unref(tableRef)?.toggleRowSelection(row)
}

/** Multiple Choice Box Select Data */
const handleSelectionChange = (selection) => {
  tableList.value = selection.map((item) => item.name)
}

/** Import button operation */
const handleImportTable = async () => {
  await CodegenApi.createCodegenList({
    dataSourceConfigId: queryParams.dataSourceConfigId,
    tableNames: tableList.value
  })
  message.success('Import Successful')
  emit('success')
  close()
}
const emit = defineEmits(['success'])
</script>
