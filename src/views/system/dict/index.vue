<template>
  <!-- Search Work Bar -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="Please enter the dictionary name"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-input
          v-model="queryParams.type"
          class="!w-240px"
          clearable
          placeholder="Please enter the dictionary type"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="Please select dictionary status"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Create Time" prop="createTime">
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
        <el-button
          v-hasPermi="['system:dict:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" />
          Add
        </el-button>
        <el-button
          v-hasPermi="['system:dict:export']"
          :loading="exportLoading"
          plain
          type="success"
          @click="handleExport"
        >
          <Icon class="mr-5px" icon="ep:download" />
          Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="Name" prop="name" show-overflow-tooltip />
      <el-table-column align="center" label="Type" prop="type" width="300" />
      <el-table-column align="center" label="Status" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Remarks" prop="remark" />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Create Time"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" label="Operation">
        <template #default="scope">
          <el-button
            v-hasPermi="['system:dict:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            Edit
          </el-button>
          <router-link :to="'/dict/type/data/' + scope.row.type">
            <el-button link type="primary">Data</el-button>
          </router-link>
          <el-button
            v-hasPermi="['system:dict:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            Delete
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

  <!-- Form pop-up window：add/modify -->
  <DictTypeForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as DictTypeApi from '@/api/system/dict/dict.type'
import DictTypeForm from './DictTypeForm.vue'
import download from '@/utils/download'

defineOptions({ name: 'SystemDictType' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // Dictionary table data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  type: '',
  status: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query dictionary type list */
const getList = async () => {
  loading.value = true
  try {
    const data = await DictTypeApi.getDictTypePage(queryParams)
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
    await DictTypeApi.deleteDictType(id)
    message.success(t('common.delSuccess'))
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
    const data = await DictTypeApi.exportDictType(queryParams)
    download.excel(data, 'Dictionary type.xls')
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
