<!--  AI conversation  -->
<template>
  <el-aside width="260px" class="conversation-container h-100%">
    <!-- Top left：conversation -->
    <div class="h-100%">
      <el-button class="w-1/1 btn-new-conversation" type="primary" @click="createConversation">
        <Icon icon="ep:plus" class="mr-5px" />
        Create a new conversation
      </el-button>

      <!-- Top left：Search conversation -->
      <el-input
        v-model="searchName"
        size="large"
        class="mt-10px search-input"
        placeholder="Search history"
        @keyup="searchConversation"
      >
        <template #prefix>
          <Icon icon="ep:search" />
        </template>
      </el-input>

      <!-- Left center：conversation List -->
      <div class="conversation-list">
        <!-- Situation 1：Loading in progress -->
        <el-empty v-if="loading" description="." :v-loading="loading" />
        <!-- Scenario 2: Display the chat session list grouped by "group". -->
        <div v-for="conversationKey in Object.keys(conversationMap)" :key="conversationKey">
          <div
            class="conversation-item classify-title"
            v-if="conversationMap[conversationKey].length"
          >
            <el-text class="mx-1" size="small" tag="b">{{ conversationKey }}</el-text>
          </div>
          <div
            class="conversation-item"
            v-for="conversation in conversationMap[conversationKey]"
            :key="conversation.id"
            @click="handleConversationClick(conversation.id)"
            @mouseover="hoverConversationId = conversation.id"
            @mouseout="hoverConversationId = ''"
          >
            <div
              :class="
                conversation.id === activeConversationId ? 'conversation active' : 'conversation'
              "
            >
              <div class="title-wrapper">
                <img class="avatar" :src="conversation.roleAvatar || roleAvatarDefaultImg" />
                <span class="title">{{ conversation.title }}</span>
              </div>
              <div class="button-wrapper" v-show="hoverConversationId === conversation.id">
                <el-button class="btn" link @click.stop="handleTop(conversation)">
                  <el-icon title="Top up" v-if="!conversation.pinned"><Top /></el-icon>
                  <el-icon title="Top up" v-if="conversation.pinned"><Bottom /></el-icon>
                </el-button>
                <el-button class="btn" link @click.stop="updateConversationTitle(conversation)">
                  <el-icon title="edit">
                    <Icon icon="ep:edit" />
                  </el-icon>
                </el-button>
                <el-button class="btn" link @click.stop="deleteChatConversation(conversation)">
                  <el-icon title="Delete conversation">
                    <Icon icon="ep:delete" />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- Bottom occupying space  -->
        <div class="h-160px w-100%"></div>
      </div>
    </div>

    <!-- Bottom left：toolbar -->
    <div class="tool-box">
      <div @click="handleRoleRepository">
        <Icon icon="ep:user" />
        <el-text size="small">Role repository</el-text>
      </div>
      <div @click="handleClearConversation">
        <Icon icon="ep:delete" />
        <el-text size="small">Clear Untitled Conversations</el-text>
      </div>
    </div>

    <!-- Role repository drawer -->
    <el-drawer v-model="roleRepositoryOpen" title="Role repository" size="754px">
      <RoleRepository />
    </el-drawer>
  </el-aside>
</template>

<script setup lang="ts">
import { ChatConversationApi, ChatConversationVO } from '@/api/ai/chat/conversation'
import RoleRepository from '../role/RoleRepository.vue'
import { Bottom, Top } from '@element-plus/icons-vue'
import roleAvatarDefaultImg from '@/assets/ai/gpt.svg'

const message = useMessage() // Message pop-up window

// Define attributes
const searchName = ref<string>('') // conversation search
const activeConversationId = ref<number | null>(null) // Selected conversation，Default is null
const hoverConversationId = ref<number | null>(null) // Floating conversation
const conversationList = ref([] as ChatConversationVO[]) // conversation List
const conversationMap = ref<any>({}) // conversation grouping (Top up、today、three days ago、A week ago、A month ago)
const loading = ref<boolean>(false) // Loading in progress
const loadingTime = ref<any>() // Loading timer

// Define components props
const props = defineProps({
  activeId: {
    type: String || null,
    required: true
  }
})

// Define hooks
const emits = defineEmits([
  'onConversationCreate',
  'onConversationClick',
  'onConversationClear',
  'onConversationDelete'
])

/** Search conversation */
const searchConversation = async (e) => {
  // Restore data
  if (!searchName.value.trim().length) {
    conversationMap.value = await getConversationGroupByCreateTime(conversationList.value)
  } else {
    // filter
    const filterValues = conversationList.value.filter((item) => {
      return item.title.includes(searchName.value.trim())
    })
    conversationMap.value = await getConversationGroupByCreateTime(filterValues)
  }
}

/** Click on the conversation */
const handleConversationClick = async (id: number) => {
  // Filter out selected conversations
  const filterConversation = conversationList.value.filter((item) => {
    return item.id === id
  })
  // Callback onConversationClick
  // noinspection JSVoidFunctionReturnValueUsed
  const success = emits('onConversationClick', filterConversation[0])
  // Switch conversation
  if (success) {
    activeConversationId.value = id
  }
}

/** Get conversation list */
const getChatConversationList = async () => {
  try {
    // Loading in progress
    loadingTime.value = setTimeout(() => {
      loading.value = true
    }, 50)

    // 1.1 get conversation data
    conversationList.value = await ChatConversationApi.getChatConversationMyList()
    // 1.2 sort
    conversationList.value.sort((a, b) => {
      return b.createTime - a.createTime
    })
    // 1.3 There is no conversation situation
    if (conversationList.value.length === 0) {
      activeConversationId.value = null
      conversationMap.value = {}
      return
    }

    // 2. Conversation is grouped according to time(Top up、today、1 day ago、3 days ago、7 days ago、30 days ago)
    conversationMap.value = await getConversationGroupByCreateTime(conversationList.value)
  } finally {
    // Clean the timer
    if (loadingTime.value) {
      clearTimeout(loadingTime.value)
    }
    // Loading completed
    loading.value = false
  }
}

/** Group by the creation time (`createTime`). */
const getConversationGroupByCreateTime = async (list: ChatConversationVO[]) => {
  // sort、appoint、Time grouping(today、1 day ago、3 days ago、7 days ago、30 days ago)
  // noinspection NonAsciiCharacters
  const groupMap = {
    TopUp: [],
    Today: [],
    OneDayAgo: [],
    ThreeDaysAgo: [],
    SevenDaysAgo: [],
    ShirtyDaysAgo: []
  }
  // The timestamp of the current time
  const now = Date.now()
  // Define time interval constant（unit：millisecond）
  const oneDay = 24 * 60 * 60 * 1000
  const threeDays = 3 * oneDay
  const sevenDays = 7 * oneDay
  const thirtyDays = 30 * oneDay
  for (const conversation of list) {
    // Top up
    if (conversation.pinned) {
      groupMap['TopUp'].push(conversation)
      continue
    }
    // Calculate time difference（unit：millisecond）
    const diff = now - conversation.createTime
    // Judging based on time intervals
    if (diff < oneDay) {
      groupMap['Today'].push(conversation)
    } else if (diff < threeDays) {
      groupMap['OneDayAgo'].push(conversation)
    } else if (diff < sevenDays) {
      groupMap['ThreeDaysAgo'].push(conversation)
    } else if (diff < thirtyDays) {
      groupMap['SevenDaysAgo'].push(conversation)
    } else {
      groupMap['ShirtyDaysAgo'].push(conversation)
    }
  }
  return groupMap
}

/** Create a new conversation */
const createConversation = async () => {
  // 1. Create a new conversation
  const conversationId = await ChatConversationApi.createChatConversationMy(
    {} as unknown as ChatConversationVO
  )
  // 2. Get conversation content
  await getChatConversationList()
  // 3. Select conversation
  await handleConversationClick(conversationId)
  // 4. Callback
  emits('onConversationCreate')
}

/** Change the title of the conversation */
const updateConversationTitle = async (conversation: ChatConversationVO) => {
  // 1. Secondary confirmation
  const { value } = await ElMessageBox.prompt('Change title', {
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // Determine non empty，And not a space
    inputErrorMessage: 'Title cannot be empty',
    inputValue: conversation.title
  })
  // 2. Initiate modifications
  await ChatConversationApi.updateChatConversationMy({
    id: conversation.id,
    title: value
  } as ChatConversationVO)
  message.success('Renaming successful')
  // 3. Refresh List 
  await getChatConversationList()
  // 4. Filter the currently switched
  const filterConversationList = conversationList.value.filter((item) => {
    return item.id === conversation.id
  })
  if (filterConversationList.length > 0) {
    // tip：Avoid switching conversations
    if (activeConversationId.value === filterConversationList[0].id) {
      emits('onConversationClick', filterConversationList[0])
    }
  }
}

/** Delete chat conversation */
const deleteChatConversation = async (conversation: ChatConversationVO) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm(`Are you sure you want to delete the conversation? - ${conversation.title}?`)
    // Initiate deletion
    await ChatConversationApi.deleteChatConversationMy(conversation.id)
    message.success('Conversation deleted')
    // Refresh List 
    await getChatConversationList()
    // Callback
    emits('onConversationDelete', conversation)
  } catch {}
}

/** Clear the conversation */
const handleClearConversation = async () => {
  try {
    await message.confirm('After confirmation, the conversation will be completely cleared，Except for conversations that are placed at the top。')
    await ChatConversationApi.deleteChatConversationMyByUnpinned()
    ElMessage({
      message: 'Operation successful!',
      type: 'success'
    })
    // empty conversation and conversation content
    activeConversationId.value = null
    // get conversation List
    await getChatConversationList()
    // Callback method
    emits('onConversationClear')
  } catch {}
}

/** Conversation at the top */
const handleTop = async (conversation: ChatConversationVO) => {
  // Update conversation to top
  conversation.pinned = !conversation.pinned
  await ChatConversationApi.updateChatConversationMy(conversation)
  // Refresh conversation
  await getChatConversationList()
}

// ============ Role repository ============

/** Role repository drawer */
const roleRepositoryOpen = ref<boolean>(false) // Is the role repository open
const handleRoleRepository = async () => {
  roleRepositoryOpen.value = !roleRepositoryOpen.value
}

/** Monitor the selected conversation */
const { activeId } = toRefs(props)
watch(activeId, async (newValue, oldValue) => {
  activeConversationId.value = newValue as string
})

// definition public method
defineExpose({ createConversation })

/** initialization */
onMounted(async () => {
  // get conversation List
  await getChatConversationList()
  // Selected by default
  if (props.activeId) {
    activeConversationId.value = props.activeId
  } else {
    // Select the first option by default for the first time
    if (conversationList.value.length) {
      activeConversationId.value = conversationList.value[0].id
      // Callback onConversationClick
      await emits('onConversationClick', conversationList.value[0])
    }
  }
})
</script>

<style scoped lang="scss">
.conversation-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 10px 0;
  overflow: hidden;

  .btn-new-conversation {
    padding: 18px 0;
  }

  .search-input {
    margin-top: 20px;
  }

  .conversation-list {
    overflow: auto;
    height: 100%;

    .classify-title {
      padding-top: 10px;
    }

    .conversation-item {
      margin-top: 5px;
    }

    .conversation {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex: 1;
      padding: 0 5px;
      cursor: pointer;
      border-radius: 5px;
      align-items: center;
      line-height: 30px;

      &.active {
        background-color: #e6e6e6;

        .button {
          display: inline-block;
        }
      }

      .title-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .title {
        padding: 2px 10px;
        max-width: 220px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.77);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .avatar {
        width: 25px;
        height: 25px;
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        justify-items: center;
      }

      // Conversation Editor、delete
      .button-wrapper {
        right: 2px;
        display: flex;
        flex-direction: row;
        justify-items: center;
        color: #606266;

        .btn {
          margin: 0;
        }
      }
    }
  }

  // Role repository、Clear unconfigured conversations
  .tool-box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    //width: 100%;
    padding: 0 20px;
    background-color: #f4f4f4;
    box-shadow: 0 0 1px 1px rgba(228, 228, 228, 0.8);
    line-height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--el-text-color);

    > div {
      display: flex;
      align-items: center;
      color: #606266;
      padding: 0;
      margin: 0;
      cursor: pointer;

      > span {
        margin-left: 5px;
      }
    }
  }
}
</style>
