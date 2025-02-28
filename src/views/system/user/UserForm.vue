<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="Nickname" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="Please enter user nickname" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Belong Department" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              :data="deptList"
              :props="defaultProps"
              check-strictly
              node-key="id"
              placeholder="Please select the department to which you belong"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Mobile" prop="mobile">
            <el-input v-model="formData.mobile" maxlength="11" placeholder="Please enter your phone number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input v-model="formData.email" maxlength="50" placeholder="Please enter your email address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="formData.id === undefined" label="Username" prop="username">
            <el-input v-model="formData.username" placeholder="Please enter the username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="formData.id === undefined" label="Password" prop="password">
            <el-input
              v-model="formData.password"
              placeholder="Please enter the user password"
              show-password
              type="password"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Gender">
            <el-select v-model="formData.sex" placeholder="Please choose">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Post">
            <el-select v-model="formData.postIds" multiple placeholder="Please choose">
              <el-option
                v-for="item in postList"
                :key="item.id"
                :label="item.name"
                :value="item.id!"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="Remarks">
            <el-input v-model="formData.remark" placeholder="Please enter the remark" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import { defaultProps, handleTree } from '@/utils/tree'
import * as PostApi from '@/api/system/post'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import { FormRules } from 'element-plus'

defineOptions({ name: 'SystemUserForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  nickname: '',
  deptId: '',
  mobile: '',
  email: '',
  id: undefined,
  username: '',
  password: '',
  sex: undefined,
  postIds: [],
  remark: '',
  status: CommonStatusEnum.ENABLE,
  roleIds: []
})
const formRules = reactive<FormRules>({
  username: [{ required: true, message: 'Username cannot be empty', trigger: 'blur' }],
  nickname: [{ required: true, message: 'User nickname cannot be empty', trigger: 'blur' }],
  password: [{ required: true, message: 'User password cannot be empty', trigger: 'blur' }],
  email: [
    {
      type: 'email',
      message: 'Please enter the correct email address',
      trigger: ['blur', 'change']
    }
  ],
  mobile: [
    {
      pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
      message: 'Please enter the correct phone number',
      trigger: 'blur'
    }
  ]
})
const formRef = ref() // form  Ref
const deptList = ref<Tree[]>([]) // tree structure
const postList = ref([] as PostApi.PostVO[]) // Job List

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
      formData.value = await UserApi.getUser(id)
    } finally {
      formLoading.value = false
    }
  }
  // Load department tree
  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
  // Load job list
  postList.value = await PostApi.getSimplePostList()
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
    const data = formData.value as unknown as UserApi.UserVO
    if (formType.value === 'create') {
      await UserApi.createUser(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserApi.updateUser(data)
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
    nickname: '',
    deptId: '',
    mobile: '',
    email: '',
    id: undefined,
    username: '',
    password: '',
    sex: undefined,
    postIds: [],
    remark: '',
    status: CommonStatusEnum.ENABLE,
    roleIds: []
  }
  formRef.value?.resetFields()
}
</script>
