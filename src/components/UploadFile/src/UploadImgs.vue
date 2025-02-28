<template>
  <div class="upload-box">
    <el-upload
      v-model:file-list="fileList"
      :accept="fileType.join(',')"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :class="['upload', drag ? 'no-border' : '']"
      :disabled="disabled"
      :drag="drag"
      :http-request="httpRequest"
      :limit="limit"
      :multiple="true"
      :on-error="uploadError"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      list-type="picture-card"
    >
      <div class="upload-empty">
        <slot name="empty">
          <Icon icon="ep:plus" />
          <!-- <span>Please Upload Image</span> -->
        </slot>
      </div>
      <template #file="{ file }">
        <img :src="file.url" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <div class="handle-icon" @click="imagePreview(file.url!)">
            <Icon icon="ep:zoom-in" />
            <span>Preview</span>
          </div>
          <div v-if="!disabled" class="handle-icon" @click="handleRemove(file)">
            <Icon icon="ep:delete" />
            <span>Delete</span>
          </div>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { UploadFile, UploadProps, UploadUserFile } from 'element-plus'
import { ElNotification } from 'element-plus'
import { createImageViewer } from '@/components/ImageViewer'

import { propTypes } from '@/utils/propTypes'
import { useUpload } from '@/components/UploadFile/src/useUpload'

defineOptions({ name: 'UploadImgs' })

const message = useMessage() // Message pop-up window
// view picture
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [imgUrl]
  })
}

type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'

const props = defineProps({
  modelValue: propTypes.oneOfType<string | string[]>([String, Array<String>]).isRequired,
  drag: propTypes.bool.def(true), // Does it support drag and drop upload ==> Non essential transmission（Default is true）
  disabled: propTypes.bool.def(false), // Do you want to disable uploading components ==> Non essential transmission（Default is false）
  limit: propTypes.number.def(5), // Maximum number of image uploads ==> Non essential transmission（Default is 5Zhang）
  fileSize: propTypes.number.def(5), // Image size limit ==> Non essential transmission（Default is 5M）
  fileType: propTypes.array.def(['image/jpeg', 'image/png', 'image/gif']), // Image type restrictions ==> Non essential transmission（Default is ["image/jpeg", "image/png", "image/gif"]）
  height: propTypes.string.def('150px'), // Component height ==> Non essential transmission（Default is 150px）
  width: propTypes.string.def('150px'), // Component width ==> Non essential transmission（Default is 150px）
  borderradius: propTypes.string.def('8px') // Component border rounded corners ==> Non essential transmission（Default is 8px）
})

const { uploadUrl, httpRequest } = useUpload()

const fileList = ref<UploadUserFile[]>([])
const uploadNumber = ref<number>(0)
const uploadList = ref<UploadUserFile[]>([])
/**
 * @description Judging before file upload
 * @param rawFile Upload files
 * */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(rawFile.type as FileTypes))
    ElNotification({
      title: 'Reminder',
      message: 'The uploaded image does not conform to the required format!',
      type: 'warning'
    })
  if (!imgSize)
    ElNotification({
      title: 'Reminder',
      message: `The size of the uploaded image cannot exceed ${props.fileSize}M！`,
      type: 'warning'
    })
  uploadNumber.value++
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

// Picture uploaded successfully
interface UploadEmits {
  (e: 'update:modelValue', value: string[]): void
}

const emit = defineEmits<UploadEmits>()
const uploadSuccess: UploadProps['onSuccess'] = (res: any): void => {
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

// Monitor changes in model binding values
watch(
  () => props.modelValue,
  (val: string | string[]) => {
    if (!val) {
      fileList.value = [] // fix：Dispose of cache，The content of the uploaded component was not reset after the form was reset
      return
    }

    fileList.value = [] // Ensure data is empty
    fileList.value.push(
      ...(val as string[]).map((url) => ({ name: url.substring(url.lastIndexOf('/') + 1), url }))
    )
  },
  { immediate: true, deep: true }
)
// Send image link list update
const emitUpdateModelValue = () => {
  let result: string[] = fileList.value.map((file) => file.url!)
  emit('update:modelValue', result)
}
// Delete image
const handleRemove = (uploadFile: UploadFile) => {
  fileList.value = fileList.value.filter(
    (item) => item.url !== uploadFile.url || item.name !== uploadFile.name
  )
  emit(
    'update:modelValue',
    fileList.value.map((file) => file.url!)
  )
}

// Image upload error prompt
const uploadError = () => {
  ElNotification({
    title: 'Reminder',
    message: 'Image upload failed，Please upload again!',
    type: 'error'
  })
}

// Prompt for exceeding the number of files
const handleExceed = () => {
  ElNotification({
    title: 'Reminder',
    message: `Currently, only uploads are allowed at most ${props.limit} pictures，Please remove and upload！`,
    type: 'warning'
  })
}
</script>

<style lang="scss" scoped>
.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);

    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderradius);

      &:hover {
        border: 1px dashed var(--el-color-primary);
      }
    }

    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderradius);
    }

    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      transition: var(--el-transition-duration-fast);
      align-items: center;
      justify-content: center;

      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;

        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }

        span {
          font-size: 100%;
        }
      }
    }

    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }

    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);

      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .el-upload__tip {
    line-height: 15px;
    text-align: center;
  }
}
</style>
