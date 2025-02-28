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
      <el-form-item label="Conversation number" prop="conversationId">
        <el-input
          v-model="queryParams.conversationId"
          placeholder="Please enter the conversation number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
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
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> reset</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="Message number" align="center" prop="id" width="180" fixed="left" />
      <el-table-column
        label="Conversation number"
        align="center"
        prop="conversationId"
        width="180"
        fixed="left"
      />
      <el-table-column label="User" align="center" prop="userId" width="180">
        <template #default="scope">
          <span>{{ userList.find((item) => item.id === scope.row.userId)?.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" align="center" prop="roleName" width="180" />
      <el-table-column label="Message type" align="center" prop="type" width="100" />
      <el-table-column label="Model identification" align="center" prop="model" width="180" />
      <el-table-column label="Message content" align="center" prop="content" width="300" />
      <el-table-column
        label="Creation time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="Reply message number" align="center" prop="replyId" width="180" />
      <el-table-column label="Carrying context" align="center" prop="useContext" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.useContext" />
        </template>
      </el-table-column>
      <el-table-column label="operation" align="center" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ai:chat-message:delete']"
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
import { dateFormatter } from '@/utils/formatTime'
import { ChatMessageApi, ChatMessageVO } from '@/api/ai/chat/message'
import * as UserApi from '@/api/system/user'
import { DICT_TYPE } from '@/utils/dict'

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref<ChatMessageVO[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  conversationId: undefined,
  userId: undefined,
  content: undefined,
  createTime: []
})
const queryFormRef = ref() // Search form
const userList = ref<UserApi.UserVO[]>([]) // User List

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ChatMessageApi.getChatMessagePage(queryParams)
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
    await ChatMessageApi.deleteChatMessageByAdmin(id)
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
