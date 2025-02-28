<template>
  <!-- Search Work Bar -->
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <!-- Add and other operation buttons -->
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['system:mail-account:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> Add
        </el-button>
      </template>
    </Search>
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
          @click="openForm('update', row.id)"
          v-hasPermi="['system:mail-account:update']"
        >
          Edit
        </el-button>
        <el-button
          link
          type="primary"
          @click="openDetail(row.id)"
          v-hasPermi="['system:mail-account:query']"
        >
          Detail
        </el-button>
        <el-button
          link
          type="danger"
          v-hasPermi="['system:mail-account:delete']"
          @click="handleDelete(row.id)"
        >
          Delete
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <MailAccountForm ref="formRef" @success="getList" />
  <!-- Details pop-up window -->
  <MailAccountDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { allSchemas } from './account.data'
import * as MailAccountApi from '@/api/system/mail/account'
import MailAccountForm from './MailAccountForm.vue'
import MailAccountDetail from './MailAccountDetail.vue'

defineOptions({ name: 'SystemMailAccount' })

// tableObject：Attribute objects of the table，Can obtain page size、Number of items and other attributes
// tableMethods：The operation object of the table，Can obtain pagination、Delete records and other operations
const { tableObject, tableMethods } = useTable({
  getListApi: MailAccountApi.getMailAccountPage, // Paging interface
  delListApi: MailAccountApi.deleteMailAccount // Delete interface
})
// Various operations to obtain tables
const { getList, setSearchParams } = tableMethods

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Detailed operation */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** Delete button operation */
const handleDelete = (id: number) => {
  tableMethods.delList(id, false)
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
