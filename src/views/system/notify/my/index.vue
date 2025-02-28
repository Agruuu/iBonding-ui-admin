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
      <el-form-item label="Read Status" prop="readStatus">
        <el-select
          v-model="queryParams.readStatus"
          placeholder="Please select the status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Send Time" prop="createTime">
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
        <el-button @click="handleUpdateList">
          <Icon icon="ep:reading" class="mr-5px" /> Mark as Read
        </el-button>
        <el-button @click="handleUpdateAll">
          <Icon icon="ep:reading" class="mr-5px" /> All Read
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      ref="tableRef"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="selectable" :reserve-selection="true" />
      <el-table-column label="Sender" align="center" prop="templateNickname" width="180" />
      <el-table-column
        label="Send Time"
        align="center"
        prop="createTime"
        width="200"
        :formatter="dateFormatter"
      />
      <el-table-column label="Type" align="center" prop="templateType" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE" :value="scope.row.templateType" />
        </template>
      </el-table-column>
      <el-table-column
        label="Message Content"
        align="center"
        prop="templateContent"
        show-overflow-tooltip
      />
      <el-table-column label="Read Status" align="center" prop="readStatus" width="160">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.readStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="Read Time"
        align="center"
        prop="readTime"
        width="200"
        :formatter="dateFormatter"
      />
      <el-table-column label="Operation" align="center" width="160">
        <template #default="scope">
          <el-button
            link
            :type="scope.row.readStatus ? 'primary' : 'warning'"
            @click="openDetail(scope.row)"
          >
            {{ scope.row.readStatus ? 'Details' : 'Read Already' }}
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

  <!-- Form pop-up window：details -->
  <MyNotifyMessageDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getBoolDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'
import MyNotifyMessageDetail from './MyNotifyMessageDetail.vue'

defineOptions({ name: 'SystemMyNotify' })

const message = useMessage() // news

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  readStatus: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form
const tableRef = ref() // The table's Ref
const selectedIds = ref<number[]>([]) // Selection of Tables ID array

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await NotifyMessageApi.getMyNotifyMessagePage(queryParams)
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
  tableRef.value.clearSelection()
  handleQuery()
}

/** Detailed operation */
const detailRef = ref()
const openDetail = (data: NotifyMessageApi.NotifyMessageVO) => {
  if (!data.readStatus) {
    handleReadOne(data.id)
  }
  detailRef.value.open(data)
}

/** Mark an internal message as read */
const handleReadOne = async (id) => {
  await NotifyMessageApi.updateNotifyMessageRead(id)
  await getList()
}

/** Mark all internal messages as read **/
const handleUpdateAll = async () => {
  await NotifyMessageApi.updateAllNotifyMessageRead()
  message.success('All Read Successfully!')
  tableRef.value.clearSelection()
  await getList()
}

/** Mark some internal messages as read **/
const handleUpdateList = async () => {
  if (selectedIds.value.length === 0) {
    return
  }
  await NotifyMessageApi.updateNotifyMessageRead(selectedIds.value)
  message.success('Batch Read Successfully!')
  tableRef.value.clearSelection()
  await getList()
}

/** A certain line，Allow selection */
const selectable = (row) => {
  return !row.readStatus
}

/** This event will be triggered when the table selection item changes  */
const handleSelectionChange = (array: NotifyMessageApi.NotifyMessageVO[]) => {
  selectedIds.value = []
  if (!array) {
    return
  }
  array.forEach((row) => selectedIds.value.push(row.id))
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
