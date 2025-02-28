<template>
  <div v-if="!disabled" class="upload-file">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="uploadUrl"
      :auto-upload="autoUpload"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :drag="drag"
      :http-request="httpRequest"
      :limit="props.limit"
      :multiple="props.limit > 1"
      :on-error="excelUploadError"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleFileSuccess"
      :show-file-list="true"
      class="upload-file-uploader"
      name="file"
    >
      <el-button type="primary">
        <Icon icon="ep:upload-filled" />
        Select File
      </el-button>
      <template v-if="isShowTip" #tip>
        <div style="font-size: 8px">
          Size not exceeding <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </div>
        <div style="font-size: 8px">
          File in <b style="color: #f56c6c">{{ fileType.join('/') }}</b> Format
        </div>
      </template>
      <template #file="row">
        <div class="flex items-center">
          <span>{{ row.file.name }}</span>
          <div class="ml-10px">
            <el-link
              :href="row.file.url"
              :underline="false"
              download
              target="_blank"
              type="primary"
            >
              Download
            </el-link>
          </div>
          <div class="ml-10px">
            <el-button link type="danger" @click="handleRemove(row.file)"> Delete</el-button>
          </div>
        </div>
      </template>
    </el-upload>
  </div>

  <!-- When upload operation is disabled -->
  <div v-if="disabled" class="upload-file">
    <div v-for="(file, index) in fileList" :key="index" class="flex items-center file-list-item">
      <span>{{ file.name }}</span>
      <div class="ml-10px">
        <el-link :href="file.url" :underline="false" download target="_blank" type="primary">
          Download
        </el-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { isString } from '@/utils/is'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import { UploadFile } from 'element-plus/es/components/upload/src/upload'

defineOptions({ name: 'UploadFile' })

const message = useMessage() // Message pop-up window
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: propTypes.oneOfType<string | string[]>([String, Array<String>]).isRequired,
  fileType: propTypes.array.def(['doc', 'xls', 'ppt', 'txt', 'pdf']), // file type, for example['png', 'jpg', 'jpeg']
  fileSize: propTypes.number.def(5), // Size limit(MB)
  limit: propTypes.number.def(5), // Quantity limit
  autoUpload: propTypes.bool.def(true), // Automatic upload
  drag: propTypes.bool.def(false), // Drag and drop upload
  isShowTip: propTypes.bool.def(true), // Display prompt or not
  disabled: propTypes.bool.def(false) // Do you want to disable uploading components ==> Non essential transmission（Default is false）
})

// ========== Upload related content ==========
const uploadRef = ref<UploadInstance>()
const uploadList = ref<UploadUserFile[]>([])
const fileList = ref<UploadUserFile[]>([])
const uploadNumber = ref<number>(0)

const { uploadUrl, httpRequest } = useUpload()

// Judging before file upload
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  if (fileList.value.length >= props.limit) {
    message.error(`The number of uploaded files cannot exceed ${props.limit}!`)
    return false
  }
  let fileExtension = ''
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }
  const isImg = props.fileType.some((type: string) => {
    if (file.type.indexOf(type) > -1) return true
    return !!(fileExtension && fileExtension.indexOf(type) > -1)
  })
  const isLimit = file.size < props.fileSize * 1024 * 1024
  if (!isImg) {
    message.error(`The file format is incorrect, Please upload ${props.fileType.join('/')} format!`)
    return false
  }
  if (!isLimit) {
    message.error(`The size of the uploaded file cannot exceed ${props.fileSize}MB!`)
    return false
  }
  message.success('Uploading files，please wait a moment...')
  uploadNumber.value++
}
// Processing changes in uploaded files
// const handleFileChange = (uploadFile: UploadFile): void => {
//   uploadRef.value.data.path = uploadFile.name
// }
// File uploaded successfully
const handleFileSuccess: UploadProps['onSuccess'] = (res: any): void => {
  message.success('Upload Successful')
  // Delete oneself
  const index = fileList.value.findIndex((item) => item.response?.data === res.data)
  fileList.value.splice(index, 1)
  uploadList.value.push({ name: res.data, url: res.data })
  if (uploadList.value.length == uploadNumber.value) {
    fileList.value.push(...uploadList.value)
    uploadList.value = []
    uploadNumber.value = 0
    emitUpdateModelValue()
  }
}
// Prompt for exceeding the number of files
const handleExceed: UploadProps['onExceed'] = (): void => {
  message.error(`The number of uploaded files cannot exceed ${props.limit}!`)
}
// Upload error prompt
const excelUploadError: UploadProps['onError'] = (): void => {
  message.error('Import data failed，Please upload again!')
}
// Delete uploaded files
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.map((f) => f.name).indexOf(file.name)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emitUpdateModelValue()
  }
}
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

// Monitor changes in model binding values
watch(
  () => props.modelValue,
  (val: string | string[]) => {
    if (!val) {
      fileList.value = [] // fix：Dispose of cache，The content of the uploaded component was not reset after the form was reset
      return
    }

    fileList.value = [] // Ensure data is empty
    // situation1：character string
    if (isString(val)) {
      fileList.value.push(
        ...val.split(',').map((url) => ({ name: url.substring(url.lastIndexOf('/') + 1), url }))
      )
      return
    }
    // situation2：array
    fileList.value.push(
      ...(val as string[]).map((url) => ({ name: url.substring(url.lastIndexOf('/') + 1), url }))
    )
  },
  { immediate: true, deep: true }
)
// Send file link list update
const emitUpdateModelValue = () => {
  // situation1：Array result
  let result: string | string[] = fileList.value.map((file) => file.url!)
  // situation2：Comma separated string
  if (props.limit === 1 || isString(props.modelValue)) {
    result = result.join(',')
  }
  emit('update:modelValue', result)
}
</script>
<style lang="scss" scoped>
.upload-file-uploader {
  margin-bottom: 5px;
}

:deep(.upload-file-list .el-upload-list__item) {
  position: relative;
  margin-bottom: 10px;
  line-height: 2;
  border: 1px solid #e4e7ed;
}

:deep(.el-upload-list__item-file-name) {
  max-width: 250px;
}

:deep(.upload-file-list .ele-upload-list__item-content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

:deep(.ele-upload-list__item-content-action .el-link) {
  margin-right: 10px;
}

.file-list-item {
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 8px;
}
</style>
