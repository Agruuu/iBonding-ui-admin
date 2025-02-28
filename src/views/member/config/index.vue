<template>
  <ContentWrap>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="hideId" v-show="false">
        <el-input v-model="formData.id" />
      </el-form-item>

      <el-tabs>
        <el-tab-pane label="integral">
          <el-form-item label="Points deduction" prop="pointTradeDeductEnable">
            <el-switch v-model="formData.pointTradeDeductEnable" style="user-select: none" />
            <el-text class="w-full" size="small" type="info">Is the order credit used to offset the order amount</el-text>
          </el-form-item>
          <el-form-item label="Points deduction" prop="pointTradeDeductUnitPrice">
            <el-input-number
              v-model="computedPointTradeDeductUnitPrice"
              placeholder="Please enter the deduction amount for points"
              :precision="2"
            />
            <el-text class="w-full" size="small" type="info">
              Credit deduction ratio(1 How much is the deduction amount for points)，Company：element
            </el-text>
          </el-form-item>
          <el-form-item label="Maximum deduction of points" prop="pointTradeDeductMaxPrice">
            <el-input-number
              v-model="formData.pointTradeDeductMaxPrice"
              placeholder="Please enter the maximum value for point deduction"
            />
            <el-text class="w-full" size="small" type="info">
              Maximum usage limit for single order points，0 Unrestricted
            </el-text>
          </el-form-item>
          <el-form-item label="1 How many points do you give away with yuan" prop="pointTradeGivePoint">
            <el-input-number
              v-model="formData.pointTradeGivePoint"
              placeholder="Please enter 1 How many points will be given as a gift for yuan"
            />
            <el-text class="w-full" size="small" type="info">
              Order payment amount will be rewarded with points proportionally（Actual payment 1 How many points will be given as a gift for yuan）
            </el-text>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">preservation</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>
<script lang="ts" setup>
import * as ConfigApi from '@/api/member/config'

defineOptions({ name: 'MemberConfig' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const formData = ref({
  id: undefined,
  pointTradeDeductEnable: true,
  pointTradeDeductUnitPrice: 0,
  pointTradeDeductMaxPrice: 0,
  pointTradeGivePoint: 0
})

// Create a calculation attribute，Used to apply pointTradeDeductUnitPrice Display as a form with two decimal places
const computedPointTradeDeductUnitPrice = computed({
  get: () => (formData.value.pointTradeDeductUnitPrice / 100).toFixed(2),
  set: (newValue: number) => {
    formData.value.pointTradeDeductUnitPrice = Math.round(newValue * 100)
  }
})

const formRules = reactive({})
const formRef = ref() // form  Ref

/** Modify points configuration */
const onSubmit = async () => {
  // validate form 
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // Submit Request
  formLoading.value = true
  try {
    const data = formData.value as unknown as ConfigApi.ConfigVO
    await ConfigApi.saveConfig(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** Get points configuration */
const getConfig = async () => {
  try {
    const data = await ConfigApi.getConfig()
    if (data === null) {
      return
    }
    formData.value = data
  } finally {
  }
}

onMounted(() => {
  getConfig()
})
</script>
