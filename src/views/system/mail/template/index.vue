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
          v-hasPermi="['system:mail-template:create']"
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
          @click="openSendForm(row.id)"
          v-hasPermi="['system:mail-template:send-mail']"
        >
          Test
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['system:mail-template:update']"
        >
          Edit
        </el-button>
        <el-button
          link
          type="danger"
          v-hasPermi="['system:mail-template:delete']"
          @click="handleDelete(row.id)"
        >
          Delete
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <MailTemplateForm ref="formRef" @success="getList" />

  <!-- Form pop-up window：Send test -->
  <MailTemplateSendForm ref="sendFormRef" />
</template>
<script lang="ts" setup>
import { allSchemas } from './template.data'
import * as MailTemplateApi from '@/api/system/mail/template'
import MailTemplateForm from './MailTemplateForm.vue'
import MailTemplateSendForm from './MailTemplateSendForm.vue'

defineOptions({ name: 'SystemMailTemplate' })

// tableObject：Attribute objects of the table，Can obtain page size、Number of items and other attributes
// tableMethods：The operation object of the table，Can obtain pagination、Delete records and other operations
const { tableObject, tableMethods } = useTable({
  getListApi: MailTemplateApi.getMailTemplatePage, // Paging interface
  delListApi: MailTemplateApi.deleteMailTemplate // Delete interface
})
// Various operations to obtain tables
const { getList, setSearchParams } = tableMethods

/** add to/Modify operation */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** Delete button operation */
const handleDelete = (id: number) => {
  tableMethods.delList(id, false)
}

/** Send test operation */
const sendFormRef = ref()
const openSendForm = (id: number) => {
  sendFormRef.value.open(id)
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
