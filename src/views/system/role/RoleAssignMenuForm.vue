<template>
  <Dialog v-model="dialogVisible" title="Menu Permissions">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" label-width="80px">
      <el-form-item label="Name">
        <el-tag>{{ formData.name }}</el-tag>
      </el-form-item>
      <el-form-item label="Code">
        <el-tag>{{ formData.code }}</el-tag>
      </el-form-item>
      <el-form-item label="Menu Permissions">
        <el-card class="w-full h-400px !overflow-y-scroll" shadow="never">
          <template #header>
            Select All/Non Selected:
            <el-switch
              v-model="treeNodeAll"
              active-text="Yes"
              inactive-text="No"
              inline-prompt
              @change="handleCheckedTreeNodeAll"
            />
            Expand All/Fold:
            <el-switch
              v-model="menuExpand"
              active-text="Open"
              inactive-text="Fold"
              inline-prompt
              @change="handleCheckedTreeExpand"
            />
          </template>
          <el-tree
            ref="treeRef"
            :data="menuOptions"
            :props="defaultProps"
            empty-text="Loading...please wait a moment"
            node-key="id"
            show-checkbox
          />
        </el-card>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { defaultProps, handleTree } from '@/utils/tree'
import * as RoleApi from '@/api/system/role'
import * as MenuApi from '@/api/system/menu'
import * as PermissionApi from '@/api/system/permission'

defineOptions({ name: 'SystemRoleAssignMenuForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = reactive({
  id: undefined,
  name: '',
  code: '',
  menuIds: []
})
const formRef = ref() // form  Ref
const menuOptions = ref<any[]>([]) // Menu tree structure
const menuExpand = ref(false) // open/fold
const treeRef = ref() // Menu tree component Ref
const treeNodeAll = ref(false) // Select All/Not selected at all

/** Open pop-up window */
const open = async (row: RoleApi.RoleVO) => {
  dialogVisible.value = true
  resetForm()
  // Load the Menu list. Note that this operation must be placed in the front. Otherwise, there will be no data nodes for the `setChecked` operation below.  
  menuOptions.value = handleTree(await MenuApi.getSimpleMenusList())
  // Set data
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  formLoading.value = true
  try {
    formData.value.menuIds = await PermissionApi.getRoleMenuList(row.id)
    // Set selection
    formData.value.menuIds.forEach((menuId: number) => {
      treeRef.value.setChecked(menuId, true, false)
    })
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    const data = {
      roleId: formData.id,
      menuIds: [
        ...(treeRef.value.getCheckedKeys(false) as unknown as Array<number>), // Obtain the currently selected node
        ...(treeRef.value.getHalfCheckedKeys() as unknown as Array<number>) // Obtain a half selected parent node
      ]
    }
    await PermissionApi.assignRoleMenu(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // Event of successful sending operation
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** Reset Form  */
const resetForm = () => {
  // reset options 
  treeNodeAll.value = false
  menuExpand.value = false
  // Reset Form 
  formData.value = {
    id: undefined,
    name: '',
    code: '',
    menuIds: []
  }
  treeRef.value?.setCheckedNodes([])
  formRef.value?.resetFields()
}

/** Select All/Not selected at all */
const handleCheckedTreeNodeAll = () => {
  treeRef.value.setCheckedNodes(treeNodeAll.value ? menuOptions.value : [])
}

/** open/Fold All */
const handleCheckedTreeExpand = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === menuExpand.value) {
      continue
    }
    nodes[node].expanded = menuExpand.value
  }
}
</script>
