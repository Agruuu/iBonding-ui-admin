<template>
  <div class="card-list" ref="tabsRef" @scroll="handleTabsScroll">
    <div class="card-item" v-for="role in roleList" :key="role.id">
      <el-card class="card" body-class="card-body">
        <!-- More operations -->
        <div class="more-container" v-if="showMore">
          <el-dropdown @command="handleMoreClick">
            <span class="el-dropdown-link">
              <el-button type="text">
                <el-icon><More /></el-icon>
              </el-button>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="['edit', role]">
                  <Icon icon="ep:edit" color="#787878" />edit
                </el-dropdown-item>
                <el-dropdown-item :command="['delete', role]" style="color: red">
                  <Icon icon="ep:delete" color="red" />delete
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- Role information -->
        <div>
          <img class="avatar" :src="role.avatar" />
        </div>
        <div class="right-container">
          <div class="content-container">
            <div class="title">{{ role.name }}</div>
            <div class="description">{{ role.description }}</div>
          </div>
          <div class="btn-container">
            <el-button type="primary" size="small" @click="handleUseClick(role)">use</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ChatRoleVO} from '@/api/ai/model/chatRole'
import {PropType, ref} from 'vue'
import {More} from '@element-plus/icons-vue'

const tabsRef = ref<any>() // tabs ref

// Define attributes
const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  roleList: {
    type: Array as PropType<ChatRoleVO[]>,
    required: true
  },
  showMore: {
    type: Boolean,
    required: false,
    default: false
  }
})

// Define hooks
const emits = defineEmits(['onDelete', 'onEdit', 'onUse', 'onPage'])

/** operation：edit、delete */
const handleMoreClick = async (data) => {
  const type = data[0]
  const role = data[1]
  if (type === 'delete') {
    emits('onDelete', role)
  } else {
    emits('onEdit', role)
  }
}

/** Select */
const handleUseClick = (role) => {
  emits('onUse', role)
}

/** roll */
const handleTabsScroll = async () => {
  if (tabsRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = tabsRef.value
    if (scrollTop + clientHeight >= scrollHeight - 20 && !props.loading) {
      await emits('onPage')
    }
  }
}
</script>

<style lang="scss">
// Override the body style of the card component
.card-body {
  max-width: 240px;
  width: 240px;
  padding: 15px 15px 10px 15px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
}
</style>
<style scoped lang="scss">
// Card list
.card-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  height: 100%;
  overflow: auto;
  padding: 0px 25px;
  padding-bottom: 140px;
  align-items: start;
  align-content: flex-start;
  justify-content: start;

  .card {
    display: inline-block;
    margin-right: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    position: relative;

    .more-container {
      position: absolute;
      top: 0;
      right: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      overflow: hidden;
    }

    .right-container {
      margin-left: 10px;
      width: 100%;
      //height: 100px;

      .content-container {
        height: 85px;

        .title {
          font-size: 18px;
          font-weight: bold;
          color: #3e3e3e;
        }

        .description {
          margin-top: 10px;
          font-size: 14px;
          color: #6a6a6a;
        }
      }

      .btn-container {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 2px;
      }
    }
  }
}
</style>
