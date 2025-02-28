<template>
  <Dialog v-model="dialogVisible" title="Upload File">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="uploadUrl"
      :auto-upload="false"
      :data="data"
      :disabled="formLoading"
      :limit="1"
      :on-change="handleFileChange"
      :on-error="submitFormError"
      :on-exceed="handleExceed"
      :on-success="submitFormSuccess"
      :http-request="httpRequest"
      accept=".jpg, .png, .gif"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"> Drag the file here，or <em> Click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip" style="color: red">
          Tips: Only files in JPG, PNG, and GIF formats are allowed to be imported!
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitFileForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { useUpload } from '@/components/UploadFile/src/useUpload'

defineOptions({ name: 'InfraFileForm' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress
const fileList = ref([]) // File List
const data = ref({ path: '' })
const uploadRef = ref()

const { uploadUrl, httpRequest } = useUpload()

/** Open pop-up window */
const open = async () => {
  dialogVisible.value = true
  resetForm()
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Processing changes in uploaded files */
const handleFileChange = (file) => {
  data.value.path = file.name
}

/** Submit Form  */
const submitFileForm = () => {
  if (fileList.value.length == 0) {
    message.error('Please upload the file')
    return
  }
  unref(uploadRef)?.submit()
}

/** File upload successfully processed */
const emit = defineEmits(['success']) // definition success event，Used for callback after successful operation
const submitFormSuccess = () => {
  // clear
  dialogVisible.value = false
  formLoading.value = false
  unref(uploadRef)?.clearFiles()
  // Prompt successful，And refresh
  message.success(t('common.createSuccess'))
  emit('success')
}

/** Upload error prompt */
const submitFormError = (): void => {
  message.error('Upload failed，Please upload again!')
  formLoading.value = false
}

/** Reset Form  */
const resetForm = () => {
  // Reset upload status and files
  formLoading.value = false
  uploadRef.value?.clearFiles()
}

/** Prompt for exceeding the number of files */
const handleExceed = (): void => {
  message.error('You can upload a maximum of one file!')
}
</script>
