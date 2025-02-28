<script lang="ts" setup>
import { PropType } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage, IDomEditor, IEditorConfig } from '@wangeditor/editor'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'
import { ElMessage } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { getRefreshToken } from '@/utils/auth'
import { getUploadUrl } from '@/components/UploadFile/src/useUpload'

defineOptions({ name: 'Editor' })

type InsertFnType = (url: string, alt: string, href: string) => void

const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.getCurrentLocale)

i18nChangeLanguage(unref(currentLocale).lang)

const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]).def('500px'),
  editorConfig: {
    type: Object as PropType<Partial<IEditorConfig>>,
    default: () => undefined
  },
  readonly: propTypes.bool.def(false),
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['change', 'update:modelValue'])

// Editor instance，Must be used shallowRef
const editorRef = shallowRef<IDomEditor>()

const valueHtml = ref('')

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)

// monitor
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// Editor configuration
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      placeholder: 'Please enter the content...',
      readOnly: props.readonly,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      MENU_CONF: {
        ['uploadImage']: {
          server: getUploadUrl(),
          // Maximum size limit for a single file，Default is 2M
          maxFileSize: 5 * 1024 * 1024,
          // Up to a few files can be uploaded，Default is 100
          maxNumberOfFiles: 10,
          // Type restrictions when selecting files，Default is ['image/*']. If you don't want to restrict，Then set it as []
          allowedFileTypes: ['image/*'],

          // Custom addition http  header
          headers: {
            Accept: '*',
            Authorization: 'Bearer ' + getRefreshToken() // The reason for using the getRefreshToken() method instead of the getAccessToken() method is that the Editor cannot easily refresh the access token.
          },

          // Timeout period，Default is 10 second
          timeout: 5 * 1000, // 5 second

          // form-data fieldName，Backend interface parameter name，Default value wangeditor-uploaded-image
          fieldName: 'file',

          // Triggered before uploading
          onBeforeUpload(file: File) {
            // console.log(file)
            return file
          },
          // The callback function for uploading progress
          onProgress(progress: number) {
            // progress It is a number ranging from 0 to 100.
            console.log('progress', progress)
          },
          onSuccess(file: File, res: any) {
            console.log('onSuccess', file, res)
          },
          onFailed(file: File, res: any) {
            alert(res.message)
            console.log('onFailed', file, res)
          },
          onError(file: File, err: any, res: any) {
            alert(err.message)
            console.error('onError', file, err, res)
          },
          // Customize image insertion
          customInsert(res: any, insertFn: InsertFnType) {
            insertFn(res.data, 'image', res.data)
          }
        },
        ['uploadVideo']: {
          server: getUploadUrl(),
          // Maximum size limit for a single file，Default is 10M
          maxFileSize: 10 * 1024 * 1024,
          // Up to a few files can be uploaded，Default is 100
          maxNumberOfFiles: 10,
          // Type restrictions when selecting files，Default is ['video/*'] 。If you don't want to restrict，Then set it as []
          allowedFileTypes: ['video/*'],

          // Custom addition http  header
          headers: {
            Accept: '*',
            Authorization: 'Bearer ' + getRefreshToken() // The reason for using the getRefreshToken() method instead of the getAccessToken() method is that the Editor can't conveniently refresh the access token.
          },

          // Timeout period，Default is 30 second
          timeout: 15 * 1000, // 15 second

          // form-data fieldName，Backend interface parameter name，Default value wangeditor-uploaded-image
          fieldName: 'file',

          // Triggered before uploading
          onBeforeUpload(file: File) {
            // console.log(file)
            return file
          },
          // The callback function for uploading progress
          onProgress(progress: number) {
            // progress It is a number ranging from 0 to 100.
            console.log('progress', progress)
          },
          onSuccess(file: File, res: any) {
            console.log('onSuccess', file, res)
          },
          onFailed(file: File, res: any) {
            alert(res.message)
            console.log('onFailed', file, res)
          },
          onError(file: File, err: any, res: any) {
            alert(err.message)
            console.error('onError', file, err, res)
          },
          // Customize image insertion
          customInsert(res: any, insertFn: InsertFnType) {
            insertFn(res.data, 'mp4', res.data)
          }
        }
      },
      uploadImgShowBase64: true
    },
    props.editorConfig || {}
  )
})

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height
  }
})

// Callback function
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

// When destroying components，Timely destroy the editor
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)

  // Destruction，And remove it editor
  editor?.destroy()
})

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}

defineExpose({
  getEditorRef
})
</script>

<template>
  <div class="border-1 border-solid border-[var(--tags-view-border-color)] z-10">
    <!-- toolbar -->
    <Toolbar
      :editor="editorRef"
      :editorId="editorId"
      class="border-0 b-b-1 border-solid border-[var(--tags-view-border-color)]"
    />
    <!-- editor  -->
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :editorId="editorId"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
