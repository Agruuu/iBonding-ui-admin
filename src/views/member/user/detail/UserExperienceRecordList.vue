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
      <el-form-item label="Business type" prop="bizType">
        <el-select
          v-model="queryParams.bizType"
          placeholder="Please select the business type"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MEMBER_EXPERIENCE_BIZ_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="title" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="Please enter a title"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Creation time" prop="createTime">
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
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="number" align="center" prop="id" width="150px" />
      <el-table-column
        label="Get Time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column label="experience" align="center" prop="experience" width="150px">
        <template #default="scope">
          <el-tag v-if="scope.row.experience > 0" class="ml-2" type="success" effect="dark">
            +{{ scope.row.experience }}
          </el-tag>
          <el-tag v-else class="ml-2" type="danger" effect="dark">
            {{ scope.row.experience }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Total experience" align="center" prop="totalExperience" width="150px">
        <template #default="scope">
          <el-tag class="ml-2" effect="dark">
            {{ scope.row.totalExperience }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="title" align="center" prop="title" width="150px" />
      <el-table-column label="describe" align="center" prop="description" />
      <el-table-column label="Business Number" align="center" prop="bizId" width="150px" />
      <el-table-column label="Business type" align="center" prop="bizType" width="150px">
        <!--   TODO Taro：A corresponding dictionary should be created here -->
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MEMBER_EXPERIENCE_BIZ_TYPE" :value="scope.row.bizType" />
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
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as ExperienceRecordApi from '@/api/member/experience-record/index'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

defineOptions({ name: 'UserExperienceRecordList' })

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: null,
  bizId: null,
  bizType: null,
  title: null,
  description: null,
  experience: null,
  totalExperience: null,
  createTime: []
})
const queryFormRef = ref() // Search form
/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ExperienceRecordApi.getExperienceRecordPage(queryParams)
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
