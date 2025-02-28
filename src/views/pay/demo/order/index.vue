<template>
  <!-- Xtra Operations  -->
  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button type="primary" plain @click="openForm"><Icon icon="ep:plus" />Initiate Order</el-button>
    </el-col>
  </el-row>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="Order ID" align="center" prop="id" />
      <el-table-column label="User ID" align="center" prop="userId" />
      <el-table-column label="Product Name" align="center" prop="spuName" />
      <el-table-column label="Payment Price" align="center" prop="price">
        <template #default="scope">
          <span>￥{{ (scope.row.price / 100.0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Refund Amount " align="center" prop="refundPrice">
        <template #default="scope">
          <span>￥{{ (scope.row.refundPrice / 100.0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Create Time"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Payment Order Number" align="center" prop="payOrderId" />
      <el-table-column label="Pay Status" align="center" prop="payStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.payStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="Pay Time"
        align="center"
        prop="payTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Refund Time" align="center" prop="refundTime" width="180">
        <template #default="scope">
          <span v-if="scope.row.refundTime">{{ formatDate(scope.row.refundTime) }}</span>
          <span v-else-if="scope.row.payRefundId">Refund in progress，Waiting for refund result</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handlePay(scope.row)" v-if="!scope.row.payStatus">
            Go to Pay
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleRefund(scope.row)"
            v-if="scope.row.payStatus && !scope.row.payRefundId"
          >
            Initiate Rrefund
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Paging component -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- dialog box(add/ modify) -->
  <Dialog title="Initiate an order" v-model="dialogVisible" width="500px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="SPU" prop="spuId">
        <el-select
          v-model="formData.spuId"
          placeholder="Please enter the ordered product"
          clearable
          style="width: 380px"
        >
          <el-option v-for="item in spus" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; font-size: 13px; color: #8492a6">
              ￥{{ (item.price / 100.0).toFixed(2) }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup name="PayDemoOrder">
import * as PayDemoApi from '@/api/pay/demo'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'

const { t } = useI18n() // internationalization
const router = useRouter() // Routing object
const message = useMessage() // Message pop-up window

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
// query criteria
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})

const formRef = ref()

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await PayDemoApi.getDemoOrderPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Payment button operation */
const handlePay = (row: any) => {
  router.push({
    name: 'PayCashier',
    query: {
      id: row.payOrderId,
      returnUrl: encodeURIComponent('/pay/demo/order?id=' + row.id)
    }
  })
}

/** Refund button operation */
const handleRefund = async (row: any) => {
  const id = row.id
  try {
    await message.confirm('Are you sure the refund number is"' + id + '"Example orders?')
    await PayDemoApi.refundDemoOrder(id)
    await getList()
    message.success('Refund initiated successfully！')
  } catch {}
}

// ========== pop-up notification ==========

// Product array
const spus = ref([
  {
    id: 1,
    name: 'Huawei mobile phone',
    price: 1
  },
  {
    id: 2,
    name: 'Mi TV',
    price: 10
  },
  {
    id: 3,
    name: 'Apple Watch',
    price: 100
  },
  {
    id: 4,
    name: 'Asus notebook',
    price: 1000
  },
  {
    id: 5,
    name: 'NIO Motors',
    price: 200000
  }
])

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress
const formData = ref<any>({}) // Form Data 
const formRules = {
  spuId: [{ required: true, message: 'The product number cannot be empty', trigger: 'blur' }]
}

/** Form Reset */
const reset = () => {
  formData.value = {
    spuId: undefined
  }
  formRef.value?.resetFields()
}

/** Add button operation */
const openForm = () => {
  reset()
  dialogVisible.value = true
}

/** Submit button */
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    await PayDemoApi.createDemoOrder(formData.value)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
  } finally {
    formLoading.value = false
    getList()
  }
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
