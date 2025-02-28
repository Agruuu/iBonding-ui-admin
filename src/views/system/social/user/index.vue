<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="120px"
    >
      <el-form-item label="Social platform" prop="type">
        <el-select
          v-model="queryParams.type"
          class="!w-240px"
          clearable
          placeholder="Please choose a social platform"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SOCIAL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Nickname" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          class="!w-240px"
          clearable
          placeholder="Please enter user nickname"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Openid" prop="openid">
        <el-input
          v-model="queryParams.openid"
          class="!w-240px"
          clearable
          placeholder="Please enter social platform openid"
          @keyup.enter="handleQuery"
        />
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
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="Social Platform" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SOCIAL_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Openid" prop="openid" />
      <el-table-column align="center" label="Nickname" prop="nickname" />
      <el-table-column align="center" label="Avatar" prop="avatar">
        <template #default="{ row }">
          <el-image :src="row.avatar" class="h-30px w-30px" @click="imagePreview(row.avatar)" />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Create Time"
        prop="createTime"
        width="180px"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Update Time"
        prop="updateTime"
        width="180px"
      />
      <el-table-column align="center" fixed="right" label="Operation">
        <template #default="scope">
          <el-button
            v-hasPermi="['system:social-user:query']"
            link
            type="primary"
            @click="openDetail(scope.row.id)"
          >
            Details
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

  <!-- Form pop-up window：details -->
  <SocialUserDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as SocialUserApi from '@/api/system/social/user'
import SocialUserDetail from './SocialUserDetail.vue'
import { createImageViewer } from '@/components/ImageViewer'

defineOptions({ name: 'SocialUser' })

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: undefined,
  openid: undefined,
  nickname: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await SocialUserApi.getSocialUserPage(queryParams)
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

const imagePreview = (imgUrl: string) => {
  createImageViewer({
    urlList: [imgUrl]
  })
}

/** Detailed operation */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
