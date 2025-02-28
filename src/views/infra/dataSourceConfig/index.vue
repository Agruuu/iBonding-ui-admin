<template>
  <ContentWrap>
    <!-- Search Work Bar -->
    <el-form class="-mb-15px" :inline="true">
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['infra:data-source-config:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> Add
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Url" align="center" prop="url" :show-overflow-tooltip="true" />
      <el-table-column label="Username" align="center" prop="username" />
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
            v-hasPermi="['infra:data-source-config:update']"
            :disabled="scope.row.id === 0"
          >
            Edit
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['infra:data-source-config:delete']"
            :disabled="scope.row.id === 0"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- Form pop-up window：add/modify -->
  <DataSourceConfigForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as DataSourceConfigApi from '@/api/infra/dataSourceConfig'
import DataSourceConfigForm from './DataSourceConfigForm.vue'

defineOptions({ name: 'InfraDataSourceConfig' })

const message = useMessage() // Message pop-up window
const { t } = useI18n() // internationalization

const loading = ref(true) // Loading the list
const list = ref([]) // List of data

/** Query List */
const getList = async () => {
  loading.value = true
  try {
    list.value = await DataSourceConfigApi.getDataSourceConfigList()
  } finally {
    loading.value = false
  }
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
    await DataSourceConfigApi.deleteDataSourceConfig(id)
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
