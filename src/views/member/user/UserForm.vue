<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="cell-phone number" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="Please enter your phone number" />
      </el-form-item>
      <el-form-item label="state" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="User nickname" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="Please enter user nickname" />
      </el-form-item>
      <el-form-item label="head portrait" prop="avatar">
        <UploadImg v-model="formData.avatar" :limit="1" :is-show-tip="false" />
      </el-form-item>
      <el-form-item label="Real name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter your real name" />
      </el-form-item>
      <el-form-item label="User gender" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Date of Birth:" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          value-format="x"
          placeholder="Select date of birth"
        />
      </el-form-item>
      <el-form-item label="Location:" prop="areaId">
        <el-tree-select
          v-model="formData.areaId"
          :data="areaList"
          :props="defaultProps"
          :render-after-expand="true"
        />
      </el-form-item>
      <el-form-item label="User tags" prop="tagIds">
        <MemberTagSelect v-model="formData.tagIds" show-add />
      </el-form-item>
      <el-form-item label="User grouping" prop="groupId">
        <MemberGroupSelect v-model="formData.groupId" />
      </el-form-item>
      <el-form-item label="Member Remarks" prop="mark">
        <el-input type="textarea" v-model="formData.mark" placeholder="Please enter member remarks" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Indeed set</el-button>
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as UserApi from '@/api/member/user'
import * as AreaApi from '@/api/system/area'
import { defaultProps } from '@/utils/tree'
import MemberTagSelect from '@/views/member/tag/components/MemberTagSelect.vue'
import MemberGroupSelect from '@/views/member/group/components/MemberGroupSelect.vue'

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  mobile: undefined,
  password: undefined,
  status: undefined,
  nickname: undefined,
  avatar: undefined,
  name: undefined,
  sex: undefined,
  areaId: undefined,
  birthday: undefined,
  mark: undefined,
  tagIds: [],
  groupId: undefined
})
const formRules = reactive({
  mobile: [{ required: true, message: 'The phone number cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'blur' }]
})
const formRef = ref() // form  Ref
const areaList = ref([]) // Regional List

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
  // Obtain a list of regions
  areaList.value = await AreaApi.getAreaTree()
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
      // explain：There are currently no new operations added。If necessary for one's own business needs，Can be expanded
      // await UserApi.createUser(data)
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
    id: undefined,
    mobile: undefined,
    password: undefined,
    status: undefined,
    nickname: undefined,
    avatar: undefined,
    name: undefined,
    sex: undefined,
    areaId: undefined,
    birthday: undefined,
    mark: undefined,
    tagIds: [],
    groupId: undefined
  }
  formRef.value?.resetFields()
}
</script>
