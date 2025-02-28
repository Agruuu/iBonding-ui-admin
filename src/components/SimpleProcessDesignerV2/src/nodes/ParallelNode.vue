<template>
  <div class="branch-node-wrapper">
    <div class="branch-node-container">
      <div
        v-if="readonly"
        class="branch-node-readonly"
        :class="`${useTaskStatusClass(currentNode?.activityStatus)}`"
      >
        <span class="iconfont icon-parallel icon-size parallel"></span>
      </div>
      <el-button v-else class="branch-node-add" color="#626aef" @click="addCondition" plain
        >Add Branch</el-button
      >
      <div
        class="branch-node-item"
        v-for="(item, index) in currentNode.conditionNodes"
        :key="index"
      >
        <template v-if="index == 0">
          <div class="branch-line-first-top"></div>
          <div class="branch-line-first-bottom"></div>
        </template>
        <template v-if="index + 1 == currentNode.conditionNodes?.length">
          <div class="branch-line-last-top"></div>
          <div class="branch-line-last-bottom"></div>
        </template>
        <div class="node-wrapper">
          <div class="node-container">
            <div class="node-box" :class="`${useTaskStatusClass(item.activityStatus)}`">
              <div class="branch-node-title-container">
                <div v-if="showInputs[index]">
                  <input
                    type="text"
                    class="input-max-width editable-title-input"
                    @blur="blurEvent(index)"
                    v-mountedFocus
                    v-model="item.name"
                  />
                </div>
                <div v-else class="branch-title" @click="clickEvent(index)"> {{ item.name }} </div>
                <div class="branch-priority">No Priority</div>
              </div>
              <div class="branch-node-content" @click="conditionNodeConfig(item.id)">
                <div class="branch-node-text" :title="item.showText" v-if="item.showText">
                  {{ item.showText }}
                </div>
                <div class="branch-node-text" v-else>
                  {{ NODE_DEFAULT_TEXT.get(NodeType.CONDITION_NODE) }}
                </div>
              </div>
              <div v-if="!readonly" class="node-toolbar">
                <div class="toolbar-icon">
                  <Icon
                    color="#0089ff"
                    icon="ep:circle-close-filled"
                    :size="18"
                    @click="deleteCondition(index)"
                  />
                </div>
              </div>
            </div>
            <NodeHandler v-model:child-node="item.childNode" :current-node="item" />
          </div>
        </div>
        <!-- Recursive display of child nodes  -->
        <ProcessNodeTree
          v-if="item && item.childNode"
          :parent-node="item"
          v-model:flow-node="item.childNode"
          @find:recursive-find-parent-node="recursiveFindParentNode"
        />
      </div>
    </div>
    <NodeHandler
      v-if="currentNode"
      v-model:child-node="currentNode.childNode"
      :current-node="currentNode"
    />
  </div>
</template>

<script setup lang="ts">
import NodeHandler from '../NodeHandler.vue'
import ProcessNodeTree from '../ProcessNodeTree.vue'
import { SimpleFlowNode, NodeType, NODE_DEFAULT_TEXT } from '../consts'
import { useTaskStatusClass } from '../node'
import { generateUUID } from '@/utils'
const { proxy } = getCurrentInstance() as any
defineOptions({
  name: 'ParallelNode'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
// Define events，Update parent component
const emits = defineEmits<{
  'update:modelValue': [node: SimpleFlowNode | undefined]
  'find:parentNode': [nodeList: SimpleFlowNode[], nodeType: number]
  'find:recursiveFindParentNode': [
    nodeList: SimpleFlowNode[],
    curentNode: SimpleFlowNode,
    nodeType: number
  ]
}>()

const currentNode = ref<SimpleFlowNode>(props.flowNode)
// Read only or not
const readonly = inject<Boolean>('readonly')

watch(
  () => props.flowNode,
  (newValue) => {
    currentNode.value = newValue
  }
)

const showInputs = ref<boolean[]>([])
// Losing focus
const blurEvent = (index: number) => {
  showInputs.value[index] = false
  const conditionNode = currentNode.value.conditionNodes?.at(index) as SimpleFlowNode
  conditionNode.name = conditionNode.name || ` Parallel ${index + 1}`
}

// Click on the condition name
const clickEvent = (index: number) => {
  showInputs.value[index] = true
}

const conditionNodeConfig = (nodeId: string) => {
  const conditionNode = proxy.$refs[nodeId][0]
  conditionNode.open()
}

// New conditions added
const addCondition = () => {
  const conditionNodes = currentNode.value.conditionNodes
  if (conditionNodes) {
    const len = conditionNodes.length
    let lastIndex = len - 1
    const conditionData: SimpleFlowNode = {
      id: 'Flow_' + generateUUID(),
      name: 'Parallel ' + len,
      showText: 'No need to configure conditions for simultaneous execution',
      type: NodeType.CONDITION_NODE,
      childNode: undefined,
      conditionNodes: []
    }
    conditionNodes.splice(lastIndex, 0, conditionData)
  }
}

// Delete condition
const deleteCondition = (index: number) => {
  const conditionNodes = currentNode.value.conditionNodes
  if (conditionNodes) {
    conditionNodes.splice(index, 1)
    if (conditionNodes.length == 1) {
      const childNode = currentNode.value.childNode
      // Update this node as a future child node
      emits('update:modelValue', childNode)
    }
  }
}

// Recursive query for matching nodes from the parent node
const recursiveFindParentNode = (
  nodeList: SimpleFlowNode[],
  node: SimpleFlowNode,
  nodeType: number
) => {
  if (!node || node.type === NodeType.START_USER_NODE) {
    return
  }
  if (node.type === nodeType) {
    nodeList.push(node)
  }
  // The conditional node (NodeType.CONDITION_NODE) is quite special. You need to call its parent parallel node (NodeType.PARALLEL_NODE) to continue the search.
  emits('find:parentNode', nodeList, nodeType)
}
</script>
