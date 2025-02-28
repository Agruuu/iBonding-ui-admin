<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="User nickname" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          class="!w-240px"
          clearable
          placeholder="Please enter user nickname"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="cell-phone number" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          class="!w-240px"
          clearable
          placeholder="Please enter your phone number"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Registration time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="End Date"
          start-placeholder="Start date"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="login time" prop="loginDate">
        <el-date-picker
          v-model="queryParams.loginDate"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="End Date"
          start-placeholder="Start date"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="User tags" prop="tagIds">
        <MemberTagSelect v-model="queryParams.tagIds" />
      </el-form-item>
      <el-form-item label="User level" prop="levelId">
        <MemberLevelSelect v-model="queryParams.levelId" />
      </el-form-item>
      <el-form-item label="User grouping" prop="groupId">
        <MemberGroupSelect v-model="queryParams.groupId" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          search
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          Reset
        </el-button>
        <el-button v-hasPermi="['promotion:coupon:send']" @click="openCoupon">Send coupons</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      :stripe="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="User ID" prop="id" width="120px" />
      <el-table-column align="center" label="head portrait" prop="avatar" width="80px">
        <template #default="scope">
          <img :src="scope.row.avatar" style="width: 40px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="cell-phone number" prop="mobile" width="120px" />
      <el-table-column align="center" label="nickname" prop="nickname" width="80px" />
      <el-table-column align="center" label="Grade" prop="levelName" width="100px" />
      <el-table-column align="center" label="grouping" prop="groupName" width="100px" />
      <el-table-column
        :show-overflow-tooltip="false"
        align="center"
        label="User tags"
        prop="tagNames"
      >
        <template #default="scope">
          <el-tag v-for="(tagName, index) in scope.row.tagNames" :key="index" class="mr-5px">
            {{ tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="integral" prop="point" width="100px" />
      <el-table-column align="center" label="state" prop="status" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="login time"
        prop="loginDate"
        width="180px"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="Registration time"
        prop="createTime"
        width="180px"
      />
      <el-table-column
        :show-overflow-tooltip="false"
        align="center"
        fixed="right"
        label="operation"
        width="100px"
      >
        <template #default="scope">
          <div class="flex items-center justify-center">
            <el-button link type="primary" @click="openDetail(scope.row.id)">details</el-button>
            <el-dropdown
              v-hasPermi="[
                'member:user:update',
                'member:user:update-level',
                'member:user:update-point',
                'pay:wallet:update-balance'
              ]"
              @command="(command) => handleCommand(command, scope.row)"
            >
              <el-button link type="primary">
                <Icon icon="ep:d-arrow-right" />
                more
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="checkPermi(['member:user:update'])"
                    command="handleUpdate"
                  >
                    edit
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkPermi(['member:user:update-level'])"
                    command="handleUpdateLevel"
                  >
                    Change level
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkPermi(['member:user:update-point'])"
                    command="handleUpdatePoint"
                  >
                    Modify points
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkPermi(['pay:wallet:update-balance'])"
                    command="handleUpdateBlance"
                  >
                    Modify balance
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- paging -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <UserForm ref="formRef" @success="getList" />
  <!-- Modify user level pop-up window -->
  <UserLevelUpdateForm ref="updateLevelFormRef" @success="getList" />
  <!-- Modify user points pop-up window -->
  <UserPointUpdateForm ref="updatePointFormRef" @success="getList" />
  <!-- Modify user balance pop-up window -->
  <UserBalanceUpdateForm ref="UpdateBalanceFormRef" @success="getList" />
  <!-- Send coupon pop-up window -->
  <CouponSendForm ref="couponSendFormRef" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as UserApi from '@/api/member/user'
import { DICT_TYPE } from '@/utils/dict'
import UserForm from './UserForm.vue'
import MemberTagSelect from '@/views/member/tag/components/MemberTagSelect.vue'
import MemberLevelSelect from '@/views/member/level/components/MemberLevelSelect.vue'
import MemberGroupSelect from '@/views/member/group/components/MemberGroupSelect.vue'
import UserLevelUpdateForm from './components/UserLevelUpdateForm.vue'
import UserPointUpdateForm from './components/UserPointUpdateForm.vue'
import UserBalanceUpdateForm from './components/UserBalanceUpdateForm.vue'
import { checkPermi } from '@/utils/permission'

defineOptions({ name: 'MemberUser' })

const message = useMessage() // Message pop-up window

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickname: null,
  mobile: null,
  loginDate: [],
  createTime: [],
  tagIds: [],
  levelId: null,
  groupId: null
})
const queryFormRef = ref() // Search form
const updateLevelFormRef = ref() // Modify membership level form
const updatePointFormRef = ref() // Modify Member Points Form
const UpdateBalanceFormRef = ref() // Modify User Balance Form
const selectedIds = ref<number[]>([]) // Selection of Tables ID array

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Search button operation */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** Open member details */
const { push } = useRouter()
const openDetail = (id: number) => {
  push({ name: 'MemberUserDetail', params: { id } })
}

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Table Select Events */
const handleSelectionChange = (rows: UserApi.UserVO[]) => {
  selectedIds.value = rows.map((row) => row.id)
}

/** Send coupons */
const couponSendFormRef = ref()
const openCoupon = () => {
  if (selectedIds.value.length === 0) {
    message.warning('Please select the user to send the coupon to')
    return
  }
  couponSendFormRef.value.open(selectedIds.value)
}

/** Operation distribution */
const handleCommand = (command: string, row: UserApi.UserVO) => {
  switch (command) {
    case 'handleUpdate':
      openForm('update', row.id)
      break
    case 'handleUpdateLevel':
      updateLevelFormRef.value.open(row.id)
      break
    case 'handleUpdatePoint':
      updatePointFormRef.value.open(row.id)
      break
    case 'handleUpdateBlance':
      UpdateBalanceFormRef.value.open(row.id)
      break
    default:
      break
  }
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
