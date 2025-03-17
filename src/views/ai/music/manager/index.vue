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
      <el-form-item label="Music name" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="Please enter the music name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Music status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select music status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AI_MUSIC_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Generate Mode" prop="generateMode">
        <el-select
          v-model="queryParams.generateMode"
          placeholder="Please select the generation mode"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AI_GENERATE_MODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Create time" prop="createTime">
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
      <el-form-item label="Whether to publish or not" prop="publicStatus">
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="ID" align="center" prop="id" width="180" fixed="left" />
      <el-table-column label="Music name" align="center" prop="title" width="180px" fixed="left" />
      <el-table-column label="User" align="center" prop="userId" width="180">
        <template #default="scope">
          <span>{{ userList.find((item) => item.id === scope.row.userId)?.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Music status" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_MUSIC_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Model" align="center" prop="model" width="180" />
      <el-table-column label="Content" align="center" width="180">
        <template #default="{ row }">
          <el-link
            v-if="row.audioUrl?.length > 0"
            type="primary"
            :href="row.audioUrl"
            target="_blank"
          >
            music
          </el-link>
          <el-link
            v-if="row.videoUrl?.length > 0"
            type="primary"
            :href="row.videoUrl"
            target="_blank"
            class="!pl-5px"
          >
            video
          </el-link>
          <el-link
            v-if="row.imageUrl?.length > 0"
            type="primary"
            :href="row.imageUrl"
            target="_blank"
            class="!pl-5px"
          >
            cover
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Duration（second）" align="center" prop="duration" width="100" />
      <el-table-column label="Prompt word" align="center" prop="prompt" width="180" />
      <el-table-column label="Lyric" align="center" prop="lyric" width="180" />
      <el-table-column label="Description" align="center" prop="gptDescriptionPrompt" width="180" />
      <el-table-column label="Generate Mode" align="center" prop="generateMode" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_GENERATE_MODE" :value="scope.row.generateMode" />
        </template>
      </el-table-column>
      <el-table-column label="Style tags" align="center" prop="tags" width="180">
        <template #default="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" round class="ml-2px">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Whether to publish or not" align="center" prop="publicStatus">
        <template #default="scope">
          <el-switch
            v-model="scope.row.publicStatus"
            :active-value="true"
            :inactive-value="false"
            @change="handleUpdatePublicStatusChange(scope.row)"
            :disabled="scope.row.status !== AiMusicStatusEnum.SUCCESS"
          />
        </template>
      </el-table-column>
      <el-table-column label="Task Number" align="center" prop="taskId" width="180" />
      <el-table-column label="Error message" align="center" prop="errorMessage" />
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="operation" align="center" width="100" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ai:music:delete']"
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
import { getIntDictOptions, getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { MusicApi, MusicVO } from '@/api/ai/music'
import * as UserApi from '@/api/system/user'
import { AiMusicStatusEnum } from '@/views/ai/utils/constants'

/** AI music list */
defineOptions({ name: 'AiMusicManager' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref<MusicVO[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  title: undefined,
  status: undefined,
  generateMode: undefined,
  createTime: [],
  publicStatus: undefined
})
const queryFormRef = ref() // Search form
const userList = ref<UserApi.UserVO[]>([]) // User List

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await MusicApi.getMusicPage(queryParams)
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
    await MusicApi.deleteMusic(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** Modify whether to publish or not */
const handleUpdatePublicStatusChange = async (row: MusicVO) => {
  try {
    // Secondary confirmation of modification status
    const text = row.publicStatus ? 'public' : 'private'
    await message.confirm('Confirm to "' + text + '" this music?')
    // Initiate modification status
    await MusicApi.updateMusic({
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
