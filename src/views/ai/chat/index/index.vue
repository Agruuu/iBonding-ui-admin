<template>
  <el-container class="ai-layout">
    <!-- left：Conversation List -->
    <ConversationList
      :active-id="activeConversationId"
      ref="conversationListRef"
      @on-conversation-create="handleConversationCreateSuccess"
      @on-conversation-click="handleConversationClick"
      @on-conversation-clear="handleConversationClear"
      @on-conversation-delete="handlerConversationDelete"
    />
    <!-- right：Conversation details -->
    <el-container class="detail-container">
      <el-header class="header">
        <div class="title">
          {{ activeConversation?.title ? activeConversation?.title : 'conversation' }}
          <span v-if="activeMessageList.length">({{ activeMessageList.length }})</span>
        </div>
        <div class="btns" v-if="activeConversation">
          <el-button type="primary" bg plain size="small" @click="openChatConversationUpdateForm">
            <span v-html="activeConversation?.modelName"></span>
            <Icon icon="ep:setting" class="ml-10px" />
          </el-button>
          <el-button size="small" class="btn" @click="handlerMessageClear">
            <Icon icon="heroicons-outline:archive-box-x-mark" color="#787878" />
          </el-button>
          <el-button size="small" class="btn">
            <Icon icon="ep:download" color="#787878" />
          </el-button>
          <el-button size="small" class="btn" @click="handleGoTopMessage">
            <Icon icon="ep:top" color="#787878" />
          </el-button>
        </div>
      </el-header>

      <!-- main：Message List -->
      <el-main class="main-container">
        <div>
          <div class="message-container">
            <!-- Situation 1：Message loading in progress -->
            <MessageLoading v-if="activeMessageListLoading" />
            <!-- Scenario 2：When there is no chat conversation -->
            <MessageNewConversation
              v-if="!activeConversation"
              @on-new-conversation="handleConversationCreate"
            />
            <!-- Scenario Three：The message list is empty -->
            <MessageListEmpty
              v-if="!activeMessageListLoading && messageList.length === 0 && activeConversation"
              @on-prompt="doSendMessage"
            />
            <!-- Scenario Four：The message list is not empty -->
            <MessageList
              v-if="!activeMessageListLoading && messageList.length > 0"
              ref="messageRef"
              :conversation="activeConversation"
              :list="messageList"
              @on-delete-success="handleMessageDelete"
              @on-edit="handleMessageEdit"
              @on-refresh="handleMessageRefresh"
            />
          </div>
        </div>
      </el-main>

      <!-- bottom -->
      <el-footer class="footer-container">
        <form class="prompt-from">
          <textarea
            class="prompt-input"
            v-model="prompt"
            @keydown="handleSendByKeydown"
            @input="handlePromptInput"
            @compositionstart="onCompositionstart"
            @compositionend="onCompositionend"
            placeholder="Ask me any questions...（Shift+Enter line break，Press down Enter send out）"
          ></textarea>
          <div class="prompt-btns">
            <div>
              <el-switch v-model="enableContext" />
              <span class="ml-5px text-14px text-#8f8f8f">context</span>
            </div>
            <el-button
              type="primary"
              size="default"
              @click="handleSendByButton"
              :loading="conversationInProgress"
              v-if="conversationInProgress == false"
            >
              {{ conversationInProgress ? 'In progress' : 'Send out' }}
            </el-button>
            <el-button
              type="danger"
              size="default"
              @click="stopStream()"
              v-if="conversationInProgress == true"
            >
              stop it
            </el-button>
          </div>
        </form>
      </el-footer>
    </el-container>

    <!-- Update dialogue Form -->
    <ConversationUpdateForm
      ref="conversationUpdateFormRef"
      @success="handleConversationUpdateSuccess"
    />
  </el-container>
</template>

<script setup lang="ts">
import { ChatMessageApi, ChatMessageVO } from '@/api/ai/chat/message'
import { ChatConversationApi, ChatConversationVO } from '@/api/ai/chat/conversation'
import ConversationList from './components/conversation/ConversationList.vue'
import ConversationUpdateForm from './components/conversation/ConversationUpdateForm.vue'
import MessageList from './components/message/MessageList.vue'
import MessageListEmpty from './components/message/MessageListEmpty.vue'
import MessageLoading from './components/message/MessageLoading.vue'
import MessageNewConversation from './components/message/MessageNewConversation.vue'

/** AI Chat conversation list */
defineOptions({ name: 'AiChat' })

const route = useRoute() // route
const message = useMessage() // Message pop-up window

// Chat conversation
const conversationListRef = ref()
const activeConversationId = ref<number | null>(null) // Selected dialogue number
const activeConversation = ref<ChatConversationVO | null>(null) // Selected Conversation
const conversationInProgress = ref(false) // Is the conversation in progress。Currently, only【send out】When receiving a message，It will be updated to true，Avoid switching conversations、Delete dialogue and other operations

// Message List
const messageRef = ref()
const activeMessageList = ref<ChatMessageVO[]>([]) // Select the message list for the conversation
const activeMessageListLoading = ref<boolean>(false) // activeMessageList Is it loading
const activeMessageListLoadingTimer = ref<any>() // activeMessageListLoading Timer timer。If the loading speed is fast，Do not enter the loading process
// Message scrolling
const textSpeed = ref<number>(50) // Typing speed in milliseconds
const textRoleRunning = ref<boolean>(false) // Typing speed in milliseconds

// Send message input box
const isComposing = ref(false) // Determine whether the user is inputting
const conversationInAbortController = ref<any>() // During the conversation, use an abort controller (to control the stream conversation).
const inputTimeout = ref<any>() // Timer for processing carriage returns in input
const prompt = ref<string>() // prompt
const enableContext = ref<boolean>(true) // Do you want to enable context
// receive Stream message
const receiveMessageFullText = ref('')
const receiveMessageDisplayedText = ref('')

// =========== Related to [chat conversations]. ===========

/** Get conversation information */
const getConversation = async (id: number | null) => {
  if (!id) {
    return
  }
  const conversation: ChatConversationVO = await ChatConversationApi.getChatConversationMy(id)
  if (!conversation) {
    return
  }
  activeConversation.value = conversation
  activeConversationId.value = conversation.id
}

/**
 * Click on a conversation
 *
 * @param conversation Selected conversation
 * @return Is the switch successful
 */
const handleConversationClick = async (conversation: ChatConversationVO) => {
  // Dialogue in progress，No switching allowed
  if (conversationInProgress.value) {
    message.alert('Switching is not allowed during the conversation!')
    return false
  }

  // Update the selected conversation id
  activeConversationId.value = conversation.id
  activeConversation.value = conversation
  // Refresh message list
  await getMessageList()
  // Scroll to the bottom
  scrollToBottom(true)
  // Clear input box
  prompt.value = ''
  return true
}

/** Delete a conversation*/
const handlerConversationDelete = async (delConversation: ChatConversationVO) => {
  // If the deleted conversation is currently selected，So reset it
  if (activeConversationId.value === delConversation.id) {
    await handleConversationClear()
  }
}
/** Clear the selected conversation */
const handleConversationClear = async () => {
  // Dialogue in progress，No switching allowed
  if (conversationInProgress.value) {
    message.alert('Switching is not allowed during the conversation!')
    return false
  }
  activeConversationId.value = null
  activeConversation.value = null
  activeMessageList.value = []
}

/** Modify chat conversation */
const conversationUpdateFormRef = ref()
const openChatConversationUpdateForm = async () => {
  conversationUpdateFormRef.value.open(activeConversationId.value)
}
const handleConversationUpdateSuccess = async () => {
  // Conversation update successful，Refresh the latest information
  await getConversation(activeConversationId.value)
}

/** Successfully created chat conversation processing */
const handleConversationCreate = async () => {
  // Create a conversation
  await conversationListRef.value.createConversation()
}
/** Successfully created chat conversation processing */
const handleConversationCreateSuccess = async () => {
  // Create a new conversation，Clear input box
  prompt.value = ''
}

// =========== 【Message List】relevant ===========

/** Get messages message list */
const getMessageList = async () => {
  try {
    if (activeConversationId.value === null) {
      return
    }
    // Timer timer，If the loading speed is fast，Do not enter the loading process
    activeMessageListLoadingTimer.value = setTimeout(() => {
      activeMessageListLoading.value = true
    }, 60)

    // Get message list
    activeMessageList.value = await ChatMessageApi.getChatMessageListByConversationId(
      activeConversationId.value
    )

    // Scroll to the bottom
    await nextTick()
    await scrollToBottom()
  } finally {
    // time timer，If the loading speed is fast，Do not enter the loading process
    if (activeMessageListLoadingTimer.value) {
      clearTimeout(activeMessageListLoadingTimer.value)
    }
    // Loading completed
    activeMessageListLoading.value = false
  }
}

/**
 * Message List
 *
 * The difference from {@link #getMessageList()} is that the systemMessage is taken into account.
 */
const messageList = computed(() => {
  if (activeMessageList.value.length > 0) {
    return activeMessageList.value
  }
  // When there are no messages, if there is a systemMessage, display it.
  if (activeConversation.value?.systemMessage) {
    return [
      {
        id: 0,
        type: 'system',
        content: activeConversation.value.systemMessage
      }
    ]
  }
  return []
})

/** Processing deletion message news */
const handleMessageDelete = () => {
  if (conversationInProgress.value) {
    message.alert('In the response, deletion is not allowed!')
    return
  }
  // Refresh message list
  getMessageList()
}

/** handle message empty */
const handlerMessageClear = async () => {
  if (!activeConversationId.value) {
    return
  }
  try {
    // Confirmation prompt
    await message.delConfirm('Are you sure you want to clear the chat messages?')
    // Clear the conversation
    await ChatMessageApi.deleteByConversationId(activeConversationId.value)
    // Refresh message list
    activeMessageList.value = []
  } catch {}
}

/** go back to message At the top of the list */
const handleGoTopMessage = () => {
  messageRef.value.handlerGoTop()
}

// =========== Related to [Send Message] ===========

/** Handle the message sent from the keydown event. */
const handleSendByKeydown = async (event) => {
  // Determine whether the user is inputting
  if (isComposing.value) {
    return
  }
  // Sending is not allowed in progress
  if (conversationInProgress.value) {
    return
  }
  const content = prompt.value?.trim() as string
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      // Insert line break
      prompt.value += '\r\n'
      event.preventDefault() // Prevent default line breaking behavior
    } else {
      // send message
      await doSendMessage(content)
      event.preventDefault() // Prevent default submission behavior
    }
  }
}

/** Processing from【send out】Send message for button */
const handleSendByButton = () => {
  doSendMessage(prompt.value?.trim() as string)
}

/** Handle the input change of the prompt */
const handlePromptInput = (event) => {
  // Non input method Set the input as true
  if (!isComposing.value) {
    // enter event data is null
    if (event.data == null) {
      return
    }
    isComposing.value = true
  }
  // Clean the timer
  if (inputTimeout.value) {
    clearTimeout(inputTimeout.value)
  }
  // Reset Timer 
  inputTimeout.value = setTimeout(() => {
    isComposing.value = false
  }, 400)
}
// TODO @Agruuu：Can it be achieved through `@keydown.enter` and `@keydown.shift.enter` to send a message on Enter and insert a line break on Shift + Enter? The main thing is to see if the logic related to `isComposing` can be simplified.
const onCompositionstart = () => {
  isComposing.value = true
}
const onCompositionend = () => {
  // console.log('Input ended...')
  setTimeout(() => {
    isComposing.value = false
  }, 200)
}

/** Truly execute【send out】Message operation */
const doSendMessage = async (content: string) => {
  // check
  if (content.length < 1) {
    message.error('Sending failed. Reason: The content is empty!')
    return
  }
  if (activeConversationId.value == null) {
    message.error('You cant send messages because the conversation hasnt been created yet!')
    return
  }
  // Clear input box
  prompt.value = ''
  // Execute sending
  await doSendMessageStream({
    conversationId: activeConversationId.value,
    content: content
  } as ChatMessageVO)
}

/** Truly execute【send out】Message operation */
const doSendMessageStream = async (userMessage: ChatMessageVO) => {
  // Create an instance of `AbortController` to abort the request.
  conversationInAbortController.value = new AbortController()
  // Tag conversation in progress
  conversationInProgress.value = true
  // Set as empty
  receiveMessageFullText.value = ''

  try {
    // 1.1 First, add two dummy data items, and then replace them when the stream returns.
    activeMessageList.value.push({
      id: -1,
      conversationId: activeConversationId.value,
      type: 'user',
      content: userMessage.content,
      createTime: new Date()
    } as ChatMessageVO)
    activeMessageList.value.push({
      id: -2,
      conversationId: activeConversationId.value,
      type: 'assistant',
      content: 'Thinking...',
      createTime: new Date()
    } as ChatMessageVO)
    // 1.2 Scroll to the bottom
    await nextTick()
    await scrollToBottom() // bottom
    // 1.3 Start scrolling
    textRoll()

    // 2. send out event stream
    let isFirstChunk = true // Is it the first chunk of the message
    await ChatMessageApi.sendChatMessageStream(
      userMessage.conversationId,
      userMessage.content,
      conversationInAbortController.value,
      enableContext.value,
      async (res) => {
        const { code, data, msg } = JSON.parse(res.data)
        if (code !== 0) {
          message.alert(`Conversation exception! ${msg}`)
          return
        }

        // If the content is empty，Just don't handle it。
        if (data.receive.content === '') {
          return
        }
        // For the first return, a message needs to be added to the page. For subsequent returns, it's all about updates.
        if (isFirstChunk) {
          isFirstChunk = false
          // Pop up two fake data
          activeMessageList.value.pop()
          activeMessageList.value.pop()
          // Update the returned data
          activeMessageList.value.push(data.send)
          activeMessageList.value.push(data.receive)
        }
        // debugger
        receiveMessageFullText.value = receiveMessageFullText.value + data.receive.content
        // Scroll to the bottom
        await scrollToBottom()
      },
      (error) => {
        message.alert(`Conversation exception! ${error}`)
        stopStream()
      },
      () => {
        stopStream()
      }
    )
  } catch {}
}

/** stop it stream Stream call */
const stopStream = async () => {
  // tip：If there is a message in the middle of a stream operation, the controller needs to be called to end it.
  if (conversationInAbortController.value) {
    conversationInAbortController.value.abort()
  }
  // Set as false
  conversationInProgress.value = false
}

/** edit message：Set as prompt，Can be edited again */
const handleMessageEdit = (message: ChatMessageVO) => {
  prompt.value = message.content
}

/** Refresh message：Based on specified message，Initiate the conversation again */
const handleMessageRefresh = (message: ChatMessageVO) => {
  doSendMessage(message.content)
}

// ============== 【Message scrolling】relevant =============

/** Scroll to the bottom of the message */
const scrollToBottom = async (isIgnore?: boolean) => {
  await nextTick()
  if (messageRef.value) {
    messageRef.value.scrollToBottom(isIgnore)
  }
}

/** Self pickup scrolling effect */
const textRoll = async () => {
  let index = 0
  try {
    // Can only be executed once
    if (textRoleRunning.value) {
      return
    }
    // Set status
    textRoleRunning.value = true
    receiveMessageDisplayedText.value = ''
    const task = async () => {
      // Adjust speed
      const diff =
        (receiveMessageFullText.value.length - receiveMessageDisplayedText.value.length) / 10
      if (diff > 5) {
        textSpeed.value = 10
      } else if (diff > 2) {
        textSpeed.value = 30
      } else if (diff > 1.5) {
        textSpeed.value = 50
      } else {
        textSpeed.value = 100
      }
      // The conversation is over. Just follow the speed of 30.
      if (!conversationInProgress.value) {
        textSpeed.value = 10
      }

      if (index < receiveMessageFullText.value.length) {
        receiveMessageDisplayedText.value += receiveMessageFullText.value[index]
        index++

        // to update message
        const lastMessage = activeMessageList.value[activeMessageList.value.length - 1]
        lastMessage.content = receiveMessageDisplayedText.value
        // Scroll down to stay below
        await scrollToBottom()
        // Reset Task
        timer = setTimeout(task, textSpeed.value)
      } else {
        // It can't end in a conversation
        if (!conversationInProgress.value) {
          textRoleRunning.value = false
          clearTimeout(timer)
        } else {
          // Reset Task
          timer = setTimeout(task, textSpeed.value)
        }
      }
    }
    let timer = setTimeout(task, textSpeed.value)
  } catch {}
}

/** initialization **/
onMounted(async () => {
  // If there is a `conversationId` parameter, select it by default.
  if (route.query.conversationId) {
    const id = route.query.conversationId as unknown as number
    activeConversationId.value = id
    await getConversation(id)
  }

  // Retrieve list data
  activeMessageListLoading.value = true
  await getMessageList()
})
</script>

<style lang="scss" scoped>
.ai-layout {
  position: absolute;
  flex: 1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.conversation-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 10px 0;

  .btn-new-conversation {
    padding: 18px 0;
  }

  .search-input {
    margin-top: 20px;
  }

  .conversation-list {
    margin-top: 20px;

    .conversation {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex: 1;
      padding: 0 5px;
      margin-top: 10px;
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
        padding: 5px 10px;
        max-width: 220px;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .avatar {
        width: 28px;
        height: 28px;
        display: flex;
        flex-direction: row;
        justify-items: center;
      }

      // Conversation editor、delete
      .button-wrapper {
        right: 2px;
        display: flex;
        flex-direction: row;
        justify-items: center;
        color: #606266;

        .el-icon {
          margin-right: 5px;
        }
      }
    }
  }

  // Role repository、Clear unconfigured conversations
  .tool-box {
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

// head
.detail-container {
  background: #ffffff;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: #fbfbfb;
    box-shadow: 0 0 0 0 #dcdfe6;

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .btns {
      display: flex;
      width: 300px;
      flex-direction: row;
      justify-content: flex-end;
      //justify-content: space-between;

      .btn {
        padding: 10px;
      }
    }
  }
}

// main container
.main-container {
  margin: 0;
  padding: 0;
  position: relative;
  height: 100%;
  width: 100%;

  .message-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: hidden;
    padding: 0;
    margin: 0;
  }
}

// bottom
.footer-container {
  display: flex;
  flex-direction: column;
  height: auto;
  margin: 0;
  padding: 0;

  .prompt-from {
    display: flex;
    flex-direction: column;
    height: auto;
    border: 1px solid #e3e3e3;
    border-radius: 10px;
    margin: 10px 20px 20px 20px;
    padding: 9px 10px;
  }

  .prompt-input {
    height: 80px;
    //box-shadow: none;
    border: none;
    box-sizing: border-box;
    resize: none;
    padding: 0 2px;
    overflow: auto;
  }

  .prompt-input:focus {
    outline: none;
  }

  .prompt-btns {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0;
    padding-top: 5px;
  }
}
</style>
