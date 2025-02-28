<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter a name" />
      </el-form-item>
      <el-form-item label="Parent ID" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="demo02CategoryTree"
          :props="defaultProps"
          check-strictly
          default-expand-all
          placeholder="Please select parent id"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as Demo02CategoryApi from '@/api/infra/demo/demo02'
import { defaultProps, handleTree } from '@/utils/tree'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  name: undefined,
  parentId: undefined
})
const formRules = reactive({
  name: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }],
  parentId: [{ required: true, message: 'The parent id cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref
const demo02CategoryTree = ref() // tree structure

/** Open pop-up window */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // When modifying，Set data
  if (id) {
    formLoading.value = true
    try {
      formData.value = await Demo02CategoryApi.getDemo02Category(id)
    } finally {
      formLoading.value = false
    }
  }
  await getDemo02CategoryTree()
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  // validate form 
  await formRef.value.validate()
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value as unknown as Demo02CategoryApi.Demo02CategoryVO
    if (formType.value === 'create') {
      await Demo02CategoryApi.createDemo02Category(data)
      message.success(t('common.createSuccess'))
    } else {
      await Demo02CategoryApi.updateDemo02Category(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // Event of successful sending operation
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** Reset Form  */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    parentId: undefined
  }
  formRef.value?.resetFields()
}

/** Obtain an example classification tree */
const getDemo02CategoryTree = async () => {
  demo02CategoryTree.value = []
  const data = await Demo02CategoryApi.getDemo02CategoryList()
  const root: Tree = { id: 0, name: 'Top Example Category', children: [] }
  root.children = handleTree(data, 'id', 'parentId')
  demo02CategoryTree.value.push(root)
}
</script>
