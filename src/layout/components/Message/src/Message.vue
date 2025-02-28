<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'
import { useUserStoreWithOut } from '@/store/modules/user'

defineOptions({ name: 'Message' })

const { push } = useRouter()
const userStore = useUserStoreWithOut()
const activeName = ref('notice')
const unreadCount = ref(0) // Number of unread messages
const list = ref<any[]>([]) // Message List

// Get message list
const getList = async () => {
  list.value = await NotifyMessageApi.getUnreadNotifyMessageList()
  // Force the unreadCount to be set to 0 to prevent the red dot from remaining due to the slow polling.
  unreadCount.value = 0
}

// Obtain the number of unread messages
const getUnreadCount = async () => {
  NotifyMessageApi.getUnreadNotifyMessageCount().then((data) => {
    unreadCount.value = data
  })
}

// Jump to my internal message
const goMyList = () => {
  push({
    name: 'MyNotifyMessage'
  })
}

// ========== initialization =========
onMounted(() => {
  // First loading of Xiaohongdian
  getUnreadCount()
  // Polling refresh small red dots
  setInterval(
    () => {
      if (userStore.getIsSetUser) {
        getUnreadCount()
      } else {
        unreadCount.value = 0
      }
    },
    1000 * 60 * 2
  )
})
</script>
<template>
  <div class="message">
    <ElPopover :width="400" placement="bottom" trigger="click">
      <template #reference>
        <ElBadge :is-dot="unreadCount > 0" class="item">
          <Icon :size="18" class="cursor-pointer" icon="ep:bell" @click="getList" />
        </ElBadge>
      </template>
      <ElTabs v-model="activeName">
        <ElTabPane label="My Internal Message" name="notice">
          <el-scrollbar class="message-list">
            <template v-for="item in list" :key="item.id">
              <div class="message-item">
                <img alt="" class="message-icon" src="@/assets/imgs/avatar.gif" />
                <div class="message-content">
                  <span class="message-title">
                    {{ item.templateNickname }}：{{ item.templateContent }}
                  </span>
                  <span class="message-date">
                    {{ formatDate(item.createTime) }}
                  </span>
                </div>
              </div>
            </template>
          </el-scrollbar>
        </ElTabPane>
      </ElTabs>
      <!-- more -->
      <div style="margin-top: 10px; text-align: right">
        <XButton preIcon="ep:view" title="Preview All" type="primary" @click="goMyList" />
      </div>
    </ElPopover>
  </div>
</template>
<style lang="scss" scoped>
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}

.message-list {
  display: flex;
  height: 400px;
  flex-direction: column;

  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-child {
      border: none;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }

    .message-content {
      display: flex;
      flex-direction: column;

      .message-title {
        margin-bottom: 5px;
      }

      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
