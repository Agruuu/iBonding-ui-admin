<!-- Expression selection -->
<template>
  <Dialog title="Please Select an Expression" v-model="dialogVisible" width="1024px">
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="Name" align="center" prop="name" />
        <el-table-column label="Expression" align="center" prop="expression" />
        <el-table-column label="Operation" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="select(scope.row)"> Select </el-button>
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
  </Dialog>
</template>
<script setup lang="ts">
import { CommonStatusEnum } from '@/utils/constants'
import { ProcessExpressionApi, ProcessExpressionVO } from '@/api/bpm/processExpression'

/** BPM process form  */
defineOptions({ name: 'ProcessExpressionDialog' })

const dialogVisible = ref(false) // Is the pop-up displayed
const loading = ref(true) // Loading the list
const list = ref<ProcessExpressionVO[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: '',
  status: CommonStatusEnum.ENABLE
})

/** Open pop-up window */
const open = (type: string) => {
  queryParams.pageNo = 1
  queryParams.type = type
  getList()
  dialogVisible.value = true
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProcessExpressionApi.getProcessExpressionPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const select = async (row) => {
  dialogVisible.value = false
  // Event of successful sending operation
  emit('select', row)
}
</script>
