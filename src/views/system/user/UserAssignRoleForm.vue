<template>
  <Dialog v-model="dialogVisible" title="Assign Roles">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" label-width="80px">
      <el-form-item label="Username">
        <el-input v-model="formData.username" :disabled="true" />
      </el-form-item>
      <el-form-item label="Nickname">
        <el-input v-model="formData.nickname" :disabled="true" />
      </el-form-item>
      <el-form-item label="Role">
        <el-select v-model="formData.roleIds" multiple placeholder="Please select a role">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as PermissionApi from '@/api/system/permission'
import * as UserApi from '@/api/system/user'
import * as RoleApi from '@/api/system/role'

defineOptions({ name: 'SystemUserAssignRoleForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  id: -1,
  nickname: '',
  username: '',
  roleIds: []
})
const formRef = ref() // form  Ref
const roleList = ref([] as RoleApi.RoleVO[]) // List of roles

/** Open pop-up window */
const open = async (row: UserApi.UserVO) => {
  dialogVisible.value = true
  resetForm()
  // Set data
  formData.value.id = row.id
  formData.value.username = row.username
  formData.value.nickname = row.nickname
  // Obtain the menu collection owned by the character
  formLoading.value = true
  try {
    formData.value.roleIds = await PermissionApi.getUserRoleList(row.id)
  } finally {
    formLoading.value = false
  }
  // Get a list of roles
  roleList.value = await RoleApi.getSimpleRoleList()
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
    await PermissionApi.assignUserRole({
      userId: formData.value.id,
      roleIds: formData.value.roleIds
    })
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // Event of successful sending operation
    emit('success', true)
  } finally {
    formLoading.value = false
  }
}

/** Reset Form  */
const resetForm = () => {
  formData.value = {
    id: -1,
    nickname: '',
    username: '',
    roleIds: []
  }
  formRef.value?.resetFields()
}
</script>
