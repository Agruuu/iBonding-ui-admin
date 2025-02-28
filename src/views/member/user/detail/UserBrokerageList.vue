<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="85px"
    >
      <el-form-item label="customer type" prop="level">
        <el-radio-group v-model="queryParams.level" @change="handleQuery">
          <el-radio-button checked>whole</el-radio-button>
          <el-radio-button value="1">First level promoter</el-radio-button>
          <el-radio-button value="2">Secondary promoter</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Binding time" prop="bindUserTime">
        <el-date-picker
          v-model="queryParams.bindUserTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="User ID" align="center" prop="id" min-width="80px" />
      <el-table-column label="head portrait" align="center" prop="avatar" width="70px">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="nickname" align="center" prop="nickname" min-width="80px" />
      <el-table-column label="Grade" align="center" prop="level" min-width="80px">
        <template #default="scope">
          <el-tag v-if="scope.row.bindUserId === bindUserId">class a</el-tag>
          <el-tag v-else>second level</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Binding time"
        align="center"
        prop="bindUserTime"
        :formatter="dateFormatter"
        width="170px"
      />
    </el-table>
    <!-- paging -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as BrokerageUserApi from '@/api/mall/trade/brokerage/user'

/** List of Promoters */
defineOptions({ name: 'UserBrokerageList' })

const { bindUserId }: { bindUserId: number } = defineProps({
  bindUserId: {
    type: Number,
    required: true
  }
}) //User ID

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  bindUserId: null,
  level: '',
  bindUserTime: []
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    queryParams.bindUserId = bindUserId
    const data = await BrokerageUserApi.getBrokerageUserPage(queryParams)
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
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
