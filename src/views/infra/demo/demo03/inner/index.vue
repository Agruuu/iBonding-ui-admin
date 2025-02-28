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
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please enter a name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Gender" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="Please select gender" clearable class="!w-240px">
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
          v-hasPermi="['infra:demo03-student:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> Add
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['infra:demo03-student:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- List of sub tables -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="demo03Course">
            <el-tab-pane label="Student Course" name="demo03Course">
              <Demo03CourseList :student-id="scope.row.id" />
            </el-tab-pane>
            <el-tab-pane label="Student Class" name="demo03Grade">
              <Demo03GradeList :student-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Gender" align="center" prop="sex">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column
        label="Birthday"
        align="center"
        prop="birthday"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="Description" align="center" prop="description" />
      <el-table-column
        label="Create Time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="Operation" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['infra:demo03-student:update']"
          >
            Edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['infra:demo03-student:delete']"
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
  <Demo03StudentForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as Demo03StudentApi from '@/api/infra/demo/demo03/inner'
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

/** initialization **/
onMounted(() => {
  getList()
})
</script>
