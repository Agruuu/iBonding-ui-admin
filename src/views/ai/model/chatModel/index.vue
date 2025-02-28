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
      <el-form-item label="Model Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please enter the model name"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Model identification" prop="model">
        <el-input
          v-model="queryParams.model"
          placeholder="Please enter the model identifier"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Model platform" prop="platform">
        <el-input
          v-model="queryParams.platform"
          placeholder="Please enter the model platform"
          clearable
          @keyup.enter="handleQuery"
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
          v-hasPermi="['ai:chat-model:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> Add
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="Affiliated platform" align="center" prop="platform">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AI_PLATFORM" :value="scope.row.platform" />
        </template>
      </el-table-column>
      <el-table-column label="Model Name" align="center" prop="name" />
      <el-table-column label="Model identification" align="center" prop="model" />
      <el-table-column label="API Secret key" align="center" prop="keyId" min-width="140">
        <template #default="scope">
          <span>{{ apiKeyList.find((item) => item.id === scope.row.keyId)?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="sort" align="center" prop="sort" />
      <el-table-column label="status" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Temperature parameters" align="center" prop="temperature" />
      <el-table-column label="Number of replies number of Token" align="center" prop="maxTokens" min-width="140" />
      <el-table-column label="Number of contexts" align="center" prop="maxContexts" />
      <el-table-column label="operation" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ai:chat-model:update']"
          >
            edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ai:chat-model:delete']"
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

  <!-- Form pop-up window：add to/modify -->
  <ChatModelForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { ChatModelApi, ChatModelVO } from '@/api/ai/model/chatModel'
import ChatModelForm from './ChatModelForm.vue'
import { DICT_TYPE } from '@/utils/dict'
import { ApiKeyApi, ApiKeyVO } from '@/api/ai/model/apiKey'

/** API Chat Model list */
defineOptions({ name: 'AiChatModel' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref<ChatModelVO[]>([]) // List of data
const total = ref(0) // The total number of pages in the list
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  model: undefined,
  platform: undefined
})
const queryFormRef = ref() // Search form
const apiKeyList = ref([] as ApiKeyVO[]) // API Key List

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await ChatModelApi.getChatModelPage(queryParams)
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

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await ChatModelApi.deleteChatModel(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** initialization **/
onMounted(async () => {
  getList()
  // Obtain dropdown data
  apiKeyList.value = await ApiKeyApi.getApiKeySimpleList()
})
</script>
