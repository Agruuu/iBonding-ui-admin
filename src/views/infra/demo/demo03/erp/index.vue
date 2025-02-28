<template>
  <ContentWrap>
    <!-- Search Work Bar -->
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
          placeholder="Please enter a name"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Gender" prop="sex">
        <el-select v-model="queryParams.sex" class="!w-240px" clearable placeholder="Please select gender">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)"
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
          v-hasPermi="['infra:demo03-student:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" />
          Add
        </el-button>
        <el-button
          v-hasPermi="['infra:demo03-student:export']"
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
    <el-table
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      :stripe="true"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="Name" prop="name" />
      <el-table-column align="center" label="Gender" prop="sex">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Birthday:"
        prop="birthday"
        width="180px"
      />
      <el-table-column align="center" label="Description" prop="description" />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Create Time"
        prop="createTime"
        width="180px"
      />
      <el-table-column align="center" label="Operation">
        <template #default="scope">
          <el-button
            v-hasPermi="['infra:demo03-student:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            Edit
          </el-button>
          <el-button
            v-hasPermi="['infra:demo03-student:delete']"
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
  <Demo03StudentForm ref="formRef" @success="getList" />
  <!-- List of sub tables -->
  <ContentWrap>
    <el-tabs model-value="demo03Course">
      <el-tab-pane label="Student Courses" name="demo03Course">
        <Demo03CourseList :student-id="currentRow?.id" />
      </el-tab-pane>
      <el-tab-pane label="Student Class" name="demo03Grade">
        <Demo03GradeList :student-id="currentRow?.id" />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as Demo03StudentApi from '@/api/infra/demo/demo03/erp'
import Demo03StudentForm from './Demo03StudentForm.vue'
import Demo03CourseList from './components/Demo03CourseList.vue'
import Demo03GradeList from './components/Demo03GradeList.vue'

defineOptions({ name: 'Demo03Student' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null,
  sex: null,
  description: null,
  createTime: []
})
const queryFormRef = ref() // Search form
const exportLoading = ref(false) // In the process of exporting and loading

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await Demo03StudentApi.getDemo03StudentPage(queryParams)
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
    await Demo03StudentApi.deleteDemo03Student(id)
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
    const data = await Demo03StudentApi.exportDemo03Student(queryParams)
    download.excel(data, 'Student.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** Select row operation */
const currentRow = ref({}) // Select row
const handleCurrentChange = (row) => {
  currentRow.value = row
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
