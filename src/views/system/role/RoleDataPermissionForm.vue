<template>
  <Dialog v-model="dialogVisible" title="Data Permissions" width="800">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" label-width="80px">
      <el-form-item label="Name">
        <el-tag>{{ formData.name }}</el-tag>
      </el-form-item>
      <el-form-item label="Code">
        <el-tag>{{ formData.code }}</el-tag>
      </el-form-item>
      <el-form-item label="Data Scope">
        <el-select v-model="formData.dataScope">
          <el-option
            v-for="item in getIntDictOptions(DICT_TYPE.SYSTEM_DATA_SCOPE)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form-item
      v-if="formData.dataScope === SystemDataScopeEnum.DEPT_CUSTOM"
      label="Data Scope"
      label-width="80px"
    >
      <el-card class="w-full h-400px !overflow-y-scroll" shadow="never">
        <template #header>
          Select All/Not Selected:
          <el-switch
            v-model="treeNodeAll"
            active-text="Yes"
            inactive-text="No"
            inline-prompt
            @change="handleCheckedTreeNodeAll()"
          />
          Expand All/Fold:
          <el-switch
            v-model="deptExpand"
            active-text="Open"
            inactive-text="Fold"
            inline-prompt
            @change="handleCheckedTreeExpand"
          />
          Parent-child linkage (when the parent node is selected, the child nodes are automatically selected): 
          <el-switch v-model="checkStrictly" active-text="Yes" inactive-text="No" inline-prompt />
        </template>
        <el-tree
          ref="treeRef"
          :check-strictly="!checkStrictly"
          :data="deptOptions"
          :props="defaultProps"
          default-expand-all
          empty-text="Loading... please wait a moment"
          node-key="id"
          show-checkbox
        />
      </el-card>
    </el-form-item>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import { SystemDataScopeEnum } from '@/utils/constants'
import * as RoleApi from '@/api/system/role'
import * as DeptApi from '@/api/system/dept'
import * as PermissionApi from '@/api/system/permission'

defineOptions({ name: 'SystemRoleDataPermissionForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = reactive({
  id: undefined,
  name: '',
  code: '',
  dataScope: undefined,
  dataScopeDeptIds: []
})
const formRef = ref() // form  Ref
const deptOptions = ref<any[]>([]) // Departmental tree structure
const deptExpand = ref(true) // open/fold
const treeRef = ref() // Menu tree component Ref
const treeNodeAll = ref(false) // Select All/Not selected at all
const checkStrictly = ref(true) // Is it a strict mode，Father and son are not related

/** Open pop-up window */
const open = async (row: RoleApi.RoleVO) => {
  dialogVisible.value = true
  resetForm()
  // Load the Dept list. Note that this must be placed at the front; otherwise, there will be no data nodes for the `setChecked` operation below. 
  deptOptions.value = handleTree(await DeptApi.getSimpleDeptList())
  // Set data
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  formData.dataScope = row.dataScope
  await nextTick()
  // It is necessary to set the selected state after the DOM has been rendered.
  row.dataScopeDeptIds?.forEach((deptId: number): void => {
    treeRef.value.setChecked(deptId, true, false)
  })
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitForm = async () => {
  formLoading.value = true
  try {
    const data = {
      roleId: formData.id,
      dataScope: formData.dataScope,
      dataScopeDeptIds:
        formData.dataScope !== SystemDataScopeEnum.DEPT_CUSTOM
          ? []
          : treeRef.value.getCheckedKeys(false)
    }
    await PermissionApi.assignRoleDataScope(data)
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
  deptExpand.value = true
  checkStrictly.value = true
  // Reset Form 
  formData.value = {
    id: undefined,
    name: '',
    code: '',
    dataScope: undefined,
    dataScopeDeptIds: []
  }
  treeRef.value?.setCheckedNodes([])
  formRef.value?.resetFields()
}

/** Select All/Not selected at all */
const handleCheckedTreeNodeAll = () => {
  treeRef.value.setCheckedNodes(treeNodeAll.value ? deptOptions.value : [])
}

/** open/Fold All */
const handleCheckedTreeExpand = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === deptExpand.value) {
      continue
    }
    nodes[node].expanded = deptExpand.value
  }
}
</script>
