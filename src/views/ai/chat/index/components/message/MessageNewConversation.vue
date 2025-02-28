<!-- When there is no chat conversation, you can start a new conversation in the message area. -->
<template>
  <div class="new-chat">
    <div class="box-center">
      <div class="tip">Click the button below，Let's start your conversation</div>
      <div class="btns">
        <el-button type="primary" round @click="handlerNewChat">Create a new conversation</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emits = defineEmits(['onNewConversation'])

/** Create a new chat conversation. */
const handlerNewChat = () => {
  emits('onNewConversation')
}
</script>
<style scoped lang="scss">
.new-chat {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;

  .box-center {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .tip {
      font-size: 14px;
      color: #858585;
    }

    .btns {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
</style>
