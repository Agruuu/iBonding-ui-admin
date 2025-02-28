<template>
  <!-- Search Work Bar -->
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
    >
      <template #action="{ row }">
        <el-button
          link
          type="primary"
          @click="openDetail(row.id)"
          v-hasPermi="['system:mail-log:query']"
        >
          Details
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <!-- Form pop-up window：details -->
  <mail-log-detail ref="detailRef" />
</template>
<script lang="ts" setup>
import { allSchemas } from './log.data'
import * as MailLogApi from '@/api/system/mail/log'
import MailLogDetail from './MailLogDetail.vue'

defineOptions({ name: 'SystemMailLog' })

// tableObject：Attribute objects of the table，Can obtain page size、Number of items and other attributes
// tableMethods：The operation object of the table，Can obtain pagination、Delete records and other operations
const { tableObject, tableMethods } = useTable({
  getListApi: MailLogApi.getMailLogPage // Paging interface
})
// Various operations to obtain tables
const { getList, setSearchParams } = tableMethods

/** Detailed operation */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
