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
      <el-form-item label="user" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="Please enter user nickname"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Business type" prop="bizType">
        <el-select
          v-model="queryParams.bizType"
          placeholder="Please select the business type"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MEMBER_POINT_BIZ_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Points Title" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="Please enter the title of your points"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Get Time" prop="createDate">
        <el-date-picker
          v-model="queryParams.createDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          search
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          Reset
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="number" align="center" prop="id" width="180" />
      <el-table-column
        label="Get Time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="user" align="center" prop="nickname" width="200" />
      <el-table-column label="Get points" align="center" prop="point" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.point > 0" class="ml-2" type="success" effect="dark">
            +{{ scope.row.point }}
          </el-tag>
          <el-tag v-else class="ml-2" type="danger" effect="dark"> {{ scope.row.point }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Total points" align="center" prop="totalPoint" width="100" />
      <el-table-column label="title" align="center" prop="title" />
      <el-table-column label="describe" align="center" prop="description" />
      <el-table-column label="Business code" align="center" prop="bizId" />
      <el-table-column label="Business type" align="center" prop="bizType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MEMBER_POINT_BIZ_TYPE" :value="scope.row.bizType" />
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

  <!-- Form pop-up window：add to/modify -->
  <RecordForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as RecordApi from '@/api/member/point/record'

defineOptions({ name: 'PointRecord' })

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickname: null,
  bizType: null,
  title: null,
  createDate: []
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await RecordApi.getRecordPage(queryParams)
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

/** initialization **/
onMounted(() => {
  getList()
})
</script>
