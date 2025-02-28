<template>
  <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
    <el-table-column label="Address Number" align="center" prop="id" width="150px" />
    <el-table-column label="Recipient Name" align="center" prop="name" width="150px" />
    <el-table-column label="cell-phone number" align="center" prop="mobile" width="150px" />
    <el-table-column label="Regional code" align="center" prop="areaId" width="150px" />
    <el-table-column label="Detailed mailing address" align="center" prop="detailAddress" />
    <el-table-column label="Is it default" align="center" prop="defaultStatus" width="150px">
      <template #default="scope">
        <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="Number(scope.row.defaultStatus)" />
      </template>
    </el-table-column>
    <el-table-column
      label="Creation time"
      align="center"
      prop="createTime"
      :formatter="dateFormatter"
      width="180px"
    />
  </el-table>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as AddressApi from '@/api/member/address'

const { userId }: { userId: number } = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

const loading = ref(true) // Loading the list
const total = ref(0) // The total number of pages in the list
const list = ref([]) // List of data

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    list.value = await AddressApi.getAddressList({ userId })
  } finally {
    loading.value = false
  }
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss"></style>
