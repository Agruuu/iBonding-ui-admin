<template>
  <!-- Search Work Bar -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="Creation time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" class="mr-5px" />search </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" />Reset </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <!-- Tab option：The real content is Lab -->
    <el-tabs v-model="activeTab" type="card" @tab-change="onTabChange">
      <el-tab-pane
        v-for="tab in statusTabs"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      />
    </el-tabs>

    <!-- list -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Discount coupons" align="center" prop="name" />
      <el-table-column label="Coupon type" align="center" prop="discountType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PROMOTION_DISCOUNT_TYPE" :value="scope.row.discountType" />
        </template>
      </el-table-column>
      <el-table-column label="Collection method" align="center" prop="takeType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PROMOTION_COUPON_TAKE_TYPE" :value="scope.row.takeType" />
        </template>
      </el-table-column>
      <el-table-column label="state" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PROMOTION_COUPON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="Collection time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column
        label="Usage time"
        align="center"
        prop="useTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="operation" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            v-hasPermi="['promotion:coupon:delete']"
            type="danger"
            link
            @click="handleDelete(scope.row.id)"
          >
            recovery
          </el-button>
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
</template>

<script setup lang="ts" name="UserCouponList">
import { deleteCoupon, getCouponPage } from '@/api/mall/promotion/coupon/coupon'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'

defineOptions({ name: 'UserCouponList' })

const { userId }: { userId: number } = defineProps({
  userId: {
    type: Number,
    required: true
  }
}) //User ID

const message = useMessage() // Message pop-up window

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // Dictionary table data
// Query parameters
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  status: undefined,
  userIds: undefined
})
const queryFormRef = ref() // Search form

const activeTab = ref('all') // Tab screen
const statusTabs = reactive([
  {
    label: 'whole',
    value: 'all'
  }
])

/** Query List */
const getList = async () => {
  loading.value = true
  // Execute query
  try {
    queryParams.userIds = userId
    const data = await getCouponPage(queryParams)
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
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation
    await message.confirm(
      'Recycling will retrieve the coupons that members have received for use，Used items cannot be recycled，Are you sure you want to recycle the selected coupon？'
    )
    // Initiate deletion
    await deleteCoupon(id)
    message.notifySuccess('Recycling successful')
    // Reload List
    await getList()
  } catch {}
}

/** tab switch */
const onTabChange = (tabName) => {
  queryParams.status = tabName === 'all' ? undefined : tabName
  getList()
}

/** initialization **/
onMounted(() => {
  getList()
  // set up statuses filter
  for (const dict of getIntDictOptions(DICT_TYPE.PROMOTION_COUPON_STATUS)) {
    statusTabs.push({
      label: dict.label,
      value: dict.value as string
    })
  }
})
</script>
