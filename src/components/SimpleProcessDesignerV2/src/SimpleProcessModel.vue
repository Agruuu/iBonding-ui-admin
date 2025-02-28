<template>
  <div class="simple-process-model-container position-relative">
    <div class="position-absolute top-0px right-0px bg-#fff">
      <el-row type="flex" justify="end">
        <el-button-group key="scale-control" size="default">
          <el-button v-if="!readonly" size="default" @click="exportJson">
            <Icon icon="ep:download" />Export
          </el-button>
          <el-button v-if="!readonly" size="default" @click="importJson">
            <Icon icon="ep:upload" />Import
          </el-button>
          <!-- Used to open local files-->
          <input
            v-if="!readonly"
            type="file"
            id="files"
            ref="refFile"
            style="display: none"
            accept=".json"
            @change="importLocalFile"
          />
          <el-button size="default" :icon="ScaleToOriginal" @click="processReZoom()" />
          <el-button size="default" :plain="true" :icon="ZoomOut" @click="zoomOut()" />
          <el-button size="default" class="w-80px"> {{ scaleValue }}% </el-button>
          <el-button size="default" :plain="true" :icon="ZoomIn" @click="zoomIn()" />
        </el-button-group>
      </el-row>
    </div>
    <div class="simple-process-model" :style="`transform: scale(${scaleValue / 100});`">
      <ProcessNodeTree v-if="processNodeTree" v-model:flow-node="processNodeTree" />
    </div>
  </div>
  <Dialog v-model="errorDialogVisible" title="Save Failed" width="400" :fullscreen="false">
    <div class="mb-2">The following nodes have incomplete content，Please modify and save</div>
    <div
      class="mb-3 b-rounded-1 bg-gray-100 p-2 line-height-normal"
      v-for="(item, index) in errorNodes"
      :key="index"
    >
      {{ item.name }} : {{ NODE_DEFAULT_TEXT.get(item.type) }}
    </div>
    <template #footer>
      <el-button type="primary" @click="errorDialogVisible = false">Got it</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import ProcessNodeTree from './ProcessNodeTree.vue'
import { SimpleFlowNode, NodeType, NODE_DEFAULT_TEXT } from './consts'
import { useWatchNode } from './node'
import { ZoomOut, ZoomIn, ScaleToOriginal } from '@element-plus/icons-vue'
import { isString } from '@/utils/is'
import download from '@/utils/download'

defineOptions({
  name: 'SimpleProcessModel'
})

const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  },
  readonly: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emits = defineEmits<{
  save: [node: SimpleFlowNode | undefined]
}>()

const processNodeTree = useWatchNode(props)

provide('readonly', props.readonly)
let scaleValue = ref(100)
const MAX_SCALE_VALUE = 200
const MIN_SCALE_VALUE = 50

// enlarge
const zoomIn = () => {
  if (scaleValue.value == MAX_SCALE_VALUE) {
    return
  }
  scaleValue.value += 10
}

// narrow
const zoomOut = () => {
  if (scaleValue.value == MIN_SCALE_VALUE) {
    return
  }
  scaleValue.value -= 10
}

const processReZoom = () => {
  scaleValue.value = 100
}

const errorDialogVisible = ref(false)
let errorNodes: SimpleFlowNode[] = []

const saveSimpleFlowModel = async () => {
  errorNodes = []
  validateNode(processNodeTree.value, errorNodes)
  if (errorNodes.length > 0) {
    errorDialogVisible.value = true
    return
  }
  emits('save', processNodeTree.value)
}

// Verify node settings。 Temporarily showText For empty Node not configured incorrectly
const validateNode = (node: SimpleFlowNode | undefined, errorNodes: SimpleFlowNode[]) => {
  if (node) {
    const { type, showText, conditionNodes } = node
    if (type == NodeType.END_EVENT_NODE) {
      return
    }
    if (type == NodeType.START_USER_NODE) {
      // The initiator node does not need to be verified temporarily，Directly verify child nodes
      validateNode(node.childNode, errorNodes)
    }

    if (
      type === NodeType.USER_TASK_NODE ||
      type === NodeType.COPY_TASK_NODE ||
      type === NodeType.CONDITION_NODE
    ) {
      if (!showText) {
        errorNodes.push(node)
      }
      validateNode(node.childNode, errorNodes)
    }

    if (
      type == NodeType.CONDITION_BRANCH_NODE ||
      type == NodeType.PARALLEL_BRANCH_NODE ||
      type == NodeType.INCLUSIVE_BRANCH_NODE
    ) {
      // Branch node
      // 1. Verify each branch first
      conditionNodes?.forEach((item) => {
        validateNode(item, errorNodes)
      })
      // 2. Verify child nodes
      validateNode(node.childNode, errorNodes)
    }
  }
}

/** Retrieve current process data */
const getCurrentFlowData = async () => {
  try {
    errorNodes = []
    validateNode(processNodeTree.value, errorNodes)
    if (errorNodes.length > 0) {
      errorDialogVisible.value = true
      return undefined
    }
    return processNodeTree.value
  } catch (error) {
    console.error('Failed to obtain process data:', error)
    return undefined
  }
}

defineExpose({
  getCurrentFlowData
})

/** Export JSON */
const exportJson = () => {
  download.json(new Blob([JSON.stringify(processNodeTree.value)]), 'model.json')
}

/** Import JSON */
const refFile = ref()
const importJson = () => {
  refFile.value.click()
}
const importLocalFile = () => {
  const file = refFile.value.files[0]
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = function () {
    if (isString(this.result)) {
      processNodeTree.value = JSON.parse(this.result)
      emits('save', processNodeTree.value)
    }
  }
}
</script>

<style lang="scss" scoped></style>
