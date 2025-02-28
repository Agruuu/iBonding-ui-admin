<template>
  <!-- Initiator Node -->
  <StartUserNode
    v-if="currentNode && currentNode.type === NodeType.START_USER_NODE"
    :flow-node="currentNode"
  />
  <!-- Approval Node -->
  <UserTaskNode
    v-if="currentNode && currentNode.type === NodeType.USER_TASK_NODE"
    :flow-node="currentNode"
    @update:flow-node="handleModelValueUpdate"
    @find:parent-node="findFromParentNode"
  />
  <!-- CC Node -->
  <CopyTaskNode
    v-if="currentNode && currentNode.type === NodeType.COPY_TASK_NODE"
    :flow-node="currentNode"
    @update:flow-node="handleModelValueUpdate"
  />
  <!-- Conditional nodes -->
  <ExclusiveNode
    v-if="currentNode && currentNode.type === NodeType.CONDITION_BRANCH_NODE"
    :flow-node="currentNode"
    @update:model-value="handleModelValueUpdate"
    @find:parent-node="findFromParentNode"
  />
  <!-- Parallel nodes -->
  <ParallelNode
    v-if="currentNode && currentNode.type === NodeType.PARALLEL_BRANCH_NODE"
    :flow-node="currentNode"
    @update:model-value="handleModelValueUpdate"
    @find:parent-node="findFromParentNode"
  />
  <!-- Inclusive branch nodes -->
  <InclusiveNode
    v-if="currentNode && currentNode.type === NodeType.INCLUSIVE_BRANCH_NODE"
    :flow-node="currentNode"
    @update:model-value="handleModelValueUpdate"
    @find:parent-node="findFromParentNode"
  />
  <!-- Delay node -->
  <DelayTimerNode
    v-if="currentNode && currentNode.type === NodeType.DELAY_TIMER_NODE"
    :flow-node="currentNode"
    @update:flow-node="handleModelValueUpdate"
  />
  <!-- Routing branch node -->
  <RouterNode
    v-if="currentNode && currentNode.type === NodeType.ROUTER_BRANCH_NODE"
    :flow-node="currentNode"
    @update:flow-node="handleModelValueUpdate"
  />
   <!-- Trigger node -->
   <TriggerNode
    v-if="currentNode && currentNode.type === NodeType.TRIGGER_NODE"
    :flow-node="currentNode"
    @update:flow-node="handleModelValueUpdate"
  />
  <!-- Recursive display of child nodes  -->
  <ProcessNodeTree
    v-if="currentNode && currentNode.childNode"
    v-model:flow-node="currentNode.childNode"
    :parent-node="currentNode"
    @find:recursive-find-parent-node="recursiveFindParentNode"
  />

  <!-- End Node -->
  <EndEventNode
    v-if="currentNode && currentNode.type === NodeType.END_EVENT_NODE"
    :flow-node="currentNode"
  />
</template>
<script setup lang="ts">
import StartUserNode from './nodes/StartUserNode.vue'
import EndEventNode from './nodes/EndEventNode.vue'
import UserTaskNode from './nodes/UserTaskNode.vue'
import CopyTaskNode from './nodes/CopyTaskNode.vue'
import ExclusiveNode from './nodes/ExclusiveNode.vue'
import ParallelNode from './nodes/ParallelNode.vue'
import InclusiveNode from './nodes/InclusiveNode.vue'
import DelayTimerNode from './nodes/DelayTimerNode.vue'
import RouterNode from './nodes/RouterNode.vue'
import TriggerNode from './nodes/TriggerNode.vue'
import { SimpleFlowNode, NodeType } from './consts'
import { useWatchNode } from './node'
defineOptions({
  name: 'ProcessNodeTree'
})
const props = defineProps({
  parentNode: {
    type: Object as () => SimpleFlowNode,
    default: () => null
  },
  flowNode: {
    type: Object as () => SimpleFlowNode,
    default: () => null
  }
})
const emits = defineEmits<{
  'update:flowNode': [node: SimpleFlowNode | undefined]
  'find:recursiveFindParentNode': [
    nodeList: SimpleFlowNode[],
    curentNode: SimpleFlowNode,
    nodeType: number
  ]
}>()

const currentNode = useWatchNode(props)

// Used to delete nodes
const handleModelValueUpdate = (updateValue) => {
  emits('update:flowNode', updateValue)
}

const findFromParentNode = (nodeList: SimpleFlowNode[], nodeType: number) => {
  emits('find:recursiveFindParentNode', nodeList, props.parentNode, nodeType)
}

// Recursive query for matching nodes from the parent node
const recursiveFindParentNode = (
  nodeList: SimpleFlowNode[],
  findNode: SimpleFlowNode,
  nodeType: number
) => {
  if (!findNode) {
    return
  }
  if (findNode.type === NodeType.START_USER_NODE) {
    nodeList.push(findNode)
    return
  }

  if (findNode.type === nodeType) {
    nodeList.push(findNode)
  }
  emits('find:recursiveFindParentNode', nodeList, props.parentNode, nodeType)
}
</script>
<style lang="scss" scoped></style>
