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
      <el-form-item label="Sign in user" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="Please enter the check-in user"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Check in days" prop="day">
        <el-input
          v-model="queryParams.day"
          placeholder="Please enter the number of check-in days"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Check in time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
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
    <el-table v-loading="loading" :data="list">
      <el-table-column label="number" align="center" prop="id" />
      <el-table-column
        label="Check in days"
        align="center"
        prop="day"
        :formatter="(_, __, cellValue) => ['The', cellValue, 'day'].join(' ')"
      />
      <el-table-column label="Get points" align="center" prop="point" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.point > 0" class="ml-2" type="success" effect="dark">
            +{{ scope.row.point }}
          </el-tag>
          <el-tag v-else class="ml-2" type="danger" effect="dark"> {{ scope.row.point }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Check in time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
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

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as SignInRecordApi from '@/api/member/signin/record'

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: NaN,
  nickname: null,
  day: null,
  createTime: []
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await SignInRecordApi.getSignInRecordPage(queryParams)
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

const { userId } = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

/** initialization **/
onMounted(() => {
  queryParams.userId = userId
  getList()
})
</script>
