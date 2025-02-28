<template>
  <div ref="messageContainer" class="h-100% overflow-y-auto relative">
    <div class="chat-list" v-for="(item, index) in list" :key="index">
      <!-- To the left message：system、assistant type -->
      <div class="left-message message-item" v-if="item.type !== 'user'">
        <div class="avatar">
          <el-avatar :src="roleAvatar" />
        </div>
        <div class="message">
          <div>
            <el-text class="time">{{ formatDate(item.createTime) }}</el-text>
          </div>
          <div class="left-text-container" ref="markdownViewRef">
            <MarkdownView class="left-text" :content="item.content" />
          </div>
          <div class="left-btns">
            <el-button class="btn-cus" link @click="copyContent(item.content)">
              <img class="btn-image" src="@/assets/ai/copy.svg" />
            </el-button>
            <el-button v-if="item.id > 0" class="btn-cus" link @click="onDelete(item.id)">
              <img class="btn-image h-17px" src="@/assets/ai/delete.svg" />
            </el-button>
          </div>
        </div>
      </div>
      <!-- To the right message：user type -->
      <div class="right-message message-item" v-if="item.type === 'user'">
        <div class="avatar">
          <el-avatar :src="userAvatar" />
        </div>
        <div class="message">
          <div>
            <el-text class="time">{{ formatDate(item.createTime) }}</el-text>
          </div>
          <div class="right-text-container">
            <div class="right-text">{{ item.content }}</div>
          </div>
          <div class="right-btns">
            <el-button class="btn-cus" link @click="copyContent(item.content)">
              <img class="btn-image" src="@/assets/ai/copy.svg" />
            </el-button>
            <el-button class="btn-cus" link @click="onDelete(item.id)">
              <img class="btn-image h-17px mr-12px" src="@/assets/ai/delete.svg" />
            </el-button>
            <el-button class="btn-cus" link @click="onRefresh(item)">
              <el-icon size="17"><RefreshRight /></el-icon>
            </el-button>
            <el-button class="btn-cus" link @click="onEdit(item)">
              <el-icon size="17"><Edit /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Return to the bottom -->
  <div v-if="isScrolling" class="to-bottom" @click="handleGoBottom">
    <el-button :icon="ArrowDownBold" circle />
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { formatDate } from '@/utils/formatTime'
import MarkdownView from '@/components/MarkdownView/index.vue'
import { useClipboard } from '@vueuse/core'
import { ArrowDownBold, Edit, RefreshRight } from '@element-plus/icons-vue'
import { ChatMessageApi, ChatMessageVO } from '@/api/ai/chat/message'
import { ChatConversationVO } from '@/api/ai/chat/conversation'
import { useUserStore } from '@/store/modules/user'
import userAvatarDefaultImg from '@/assets/imgs/avatar.gif'
import roleAvatarDefaultImg from '@/assets/ai/gpt.svg'

const message = useMessage() // Message pop-up window
const { copy } = useClipboard() // initialization copy to the adhesive board
const userStore = useUserStore()

// Determine the scrolling position of the "message list" (used to decide whether it's necessary to scroll to the bottom of the messages).
const messageContainer: any = ref(null)
const isScrolling = ref(false) //Used to determine whether the user is scrolling

const userAvatar = computed(() => userStore.user.avatar || userAvatarDefaultImg)
const roleAvatar = computed(() => props.conversation.roleAvatar ?? roleAvatarDefaultImg)

// definition props
const props = defineProps({
  conversation: {
    type: Object as PropType<ChatConversationVO>,
    required: true
  },
  list: {
    type: Array as PropType<ChatMessageVO[]>,
    required: true
  }
})

const { list } = toRefs(props) // Message List

const emits = defineEmits(['onDeleteSuccess', 'onRefresh', 'onEdit']) // definition emits

// ============ Handling conversation scrolling ==============

/** Scroll to the bottom */
const scrollToBottom = async (isIgnore?: boolean) => {
  // Note that you should use `nextTick` to avoid failing to get the DOM.
  await nextTick()
  if (isIgnore || !isScrolling.value) {
    messageContainer.value.scrollTop =
      messageContainer.value.scrollHeight - messageContainer.value.offsetHeight
  }
}

function handleScroll() {
  const scrollContainer = messageContainer.value
  const scrollTop = scrollContainer.scrollTop
  const scrollHeight = scrollContainer.scrollHeight
  const offsetHeight = scrollContainer.offsetHeight
  if (scrollTop + offsetHeight < scrollHeight - 100) {
    // The user starts scrolling and is at the bottom，Cancel the effect of keeping it at the bottom
    isScrolling.value = true
  } else {
    // The user stops scrolling and scrolls to the bottom，Enable the effect of keeping to the bottom
    isScrolling.value = false
  }
}

/** Return to the bottom */
const handleGoBottom = async () => {
  const scrollContainer = messageContainer.value
  scrollContainer.scrollTop = scrollContainer.scrollHeight
}

/** Return to the top */
const handlerGoTop = async () => {
  const scrollContainer = messageContainer.value
  scrollContainer.scrollTop = 0
}

defineExpose({ scrollToBottom, handlerGoTop }) // Provide methods for the parent to call.

// ============ Processing message operations ==============

/** copy */
const copyContent = async (content) => {
  await copy(content)
  message.success('Copy successful!')
}

/** delete */
const onDelete = async (id) => {
  // delete message
  await ChatMessageApi.deleteChatMessage(id)
  message.success('Delete successfully!')
  // Callback
  emits('onDeleteSuccess')
}

/** Refresh */
const onRefresh = async (message: ChatMessageVO) => {
  emits('onRefresh', message)
}

/** edit */
const onEdit = async (message: ChatMessageVO) => {
  emits('onEdit', message)
}

/** initialization */
onMounted(async () => {
  messageContainer.value.addEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.message-container {
  position: relative;
  overflow-y: scroll;
}

// middle
.chat-list {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding: 0 20px;
  .message-item {
    margin-top: 50px;
  }

  .left-message {
    display: flex;
    flex-direction: row;
  }

  .right-message {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
  }

  .message {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin: 0 15px;

    .time {
      text-align: left;
      line-height: 30px;
    }

    .left-text-container {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow-wrap: break-word;
      background-color: rgba(228, 228, 228, 0.8);
      box-shadow: 0 0 0 1px rgba(228, 228, 228, 0.8);
      border-radius: 10px;
      padding: 10px 10px 5px 10px;

      .left-text {
        color: #393939;
        font-size: 0.95rem;
      }
    }

    .right-text-container {
      display: flex;
      flex-direction: row-reverse;

      .right-text {
        font-size: 0.95rem;
        color: #fff;
        display: inline;
        background-color: #267fff;
        box-shadow: 0 0 0 1px #267fff;
        border-radius: 10px;
        padding: 10px;
        width: auto;
        overflow-wrap: break-word;
        white-space: pre-wrap;
      }
    }

    .left-btns {
      display: flex;
      flex-direction: row;
      margin-top: 8px;
    }

    .right-btns {
      display: flex;
      flex-direction: row-reverse;
      margin-top: 8px;
    }
  }

  // copy、delete button
  .btn-cus {
    display: flex;
    background-color: transparent;
    align-items: center;

    .btn-image {
      height: 20px;
    }
  }

  .btn-cus:hover {
    cursor: pointer;
    background-color: #f6f6f6;
  }
}

// Return to the bottom
.to-bottom {
  position: absolute;
  z-index: 1000;
  bottom: 0;
  right: 50%;
}
</style>
