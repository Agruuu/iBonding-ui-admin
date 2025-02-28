<!-- chat Role repository -->
<template>
  <el-container class="role-container">
    <ChatRoleForm ref="formRef" @success="handlerAddRoleSuccess" />
    <!-- header  -->
    <RoleHeader title="Role repository" class="relative" />
    <!--  main  -->
    <el-main class="role-main">
      <div class="search-container">
        <!-- Search button -->
        <el-input
          :loading="loading"
          v-model="search"
          class="search-input"
          size="default"
          placeholder="Please enter the search content"
          :suffix-icon="Search"
          @change="getActiveTabsRole"
        />
        <el-button
          v-if="activeTab == 'my-role'"
          type="primary"
          @click="handlerAddRole"
          class="ml-20px"
        >
          <Icon icon="ep:user" style="margin-right: 5px;" />
          Add role
        </el-button>
      </div>
      <!-- tabs -->
      <el-tabs v-model="activeTab" class="tabs" @tab-click="handleTabsClick">
        <el-tab-pane class="role-pane" label="My role" name="my-role">
          <RoleList
            :loading="loading"
            :role-list="myRoleList"
            :show-more="true"
            @on-delete="handlerCardDelete"
            @on-edit="handlerCardEdit"
            @on-use="handlerCardUse"
            @on-page="handlerCardPage('my')"
            class="mt-20px"
          />
        </el-tab-pane>
        <el-tab-pane label="Public role" name="public-role">
          <RoleCategoryList
            class="role-category-list"
            :category-list="categoryList"
            :active="activeCategory"
            @on-category-click="handlerCategoryClick"
          />
          <RoleList
            :role-list="publicRoleList"
            @on-delete="handlerCardDelete"
            @on-edit="handlerCardEdit"
            @on-use="handlerCardUse"
            @on-page="handlerCardPage('public')"
            class="mt-20px"
            loading
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import RoleHeader from './RoleHeader.vue'
import RoleList from './RoleList.vue'
import ChatRoleForm from '@/views/ai/model/chatRole/ChatRoleForm.vue'
import RoleCategoryList from './RoleCategoryList.vue'
import {ChatRoleApi, ChatRolePageReqVO, ChatRoleVO} from '@/api/ai/model/chatRole'
import {ChatConversationApi, ChatConversationVO} from '@/api/ai/chat/conversation'
import {Search} from '@element-plus/icons-vue'
import {TabsPaneContext} from 'element-plus'

const router = useRouter() // Routing object

// Attribute definition
const loading = ref<boolean>(false) // Loading in progress
const activeTab = ref<string>('my-role') // Selected role Tab
const search = ref<string>('') // Loading in progress
const myRoleParams = reactive({
  pageNo: 1,
  pageSize: 50
})
const myRoleList = ref<ChatRoleVO[]>([]) // my Page size
const publicRoleParams = reactive({
  pageNo: 1,
  pageSize: 50
})
const publicRoleList = ref<ChatRoleVO[]>([]) // public Page size
const activeCategory = ref<string>('All') // Select the category in the selection
const categoryList = ref<string[]>([]) // Role classification category

/** tabs click */
const handleTabsClick = async (tab: TabsPaneContext) => {
  // Set switching status
  activeTab.value = tab.paneName + ''
  // Reload data when switching
  await getActiveTabsRole()
}

/** get my role */
const getMyRole = async (append?: boolean) => {
  const params: ChatRolePageReqVO = {
    ...myRoleParams,
    name: search.value,
    publicStatus: false
  }
  const { list } = await ChatRoleApi.getMyPage(params)
  if (append) {
    myRoleList.value.push.apply(myRoleList.value, list)
  } else {
    myRoleList.value = list
  }
}

/** get public role */
const getPublicRole = async (append?: boolean) => {
  const params: ChatRolePageReqVO = {
    ...publicRoleParams,
    category: activeCategory.value === 'All' ? '' : activeCategory.value,
    name: search.value,
    publicStatus: true
  }
  const { total, list } = await ChatRoleApi.getMyPage(params)
  if (append) {
    publicRoleList.value.push.apply(publicRoleList.value, list)
  } else {
    publicRoleList.value = list
  }
}

/** Get selected tabs role */
const getActiveTabsRole = async () => {
  if (activeTab.value === 'my-role') {
    myRoleParams.pageNo = 1
    await getMyRole()
  } else {
    publicRoleParams.pageNo = 1
    await getPublicRole()
  }
}

/** Get the list of character categories */
const getRoleCategoryList = async () => {
  categoryList.value = ['All', ...(await ChatRoleApi.getCategoryList())]
}

/** Processing category clicks */
const handlerCategoryClick = async (category: string) => {
  // Switch the selected category
  activeCategory.value = category
  // screen
  await getActiveTabsRole()
}

/** add to/Modify operation */
const formRef = ref()
const handlerAddRole = async () => {
  formRef.value.open('my-create', null, 'Add role')
}
/** Edit Role */
const handlerCardEdit = async (role) => {
  formRef.value.open('my-update', role.id, 'Edit role')
}

/** Successfully added role */
const handlerAddRoleSuccess = async (e) => {
  // refresh data
  await getActiveTabsRole()
}

/** Delete Role */
const handlerCardDelete = async (role) => {
  await ChatRoleApi.deleteMy(role.id)
  // refresh data
  await getActiveTabsRole()
}

/** Role pagination：Get the next page */
const handlerCardPage = async (type) => {
  try {
    loading.value = true
    if (type === 'public') {
      publicRoleParams.pageNo++
      await getPublicRole(true)
    } else {
      myRoleParams.pageNo++
      await getMyRole(true)
    }
  } finally {
    loading.value = false
  }
}

/** choice card role：Create a new chat conversation */
const handlerCardUse = async (role) => {
  // 1. Create a conversation
  const data: ChatConversationVO = {
    roleId: role.id
  } as unknown as ChatConversationVO
  const conversationId = await ChatConversationApi.createChatConversationMy(data)

  // 2. Jump page
  await router.push({
    name: 'AiChat',
    query: {
      conversationId: conversationId
    }
  })
}

/** initialization **/
onMounted(async () => {
  // Get classification
  await getRoleCategoryList()
  // get role data
  await getActiveTabsRole()
})
</script>
<!-- cover element ui css -->
<style lang="scss">
.el-tabs__content {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.el-tabs__nav-scroll {
  margin: 10px 20px;
}
</style>
<!-- style -->
<style scoped lang="scss">
// With the container
.role-container {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .role-main {
    flex: 1;
    overflow: hidden;
    margin: 0;
    padding: 0;
    position: relative;

    .search-container {
      margin: 20px 20px 0px 20px;
      position: absolute;
      right: 0;
      top: -5px;
      z-index: 100;
    }

    .search-input {
      width: 240px;
    }

    .tabs {
      position: relative;
      height: 100%;

      .role-category-list {
        margin: 0 27px;
      }
    }

    .role-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
      position: relative;
    }
  }
}
</style>
