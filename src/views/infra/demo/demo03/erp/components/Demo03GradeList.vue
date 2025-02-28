<template>
  <!-- list -->
  <ContentWrap>
    <el-button
      v-hasPermi="['infra:demo03-student:create']"
      plain
      type="primary"
      @click="openForm('create')"
    >
      <Icon class="mr-5px" icon="ep:plus" />
      Add
    </el-button>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="Name" prop="name" />
      <el-table-column align="center" label="teacher" prop="teacher" />
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
  <Demo03GradeForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as Demo03StudentApi from '@/api/infra/demo/demo03/erp'
import Demo03GradeForm from './Demo03GradeForm.vue'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const props = defineProps<{
  studentId?: number // Student ID（Associated fields of the main table）
}>()
const loading = ref(false) // Loading the list
const list = ref([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  studentId: undefined as unknown
})

/** Monitor changes in associated fields of the main table，Load the corresponding sub table data */
watch(
  () => props.studentId,
  (val: number) => {
    if (!val) {
      return
    }
    queryParams.studentId = val
    handleQuery()
  },
  { immediate: true, deep: true }
)

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await Demo03StudentApi.getDemo03GradePage(queryParams)
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

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (!props.studentId) {
    message.error('Please select a student')
    return
  }
  formRef.value.open(type, id, props.studentId)
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await Demo03StudentApi.deleteDemo03Grade(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}
</script>
