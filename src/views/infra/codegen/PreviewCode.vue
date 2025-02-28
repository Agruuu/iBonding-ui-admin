<template>
  <Dialog
    v-model="dialogVisible"
    align-center
    class="app-infra-codegen-preview-container"
    title="Code Preview"
    width="80%"
  >
    <div class="flex">
      <!-- Code directory tree -->
      <el-card
        v-loading="loading"
        :gutter="12"
        class="w-1/3"
        element-loading-text="Generate file directory..."
        shadow="hover"
      >
        <el-scrollbar height="calc(100vh - 88px - 40px)">
          <el-tree
            ref="treeRef"
            :data="preview.fileTree"
            :expand-on-click-node="false"
            default-expand-all
            highlight-current
            node-key="id"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </el-card>
      <!-- code -->
      <el-card
        v-loading="loading"
        :gutter="12"
        class="ml-3 w-2/3"
        element-loading-text="Loading code..."
        shadow="hover"
      >
        <el-tabs v-model="preview.activeName">
          <el-tab-pane
            v-for="item in previewCodegen"
            :key="item.filePath"
            :label="item.filePath.substring(item.filePath.lastIndexOf('/') + 1)"
            :name="item.filePath"
          >
            <el-button class="float-right" text type="primary" @click="copy(item.code)">
              {{ t('common.copy') }}
            </el-button>
            <el-scrollbar height="600px">
              <pre><code v-dompurify-html="highlightedCode(item)" class="hljs"></code></pre>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import { handleTree2 } from '@/utils/tree'
import * as CodegenApi from '@/api/infra/codegen'

import hljs from 'highlight.js' // Import code highlight file
import 'highlight.js/styles/github.css' // Import code highlight style
import java from 'highlight.js/lib/languages/java'
import xml from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'

defineOptions({ name: 'InfraCodegenPreviewCode' })

const { t } = useI18n() // internationalization
const message = useMessage() // Message pop-up window

const dialogVisible = ref(false) // Is the pop-up displayed
const loading = ref(false) // Loading status
const preview = reactive({
  fileTree: [], // File Tree
  activeName: '' // Activated file name
})
const previewCodegen = ref<CodegenApi.CodegenPreviewVO[]>()

/** Click on the file */
const handleNodeClick = async (data, node) => {
  if (node && !node.isLeaf) {
    return false
  }
  preview.activeName = data.id
}

/** generate files catalogue **/
interface filesType {
  id: string
  label: string
  parentId: string
}

/** Open pop-up window */
const open = async (id: number) => {
  dialogVisible.value = true
  try {
    loading.value = true
    // Generate code
    const data = await CodegenApi.previewCodegen(id)
    previewCodegen.value = data
    // process the file
    let file = handleFiles(data)
    preview.fileTree = handleTree2(file, 'id', 'parentId', 'children', '/')
    // Click on the first file
    preview.activeName = data[0].filePath
  } finally {
    loading.value = false
  }
}
defineExpose({ open }) // provide open method，Used to open pop ups

/** process the file */
const handleFiles = (datas: CodegenApi.CodegenPreviewVO[]) => {
  let exists = {} // key： id of file；value：true
  let files: filesType[] = []
  // Traverse each element
  for (const data of datas) {
    let paths = data.filePath.split('/')
    let fullPath = '' // The path from scratch，Used for generating id
    // Special treatment java file
    if (paths[paths.length - 1].indexOf('.java') >= 0) {
      let newPaths: string[] = []
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i]
        if (path !== 'java') {
          newPaths.push(path)
          continue
        }
        newPaths.push(path)
        // Special processing in between package，Merge
        let tmp = ''
        while (i < paths.length) {
          path = paths[i + 1]
          if (
            path === 'controller' ||
            path === 'convert' ||
            path === 'dal' ||
            path === 'enums' ||
            path === 'service' ||
            path === 'vo' || // Below are three，Mainly to provide a safety net。Perhaps considering that someone has changed the package structure
            path === 'mysql' ||
            path === 'dataobject'
          ) {
            break
          }
          tmp = tmp ? tmp + '.' + path : path
          i++
        }
        if (tmp) {
          newPaths.push(tmp)
        }
      }
      paths = newPaths
    }
    // Traverse each one path， Assemble into a tree
    for (let i = 0; i < paths.length; i++) {
      // Already added to files，Then skip it
      let oldFullPath = fullPath
      // The reason for using `replaceAll` below is that after the package processing above, it doesn't match the `tabs`, so we use `replaceAll` to handle it.
      fullPath = fullPath.length === 0 ? paths[i] : fullPath.replaceAll('.', '/') + '/' + paths[i]
      if (exists[fullPath]) {
        continue
      }
      // Add to files
      exists[fullPath] = true
      files.push({
        id: fullPath,
        label: paths[i],
        parentId: oldFullPath || '/' // "/" the root node
      })
    }
  }
  return files
}

/** copy **/
const copy = async (text: string) => {
  const { copy, copied, isSupported } = useClipboard({ source: text })
  if (!isSupported) {
    message.error(t('common.copyError'))
    return
  }
  await copy()
  if (unref(copied)) {
    message.success(t('common.copySuccess'))
  }
}

/**
 * Code highlighting 
 */
const highlightedCode = (item) => {
  const language = item.filePath.substring(item.filePath.lastIndexOf('.') + 1)
  const result = hljs.highlight(language, item.code || '', true)
  return result.value || '&nbsp;'
}

/** initialization **/
onMounted(async () => {
  // Various languages with highlighted registration codes
  hljs.registerLanguage('java', java)
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('html', xml)
  hljs.registerLanguage('vue', xml)
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('sql', sql)
  hljs.registerLanguage('typescript', typescript)
})
</script>
<style lang="scss">
.app-infra-codegen-preview-container {
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    display: inline-block;
    white-space: nowrap;
  }
}
</style>
