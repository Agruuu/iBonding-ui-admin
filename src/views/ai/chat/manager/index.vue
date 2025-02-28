<template>
  <ContentWrap>
    <el-tabs>
      <el-tab-pane label="Conversation List">
        <ChatConversationList />
      </el-tab-pane>
      <el-tab-pane label="Message List">
        <ChatMessageList />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script setup lang="ts">
import ChatConversationList from './ChatConversationList.vue'
import ChatMessageList from './ChatMessageList.vue'

/** AI Chat conversation list */
defineOptions({ name: 'AiChatManager' })
</script>
