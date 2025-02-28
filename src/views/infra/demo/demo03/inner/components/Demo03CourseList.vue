<template>
  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Score" align="center" prop="score" />
      <el-table-column
        label="Create Time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as Demo03StudentApi from '@/api/infra/demo/demo03/inner'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const props = defineProps<{
  studentId: undefined // Student ID（Associated fields of the main table）
}>()
const loading = ref(false) // Loading the list
const list = ref([]) // List of data

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    list.value = await Demo03StudentApi.getDemo03CourseListByStudentId(props.studentId)
  } finally {
    loading.value = false
  }
}

/** Search button operation */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
