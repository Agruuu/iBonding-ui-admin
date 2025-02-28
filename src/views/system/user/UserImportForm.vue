<template>
  <Dialog v-model="dialogVisible" title="User Import" width="400">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="importUrl + '?updateSupport=' + updateSupport"
      :auto-upload="false"
      :disabled="formLoading"
      :headers="uploadHeaders"
      :limit="1"
      :on-error="submitFormError"
      :on-exceed="handleExceed"
      :on-success="submitFormSuccess"
      accept=".xlsx, .xls"
      drag
    >
      <Icon icon="ep:upload" />
      <div class="el-upload__text">Drag the file here，or<em>Click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip">
            <el-checkbox v-model="updateSupport" />
            Do you want to update existing user data
          </div>
          <span>Only files in xls, xlsx formats are allowed to be imported.</span>
          <el-link
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            type="primary"
            @click="importTemplate"
          >
            Download Template
          </el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as UserApi from '@/api/system/user'
import { getAccessToken } from '@/utils/auth'
import download from '@/utils/download'

defineOptions({ name: 'SystemUserImportForm' })

const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const formLoading = ref(false) // Form loading in progress
const uploadRef = ref()
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/system/user/import'
const uploadHeaders = ref() // upload Header head
const fileList = ref([]) // File List
const updateSupport = ref(0) // Do you want to update existing user data

/** Open pop-up window */
const open = () => {
  dialogVisible.value = true
  updateSupport.value = 0
  fileList.value = []
  resetForm()
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** Submit Form  */
const submitForm = async () => {
  if (fileList.value.length == 0) {
    message.error('Please upload the file')
    return
  }
  // Submit Request
  uploadHeaders.value = {
    Authorization: 'Bearer ' + getAccessToken()
  }
  formLoading.value = true
  uploadRef.value!.submit()
}

/** File uploaded successfully */
const emits = defineEmits(['success'])
const submitFormSuccess = (response: any) => {
  if (response.code !== 0) {
    message.error(response.msg)
    formLoading.value = false
    return
  }
  // Splicing prompts
  const data = response.data
  let text = 'Number of successful uploads: ' + data.createUsernames.length + ';'
  for (let username of data.createUsernames) {
    text += '< ' + username + ' >'
  }
  text += 'Number of successful updates: ' + data.updateUsernames.length + ';'
  for (const username of data.updateUsernames) {
    text += '< ' + username + ' >'
  }
  text += 'Number of failed updates: ' + Object.keys(data.failureUsernames).length + ';'
  for (const username in data.failureUsernames) {
    text += '< ' + username + ': ' + data.failureUsernames[username] + ' >'
  }
  message.alert(text)
  formLoading.value = false
  dialogVisible.value = false
  // Event of successful sending operation
  emits('success')
}

/** Upload error prompt */
const submitFormError = (): void => {
  message.error('Upload failed，Please upload again!')
  formLoading.value = false
}

/** Reset Form  */
const resetForm = async (): Promise<void> => {
  // Reset upload status and files
  formLoading.value = false
  await nextTick()
  uploadRef.value?.clearFiles()
}

/** Prompt for exceeding the number of files */
const handleExceed = (): void => {
  message.error('You can only upload a maximum of one file!')
}

/** Download Template Operation */
const importTemplate = async () => {
  const res = await UserApi.importUserTemplate()
  download.excel(res, 'User import template.xls')
}
</script>
