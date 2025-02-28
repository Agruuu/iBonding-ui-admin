<!-- This is a general component for list selection. Refer to the `ProductList` component for usage. -->
<template>
  <Dialog v-model="dialogVisible" :appendToBody="true" :scroll="true" :title="title" width="60%">
    <el-table
      ref="multipleTableRef"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      :stripe="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <slot></slot>
    </el-table>
    <!-- paging -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ElTable } from 'element-plus'

defineOptions({ name: 'TableSelectForm' })
withDefaults(
  defineProps<{
    modelValue: any[]
    title: string
  }>(),
  { modelValue: () => [], title: 'Select' }
)
const list = ref([]) // List of data
const total = ref(0) // The total number of pages in the list
const loading = ref(false) // Loading the list
const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})
// Confirm the triggering event when selecting
const emits = defineEmits<{
  (e: 'update:modelValue', v: number[]): void
}>()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}
/** trigger */
const submitForm = () => {
  formLoading.value = true
  try {
    emits('update:modelValue', multipleSelection.value) // Return the selected raw data for processing by the user
  } finally {
    formLoading.value = false
    // Close the pop-up window
    dialogVisible.value = false
  }
}

const getList = async (getListFunc: Function) => {
  loading.value = true
  try {
    const data = await getListFunc(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** Open pop-up window */
const open = async (getListFunc: Function) => {
  dialogVisible.value = true
  await nextTick()
  if (multipleSelection.value.length > 0) {
    multipleTableRef.value!.clearSelection()
  }
  await getList(getListFunc)
}
defineExpose({ open }) // provide open method，Used to open pop ups
</script>
