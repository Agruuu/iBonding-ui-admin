<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="Mobile" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="Please enter your phone number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Channel" prop="channelId">
        <el-select
          v-model="queryParams.channelId"
          placeholder="Please select SMS channel"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="channel in channelList"
            :key="channel.id"
            :value="channel.id"
            :label="
              channel.signature +
              `【 ${getDictLabel(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE, channel.code)}】`
            "
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Template No." prop="templateId">
        <el-input
          v-model="queryParams.templateId"
          placeholder="Please enter the template number"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Send Status" prop="sendStatus">
        <el-select
          v-model="queryParams.sendStatus"
          placeholder="Please select the send status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SMS_SEND_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Send Time" prop="sendTime">
        <el-date-picker
          v-model="queryParams.sendTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Receive Status" prop="receiveStatus">
        <el-select
          v-model="queryParams.receiveStatus"
          placeholder="Please select the receive status"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Receive time" prop="receiveTime">
        <el-date-picker
          v-model="queryParams.receiveTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> Search</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> Reset</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:sms-log:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> Export
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column
        label="Create Time"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="Mobile" align="center" prop="mobile" width="120">
        <template #default="scope">
          <div>{{ scope.row.mobile }}</div>
          <div v-if="scope.row.userType && scope.row.userId">
            <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType" />
            {{ '(' + scope.row.userId + ')' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Content" align="center" prop="templateContent" width="300" />
      <el-table-column label="Send Status" align="center" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_SEND_STATUS" :value="scope.row.sendStatus" />
          <div>{{ formatDate(scope.row.sendTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Receive Status" align="center" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS" :value="scope.row.receiveStatus" />
          <div>{{ formatDate(scope.row.receiveTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Channel" align="center" width="120">
        <template #default="scope">
          <div>
            {{ channelList.find((channel) => channel.id === scope.row.channelId)?.signature }}
          </div>
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE" :value="scope.row.channelCode" />
        </template>
      </el-table-column>
      <el-table-column label="Template No." align="center" prop="templateId" />
      <el-table-column label="Type" align="center" prop="templateType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE" :value="scope.row.templateType" />
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" fixed="right" class-name="fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row)"
            v-hasPermi="['system:sms-log:query']"
          >
            Details
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

  <!-- Form pop-up window：details -->
  <SmsLogDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'
import * as SmsLogApi from '@/api/system/sms/smsLog'
import SmsLogDetail from './SmsLogDetail.vue'

defineOptions({ name: 'SystemSmsLog' })

const message = useMessage() // Message pop-up window

const loading = ref(false) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data
const queryFormRef = ref() // Search form
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  channelId: null,
  templateId: null,
  mobile: '',
  sendStatus: null,
  receiveStatus: null,
  sendTime: [],
  receiveTime: []
})
const exportLoading = ref(false) // In the process of exporting and loading
const channelList = ref([]) // List of SMS channels

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    const data = await SmsLogApi.getSmsLogPage(queryParams)
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

/** Export button operation */
const handleExport = async () => {
  try {
    // Secondary confirmation of export
    await message.exportConfirm()
    // Initiate export
    exportLoading.value = true
    const data = await SmsLogApi.exportSmsLog(queryParams)
    download.excel(data, 'SMS log.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** Detailed operation */
const detailRef = ref()
const openDetail = (data: SmsLogApi.SmsLogVO) => {
  detailRef.value.open(data)
}

/** initialization **/
onMounted(async () => {
  await getList()
  // Load channel list
  channelList.value = await SmsChannelApi.getSimpleSmsChannelList()
})
</script>
