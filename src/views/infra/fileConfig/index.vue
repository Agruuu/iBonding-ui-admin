<template>
  <!-- search -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="Configuration Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please enter the configuration name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Storage" prop="storage">
        <el-select
          v-model="queryParams.storage"
          placeholder="Please select a storage device"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_FILE_STORAGE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Create Time" prop="createTime">
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['infra:file-config:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> Add
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Configuration Name" align="center" prop="name" />
      <el-table-column label="Storage" align="center" prop="storage">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_FILE_STORAGE" :value="scope.row.storage" />
        </template>
      </el-table-column>
      <el-table-column label="Remarks" align="center" prop="remark" />
      <el-table-column label="Main Configuration" align="center" prop="primary">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.master" />
        </template>
      </el-table-column>
      <el-table-column
        label="Create Time"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Operation" align="center" width="240px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['infra:file-config:update']"
          >
            Edit
          </el-button>
          <el-button
            link
            type="primary"
            :disabled="scope.row.master"
            @click="handleMaster(scope.row.id)"
            v-hasPermi="['infra:file-config:update']"
          >
            Main Configuration
          </el-button>
          <el-button link type="primary" @click="handleTest(scope.row.id)"> Test </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['infra:file-config:delete']"
          >
            Delete
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

  <!-- Form pop-up window：add/modify -->
  <FileConfigForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as FileConfigApi from '@/api/infra/fileConfig'
import FileConfigForm from './FileConfigForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'

defineOptions({ name: 'InfraFileConfig' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  storage: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await FileConfigApi.getFileConfigPage(queryParams)
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
    await FileConfigApi.deleteFileConfig(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** Main configuration button operation */
const handleMaster = async (id) => {
  try {
    await message.confirm('Are you sure you want to modify the data item with the configuration ID: "' + id + '" to the main configuration?')
    await FileConfigApi.updateFileConfigMaster(id)
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

/** Test button operation */
const handleTest = async (id) => {
  try {
    const response = await FileConfigApi.testFileConfig(id)
    await message.confirm('Do you want to access this file?', 'Test upload successful')
    window.open(response, '_blank')
  } catch {}
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
