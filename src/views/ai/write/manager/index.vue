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
      <el-form-item label="User ID" prop="userId">
        <el-select
          v-model="queryParams.userId"
          clearable
          placeholder="Please enter the user ID"
          class="!w-240px"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Writing type" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="Please choose a writing type"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AI_WRITE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="platform" prop="platform">
        <el-select v-model="queryParams.platform" placeholder="Please choose a platform" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AI_PLATFORM)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['ai:write:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> add
        </el-button>
        <!-- TODO @Agruuu  There is currently no export interface. Do you need to export it? -->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ai:write:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="id" align="center" prop="id" width="120" fixed="left" />
      <el-table-column label="user" align="center" prop="userId" width="180">
        <template #default="scope">
          <span>{{ userList.find((item) => item.id === scope.row.userId)?.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Writing type" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_WRITE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="platform" align="center" prop="platform" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_PLATFORM" :value="scope.row.platform" />
        </template>
      </el-table-column>
      <el-table-column label="Model" align="center" prop="model" width="180" />
      <el-table-column
        label="Generate content prompts"
        align="center"
        prop="prompt"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column label="Generated content" align="center" prop="generatedContent" width="180" />
      <el-table-column label="original text" align="center" prop="originalContent" width="180" />
      <el-table-column label="length" align="center" prop="length">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_WRITE_LENGTH" :value="scope.row.length" />
        </template>
      </el-table-column>
      <el-table-column label="format" align="center" prop="format">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_WRITE_FORMAT" :value="scope.row.format" />
        </template>
      </el-table-column>
      <el-table-column label="tone" align="center" prop="tone">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_WRITE_TONE" :value="scope.row.tone" />
        </template>
      </el-table-column>
      <el-table-column label="language" align="center" prop="language">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_WRITE_LANGUAGE" :value="scope.row.language" />
        </template>
      </el-table-column>
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="error message" align="center" prop="errorMessage" />
      <el-table-column label="operation" align="center">
        <template #default="scope">
<!--          TODO @Agruuu Currently, There is no modification interface，Can writing be changed? -->
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ai:write:update']"
          >
            edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ai:write:delete']"
          >
            delete
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
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { useRouter } from 'vue-router'
import { WriteApi, AiWritePageReqVO, AiWriteRespVo } from '@/api/ai/write'
import * as UserApi from '@/api/system/user'

/** AI Writing List */
defineOptions({ name: 'AiWriteManager' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization
const router = useRouter() // route

const loading = ref(true) // Loading the list
const list = ref<AiWriteRespVo[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive<AiWritePageReqVO>({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  type: undefined,
  platform: undefined,
  createTime: undefined
})
const queryFormRef = ref() // Search form
const userList = ref<UserApi.UserVO[]>([]) // User List

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await WriteApi.getWritePage(queryParams)
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

/** New Method，Jump to the writing page **/
const openForm = (type: string, id?: number) => {
  switch (type) {
    case 'create':
      router.push('/ai/write')
      break
  }
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await WriteApi.deleteWrite(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** initialization **/
onMounted(async () => {
  getList()
  // get user list
  userList.value = await UserApi.getSimpleUserList()
})
</script>
