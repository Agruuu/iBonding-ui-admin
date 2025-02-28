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
      <el-form-item label="platform" prop="platform">
        <el-select v-model="queryParams.status" placeholder="Please choose a platform" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AI_PLATFORM)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Painting status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select the painting status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AI_IMAGE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Whether to publish" prop="publicStatus">
        <el-select
          v-model="queryParams.publicStatus"
          placeholder="Please choose whether to publish or not"
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
      <el-table-column label="Id" align="center" prop="id" width="180" fixed="left" />
      <el-table-column label="Image" align="center" prop="picUrl" width="110px" fixed="left">
        <template #default="{ row }">
          <el-image
            class="h-80px w-80px"
            lazy
            :src="row.picUrl"
            :preview-src-list="[row.picUrl]"
            preview-teleported
            fit="cover"
            v-if="row.picUrl?.length > 0"
          />
        </template>
      </el-table-column>
      <el-table-column label="User" align="center" prop="userId" width="180">
        <template #default="scope">
          <span>{{ userList.find((item) => item.id === scope.row.userId)?.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Platform" align="center" prop="platform" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_PLATFORM" :value="scope.row.platform" />
        </template>
      </el-table-column>
      <el-table-column label="Model" align="center" prop="model" width="180" />
      <el-table-column label="Painting status" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_IMAGE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Whether to publish" align="center" prop="publicStatus">
        <template #default="scope">
          <el-switch
            v-model="scope.row.publicStatus"
            :active-value="true"
            :inactive-value="false"
            @change="handleUpdatePublicStatusChange(scope.row)"
            :disabled="scope.row.status !== AiImageStatusEnum.SUCCESS"
          />
        </template>
      </el-table-column>
      <el-table-column label="Prompt word" align="center" prop="prompt" width="180" />
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="Width" align="center" prop="width" />
      <el-table-column label="Height" align="center" prop="height" />
      <el-table-column label="Error message" align="center" prop="errorMessage" />
      <el-table-column label="Task number" align="center" prop="taskId" />
      <el-table-column label="Operation" align="center" width="100" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ai:image:delete']"
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
import { getIntDictOptions, DICT_TYPE, getStrDictOptions, getBoolDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { ImageApi, ImageVO } from '@/api/ai/image'
import * as UserApi from '@/api/system/user'
import { AiImageStatusEnum } from '@/views/ai/utils/constants'

/** AI painting list */
defineOptions({ name: 'AiImageManager' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref<ImageVO[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  platform: undefined,
  status: undefined,
  publicStatus: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form
const userList = ref<UserApi.UserVO[]>([]) // User List

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ImageApi.getImagePage(queryParams)
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

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await ImageApi.deleteImage(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** Modify whether to publish or not */
const handleUpdatePublicStatusChange = async (row: ImageVO) => {
  try {
    // Secondary confirmation of modification status
    const text = row.publicStatus ? 'public' : 'private'
    await message.confirm('Confirm to "' + text + '" this image?')
    // Initiate modification status
    await ImageApi.updateImage({
      id: row.id,
      publicStatus: row.publicStatus
    })
    await getList()
  } catch {
    row.publicStatus = !row.publicStatus
  }
}

/** initialization **/
onMounted(async () => {
  getList()
  // get user list
  userList.value = await UserApi.getSimpleUserList()
})
</script>
