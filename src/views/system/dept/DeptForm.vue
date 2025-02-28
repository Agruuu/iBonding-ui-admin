<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="Parent Department" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="deptTree"
          :props="defaultProps"
          check-strictly
          default-expand-all
          placeholder="Please select the parent department"
          value-key="deptId"
        />
      </el-form-item>
      <el-form-item label="Department Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter the department name" />
      </el-form-item>
      <el-form-item label="Display Sorting" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="Leader" prop="leaderUserId">
        <el-select v-model="formData.leaderUserId" clearable placeholder="Please enter the leader">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="formData.phone" maxlength="11" placeholder="Please enter your contact phone number" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="formData.email" maxlength="50" placeholder="Please enter your email address" />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select v-model="formData.status" clearable placeholder="Please select the status">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import { CommonStatusEnum } from '@/utils/constants'
import { FormRules } from 'element-plus'

defineOptions({ name: 'SystemDeptForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  title: '',
  parentId: undefined,
  name: undefined,
  sort: undefined,
  leaderUserId: undefined,
  phone: undefined,
  email: undefined,
  status: CommonStatusEnum.ENABLE
})
const formRules = reactive<FormRules>({
  parentId: [{ required: true, message: 'The parent department cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Department name cannot be empty', trigger: 'blur' }],
  sort: [{ required: true, message: 'Display sort cannot be empty', trigger: 'blur' }],
  email: [{ type: 'email', message: 'Please enter the correct email address', trigger: ['blur', 'change'] }],
  phone: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: 'Please enter the correct phone number', trigger: 'blur' }
  ],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref
const deptTree = ref() // tree structure
const userList = ref<UserApi.UserVO[]>([]) // User List

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
      formData.value = await DeptApi.getDept(id)
    } finally {
      formLoading.value = false
    }
  }
  // Obtain user list
  userList.value = await UserApi.getSimpleUserList()
  // Obtain department tree
  await getTree()
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
    const data = formData.value as unknown as DeptApi.DeptVO
    if (formType.value === 'create') {
      await DeptApi.createDept(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeptApi.updateDept(data)
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
    title: '',
    parentId: undefined,
    name: undefined,
    sort: undefined,
    leaderUserId: undefined,
    phone: undefined,
    email: undefined,
    status: CommonStatusEnum.ENABLE
  }
  formRef.value?.resetFields()
}

/** Obtain department tree */
const getTree = async () => {
  deptTree.value = []
  const data = await DeptApi.getSimpleDeptList()
  let dept: Tree = { id: 0, name: 'Top Department', children: [] }
  dept.children = handleTree(data)
  deptTree.value.push(dept)
}
</script>
