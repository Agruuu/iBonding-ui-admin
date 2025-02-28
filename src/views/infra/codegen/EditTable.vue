<template>
  <ContentWrap v-loading="formLoading">
    <el-tabs v-model="activeName">
      <el-tab-pane label="Basic Information" name="basicInfo">
        <basic-info-form ref="basicInfoRef" :table="formData.table" />
      </el-tab-pane>
      <el-tab-pane label="Field Information" name="colum">
        <colum-info-form ref="columInfoRef" :columns="formData.columns" />
      </el-tab-pane>
      <el-tab-pane label="Generate Information" name="generateInfo">
        <generate-info-form
          ref="generateInfoRef"
          :table="formData.table"
          :columns="formData.columns"
        />
      </el-tab-pane>
    </el-tabs>
    <el-form>
      <el-form-item style="float: right">
        <el-button :loading="formLoading" type="primary" @click="submitForm">Save</el-button>
        <el-button @click="close">Return</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { useTagsViewStore } from '@/store/modules/tagsView'
import { BasicInfoForm, ColumInfoForm, GenerateInfoForm } from './components'
import * as CodegenApi from '@/api/infra/codegen'

defineOptions({ name: 'InfraCodegenEditTable' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window
const { push, currentRoute } = useRouter() // route
const { query } = useRoute() // Query parameters
const { delView } = useTagsViewStore() // View operation

const formLoading = ref(false) // Form loading in progress：1）Data loading during modification；2）The submit button is disabled
const activeName = ref('colum') // Tag Activated Window
const basicInfoRef = ref<ComponentRef<typeof BasicInfoForm>>()
const columInfoRef = ref<ComponentRef<typeof ColumInfoForm>>()
const generateInfoRef = ref<ComponentRef<typeof GenerateInfoForm>>()
const formData = ref<CodegenApi.CodegenUpdateReqVO>({
  table: {},
  columns: []
})

/** Get Details */
const getDetail = async () => {
  const id = query.id as unknown as number
  if (!id) {
    return
  }
  formLoading.value = true
  try {
    formData.value = await CodegenApi.getCodegenTable(id)
  } finally {
    formLoading.value = false
  }
}

/** Submit button */
const submitForm = async () => {
  // Parameter verification
  if (!unref(formData)) return
  await unref(basicInfoRef)?.validate()
  await unref(generateInfoRef)?.validate()
  try {
    // Submit Request
    await CodegenApi.updateCodegenTable(formData.value)
    message.success(t('common.updateSuccess'))
    close()
  } catch {}
}

/** close button */
const close = () => {
  delView(unref(currentRoute))
  push('/infra/codegen')
}

/** initialization */
onMounted(() => {
  getDetail()
})
</script>
