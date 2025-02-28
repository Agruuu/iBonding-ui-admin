<template>
  <Dialog v-model="dialogVisible" title="Person Select" width="800">
    <el-row class="gap2" v-loading="formLoading">
      <el-col :span="6">
        <ContentWrap class="h-1/1">
          <el-tree
            ref="treeRef"
            :data="deptTree"
            :expand-on-click-node="false"
            :props="defaultProps"
            default-expand-all
            highlight-current
            node-key="id"
            @node-click="handleNodeClick"
          />
        </ContentWrap>
      </el-col>
      <el-col :span="17">
        <el-transfer
          v-model="selectedUserIdList"
          :titles="['Non Selected', 'Selected']"
          filterable
          filter-placeholder="Search User"
          :data="transferUserList"
          :props="{ label: 'nickname', key: 'id' }"
        />
      </el-col>
    </el-row>
    <template #footer>
      <el-button
        :disabled="formLoading || !selectedUserIdList?.length"
        type="primary"
        @click="submitForm"
      >
        Confirm
      </el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { defaultProps, handleTree } from '@/utils/tree'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'

defineOptions({ name: 'UserSelectForm' })
const emit = defineEmits<{
  confirm: [id: any, userList: any[]]
}>()
const { t } = useI18n() // international
const message = useMessage() // Message pop-up window
const deptTree = ref<Tree[]>([]) // Departmental tree structured structure
const deptList = ref<any[]>([]) // Save flattened department list data
const userList = ref<UserApi.UserVO[]>([]) // List of all users
const filteredUserList = ref<UserApi.UserVO[]>([]) // The filtered user list of the current department
const selectedUserIdList: any = ref([]) // Selected user list
const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress
const activityId = ref()

/** Calculate attributes：Merge selected users with filtered users from the current department */
const transferUserList = computed(() => {
  // 1.1 Retrieve all selected users
  const selectedUsers = userList.value.filter((user: any) =>
    selectedUserIdList.value.includes(user.id)
  )

  // 1.2 Retrieve the unselected users filtered by the current department
  const filteredUnselectedUsers = filteredUserList.value.filter(
    (user: any) => !selectedUserIdList.value.includes(user.id)
  )

  // 2. Merge and remove duplicates
  return [...selectedUsers, ...filteredUnselectedUsers]
})

/** Open pop-up window */
const open = async (id: number, selectedList?: any[]) => {
  activityId.value = id
  resetForm()

  // Loading Department、User List
  const deptData = await DeptApi.getSimpleDeptList()
  deptList.value = deptData // Save flat structured departmental data
  deptTree.value = handleTree(deptData) // Convert to tree structure
  userList.value = await UserApi.getSimpleUserList()

  // In the initial state，The filtered list is equal to the list of all users
  filteredUserList.value = [...userList.value]
  selectedUserIdList.value = selectedList?.map((item: any) => item.id) || []
  dialogVisible.value = true
}

/** Obtain the specified department and all its sub departmentsIDlist */
const getChildDeptIds = (deptId: number, deptList: any[]): number[] => {
  const ids = [deptId]
  const children = deptList.filter((dept) => dept.parentId === deptId)
  children.forEach((child) => {
    ids.push(...getChildDeptIds(child.id, deptList))
  })
  return ids
}

/** Obtain the user list filtered by the department */
const filterUserList = async (deptId?: number) => {
  formLoading.value = true
  try {
    if (!deptId) {
      // If no department is selected，Display all users
      filteredUserList.value = [...userList.value]
      return
    }

    // Directly use the saved department list data for filtering
    const deptIds = getChildDeptIds(deptId, deptList.value)

    // Filter out users under these departments
    filteredUserList.value = userList.value.filter((user) => deptIds.includes(user.deptId))
  } finally {
    formLoading.value = false
  }
}

/** Submit selection */
const submitForm = async () => {
  try {
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // Filter out selected users from the list of all users
    const emitUserList = userList.value.filter((user: any) =>
      selectedUserIdList.value.includes(user.id)
    )
    // Event of successful sending operation
    emit('confirm', activityId.value, emitUserList)
  } finally {
  }
}

/** Reset Form  */
const resetForm = () => {
  deptTree.value = []
  deptList.value = []
  userList.value = []
  filteredUserList.value = []
  selectedUserIdList.value = []
}

/** Processing department clicked */
const handleNodeClick = (row: { [key: string]: any }) => {
  filterUserList(row.id)
}

defineExpose({ open }) // provide open method，Used to open pop ups
</script>

<style lang="scss" scoped>
:deep() {
  .el-transfer {
    display: flex;
  }
  .el-transfer__buttons {
    display: flex !important;
    flex-direction: column-reverse;
    justify-content: center;
    gap: 20px;
    .el-transfer__button:nth-child(2) {
      margin: 0;
    }
  }
}
</style>
