<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="Signature" prop="signature">
        <el-input
          v-model="queryParams.signature"
          placeholder="Please enter your SMS signature"
          clearable
          class="!w-240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select the enabled status"
          class="!w-240px"
          clearable
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Create Time" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['system:sms-channel:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> Add</el-button
        >
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Signature" align="center" prop="signature" />
      <el-table-column label="Code" align="center" prop="code">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE" :value="scope.row.code" />
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Remarks" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column
        label="API Key"
        align="center"
        prop="apiKey"
        :show-overflow-tooltip="true"
        width="180"
      />
      <el-table-column
        label="API Secret"
        align="center"
        prop="apiSecret"
        :show-overflow-tooltip="true"
        width="180"
      />
      <el-table-column
        label="Callback URL"
        align="center"
        prop="callbackUrl"
        :show-overflow-tooltip="true"
        width="180"
      />
      <el-table-column
        label="Create Time"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Operation" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['system:sms-channel:update']"
          >
            Edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:sms-channel:delete']"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- paging -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <SmsChannelForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'
import SmsChannelForm from './SmsChannelForm.vue'

defineOptions({ name: 'SystemSmsChannel' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const loading = ref(false) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryFormRef = ref() // Search form
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  signature: undefined,
  status: undefined,
  createTime: []
})

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await SmsChannelApi.getSmsChannelPage(queryParams)
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

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Delete button operation */
const handleDelete = async (id: number) => {
  try {
    // Secondary confirmation of deletion
    await message.delConfirm()
    // Initiate deletion
    await SmsChannelApi.deleteSmsChannel(id)
    message.success(t('common.delSuccess'))
    // Refresh List 
    await getList()
  } catch {}
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
