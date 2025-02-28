<template>
  <!-- action bar -->
  <ContentWrap>
    <el-button type="primary" plain @click="openForm()">
      <Icon icon="ep:plus" class="mr-5px" /> IP Query
    </el-button>
  </ContentWrap>

  <!-- list -->
  <ContentWrap>
    <div style="width: 100%; height: 700px">
      <!-- AutoResizer Automatically adjust size -->
      <el-auto-resizer>
        <template #default="{ height, width }">
          <!-- Virtualized Table Virtualization Table：High performance，Resolve the lag problem of tables in large amounts of data -->
          <el-table-v2
            v-loading="loading"
            :columns="columns"
            :data="list"
            :width="width"
            :height="height"
            expand-column-key="id"
          />
        </template>
      </el-auto-resizer>
    </div>
  </ContentWrap>

  <!-- Form pop-up window：add to/modify -->
  <AreaForm ref="formRef" />
</template>
<script setup lang="tsx">
import { Column } from 'element-plus'
import AreaForm from './AreaForm.vue'
import * as AreaApi from '@/api/system/area'

defineOptions({ name: 'SystemArea' })

// The table's column field
const columns: Column[] = [
  {
    dataKey: 'id', // Need to render the data fields of the current column
    title: 'ID', // Text displayed in the cell header
    width: 400, // The width of the current column，Must be set
    fixed: true, // Is the column fixed
    key: 'id' // Expand the corresponding tree structure key
  },
  {
    dataKey: 'name',
    title: 'Name',
    width: 200
  }
]
const loading = ref(true) // Loading the list
const list = ref([]) // Table data

/** Obtain data list */
const getList = async () => {
  loading.value = true
  try {
    list.value = await AreaApi.getAreaTree()
  } finally {
    loading.value = false
  }
}

/** add to/Modify operation */
const formRef = ref()
const openForm = () => {
  formRef.value.open()
}

/** initialization **/
onMounted(() => {
  getList()
})
</script>
