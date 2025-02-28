<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="Level name" prop="name">
            <el-input v-model="formData.name" placeholder="Please enter the level name" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Grade" prop="level">
            <el-input-number
              v-model="formData.level"
              :min="0"
              :precision="0"
              placeholder="Please enter the level"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Upgrade Experience" prop="experience">
            <el-input-number
              v-model="formData.experience"
              :min="0"
              :precision="0"
              placeholder="Please enter upgrade experience"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Enjoy discounts(%)" prop="discountPercent">
            <el-input-number
              v-model="formData.discountPercent"
              :min="0"
              :max="100"
              :precision="0"
              placeholder="Please enter to enjoy discounts"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Level icon">
            <UploadImg v-model="formData.icon" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Background image">
            <UploadImg v-model="formData.backgroundUrl" />
          </el-form-item>
        </el-col>
      </el-row>
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
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">Indeed set</el-button>
      <el-button @click="dialogVisible = false">take eliminate</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as LevelApi from '@/api/member/level'
import { CommonStatusEnum } from '@/utils/constants'

/** Membership Level Form **/
defineOptions({ name: 'MemberLevelForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const dialogTitle = ref('') // Title of pop-up window
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formType = ref('') // Type of Form：create - newly added；update - modify
const formData = ref({
  id: undefined,
  name: undefined,
  experience: undefined,
  level: undefined,
  discountPercent: undefined,
  icon: undefined,
  backgroundUrl: undefined,
  status: CommonStatusEnum.ENABLE
})
const formRules = reactive({
  name: [{ required: true, message: 'The level name cannot be empty', trigger: 'blur' }],
  experience: [{ required: true, message: 'Upgrade experience cannot be empty', trigger: 'blur' }],
  level: [{ required: true, message: 'Level cannot be empty', trigger: 'blur' }],
  discountPercent: [{ required: true, message: 'Enjoy discounts cannot be empty', trigger: 'blur' }],
  status: [{ required: true, message: 'The status cannot be empty', trigger: 'change' }]
})
const formRef = ref() // form  Ref

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
      formData.value = await LevelApi.getLevel(id)
    } finally {
      formLoading.value = false
    }
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
    const data = formData.value as unknown as LevelApi.LevelVO
    if (formType.value === 'create') {
      await LevelApi.createLevel(data)
      message.success(t('common.createSuccess'))
    } else {
      await LevelApi.updateLevel(data)
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
    experience: undefined,
    level: undefined,
    discountPercent: undefined,
    icon: undefined,
    backgroundUrl: undefined,
    status: CommonStatusEnum.ENABLE
  }
  formRef.value?.resetFields()
}
</script>
