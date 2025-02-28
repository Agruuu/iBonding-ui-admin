<template>
  <div class="flex">
    <!-- left：Establish a connection、send message -->
    <el-card :gutter="12" class="w-1/2" shadow="always">
      <template #header>
        <div class="card-header">
          <span>Connect</span>
        </div>
      </template>
      <div class="flex items-center">
        <span class="mr-4 text-lg font-medium"> Connection Status: </span>
        <el-tag :color="getTagColor">{{ status }}</el-tag>
      </div>
      <hr class="my-4" />
      <div class="flex">
        <el-input v-model="server" disabled>
          <template #prepend>Service Address</template>
        </el-input>
        <el-button :type="getIsOpen ? 'danger' : 'primary'" @click="toggleConnectStatus">
          {{ getIsOpen ? 'Close Connection' : 'Open Connection' }}
        </el-button>
      </div>
      <p class="mt-4 text-lg font-medium">Message Input Box</p>
      <hr class="my-4" />
      <el-input
        v-model="sendText"
        :autosize="{ minRows: 2, maxRows: 4 }"
        :disabled="!getIsOpen"
        clearable
        placeholder="Please enter the message you want to send"
        type="textarea"
      />
      <el-select v-model="sendUserId" class="mt-4" placeholder="Please select sender">
        <el-option key="" label="All" value="" />
        <el-option
          v-for="user in userList"
          :key="user.id"
          :label="user.nickname"
          :value="user.id"
        />
      </el-select>
      <el-button :disabled="!getIsOpen" block class="ml-2 mt-4" type="primary" @click="handlerSend">
        Send out
      </el-button>
    </el-card>
    <!-- right：Message record -->
    <el-card :gutter="12" class="w-1/2" shadow="always">
      <template #header>
        <div class="card-header">
          <span>Message Record</span>
        </div>
      </template>
      <div class="max-h-80 overflow-auto">
        <ul>
          <li v-for="msg in messageReverseList" :key="msg.time" class="mt-2">
            <div class="flex items-center">
              <span class="text-primary mr-2 font-medium">Received Message:</span>
              <span>{{ formatDate(msg.time) }}</span>
            </div>
            <div>
              {{ msg.text }}
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { useWebSocket } from '@vueuse/core'
import { getRefreshToken } from '@/utils/auth'
import * as UserApi from '@/api/system/user'

defineOptions({ name: 'InfraWebSocket' })

const message = useMessage() // Message pop-up window

const server = ref(
  (import.meta.env.VITE_BASE_URL + '/infra/ws').replace('http', 'ws') +
    '?token=' +
    getRefreshToken() // The reason for using the `getRefreshToken()` method instead of the `getAccessToken()` method is that WebSocket cannot conveniently refresh the access token
) // WebSocket Service Address
const getIsOpen = computed(() => status.value === 'OPEN') // Is the WebSocket connection open?
const getTagColor = computed(() => (getIsOpen.value ? 'success' : 'red')) // WebSocket display color of connection

/** launch WebSocket connect */
const { status, data, send, close, open } = useWebSocket(server.value, {
  autoReconnect: true,
  heartbeat: true
})

/** Monitor the received data */
const messageList = ref([] as { time: number; text: string }[]) // Message List
const messageReverseList = computed(() => messageList.value.slice().reverse())
watchEffect(() => {
  if (!data.value) {
    return
  }
  try {
    // 1. Received heartbeat
    if (data.value === 'pong') {
      // state.recordList.push({
      //   text: '【Heartbeat】',
      //   time: new Date().getTime()
      // })
      return
    }

    // 2.1 analysis type message type
    const jsonMessage = JSON.parse(data.value)
    const type = jsonMessage.type
    const content = JSON.parse(jsonMessage.content)
    if (!type) {
      message.error('Unknown message type: ' + data.value)
      return
    }
    // 2.2 Message type：demo-message-receive
    if (type === 'demo-message-receive') {
      const single = content.single
      if (single) {
        messageList.value.push({
          text: `【Single Send】User ID (${content.fromUserId})：${content.text}`,
          time: new Date().getTime()
        })
      } else {
        messageList.value.push({
          text: `【Group send】User ID (${content.fromUserId})：${content.text}`,
          time: new Date().getTime()
        })
      }
      return
    }
    // 2.3 Message type：notice-push
    if (type === 'notice-push') {
      messageList.value.push({
        text: `【System Notification】：${content.title}`,
        time: new Date().getTime()
      })
      return
    }
    message.error('Unprocessed message: ' + data.value)
  } catch (error) {
    message.error('Exception occurred while processing message: ' + data.value)
    console.error(error)
  }
})

/** send message */
const sendText = ref('') // send content
const sendUserId = ref('') // Sender
const handlerSend = () => {
  // 1.1 First, convert the message content into JSON format
  const messageContent = JSON.stringify({
    text: sendText.value,
    toUserId: sendUserId.value
  })
  // 1.2 Then, convert the entire message into JSON format
  const jsonMessage = JSON.stringify({
    type: 'demo-message-send',
    content: messageContent
  })
  // 2. Finally send a message
  send(jsonMessage)
  sendText.value = ''
}

/** switch websocket Connection status */
const toggleConnectStatus = () => {
  if (getIsOpen.value) {
    close()
  } else {
    open()
  }
}

/** initialization **/
const userList = ref<any[]>([]) // User List
onMounted(async () => {
  // Get user list
  userList.value = await UserApi.getSimpleUserList()
})
</script>
