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
      <el-form-item label="prompt word" prop="prompt">
        <el-input
          v-model="queryParams.prompt"
          placeholder="Please enter the prompt word"
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
      <el-table-column label="number" align="center" prop="id" width="180" fixed="left" />
      <el-table-column label="user" align="center" prop="userId" width="180">
        <template #default="scope">
          <span>{{ userList.find((item) => item.id === scope.row.userId)?.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="prompt word" align="center" prop="prompt" width="180" />
      <el-table-column label="Mind map" align="center" prop="generatedContent" min-width="300" />
      <el-table-column label="Model" align="center" prop="model" width="180" />
      <el-table-column
        label="Create time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="error message" align="center" prop="errorMessage" />
      <el-table-column label="operation" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openPreview(scope.row)"> preview </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ai:mind-map:delete']"
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

  <!-- Preview of mind map -->
  <el-drawer v-model="previewVisible" :with-header="false" size="800px">
    <Right
      v-if="previewVisible2"
      :generatedContent="previewContent"
      :isEnd="true"
      :isGenerating="false"
      :isStart="false"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { AiMindMapApi, MindMapVO } from '@/api/ai/mindmap'
import * as UserApi from '@/api/system/user'
import Right from '@/views/ai/mindmap/index/components/Right.vue'

/** AI Mind map list */
defineOptions({ name: 'AiMindMapManager' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref<MindMapVO[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  prompt: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form
const userList = ref<UserApi.UserVO[]>([]) // User List

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await AiMindMapApi.getMindMapPage(queryParams)
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
    await AiMindMapApi.deleteMindMap(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** Preview operation button */
const previewVisible = ref(false) // drawer show and hide
const previewVisible2 = ref(false) // right show and hide
const previewContent = ref('')
const openPreview = async (row: MindMapVO) => {
  previewVisible2.value = false
  previewVisible.value = true
  // Render the right-side preview after the `drawer` is rendered. Otherwise, an error will occur. It's necessary to ensure that the width is available first. 
  await nextTick()
  previewVisible2.value = true
  previewContent.value = row.generatedContent
}

/** initialization **/
onMounted(async () => {
  getList()
  // get user list
  userList.value = await UserApi.getSimpleUserList()
})
</script>
