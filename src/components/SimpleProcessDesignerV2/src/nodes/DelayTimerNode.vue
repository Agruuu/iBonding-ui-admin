<template>
  <div class="node-wrapper">
    <div class="node-container">
      <div
        class="node-box"
        :class="[
          { 'node-config-error': !currentNode.showText },
          `${useTaskStatusClass(currentNode?.activityStatus)}`
        ]"
      >
        <div class="node-title-container">
          <div class="node-title-icon delay-node"><span class="iconfont icon-delay"></span></div>
          <input
            v-if="!readonly && showInput"
            type="text"
            class="editable-title-input"
            @blur="blurEvent()"
            v-mountedFocus
            v-model="currentNode.name"
            :placeholder="currentNode.name"
          />
          <div v-else class="node-title" @click="clickTitle">
            {{ currentNode.name }}
          </div>
        </div>
        <div class="node-content" @click="openNodeConfig">
          <div class="node-text" :title="currentNode.showText" v-if="currentNode.showText">
            {{ currentNode.showText }}
          </div>
          <div class="node-text" v-else>
            {{ NODE_DEFAULT_TEXT.get(NodeType.DELAY_TIMER_NODE) }}
          </div>
          <Icon v-if="!readonly" icon="ep:arrow-right-bold" />
        </div>
        <div v-if="!readonly" class="node-toolbar">
          <div class="toolbar-icon"
            ><Icon color="#0089ff" icon="ep:circle-close-filled" :size="18" @click="deleteNode"
          /></div>
        </div>
      </div>

      <!-- Pass child nodes to add node components。Add nodes before child nodes -->
      <NodeHandler
        v-if="currentNode"
        v-model:child-node="currentNode.childNode"
        :current-node="currentNode"
      />
    </div>
    <DelayTimerNodeConfig
      v-if="!readonly && currentNode"
      ref="nodeSetting"
      :flow-node="currentNode"
    />
  </div>
</template>
<script setup lang="ts">
import { SimpleFlowNode, NodeType, NODE_DEFAULT_TEXT } from '../consts'
import NodeHandler from '../NodeHandler.vue'
import { useNodeName2, useWatchNode, useTaskStatusClass } from '../node'
import DelayTimerNodeConfig from '../nodes-config/DelayTimerNodeConfig.vue'
defineOptions({
  name: 'DelayTimerNode'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
// Define events，Update parent component.
const emits = defineEmits<{
  'update:flowNode': [node: SimpleFlowNode | undefined]
}>()
// Read only or not
const readonly = inject<Boolean>('readonly')
// Changes in monitoring nodes
const currentNode = useWatchNode(props)
// Node Name Editing
const { showInput, blurEvent, clickTitle } = useNodeName2(currentNode, NodeType.DELAY_TIMER_NODE)

const nodeSetting = ref()
// Open node configuration
const openNodeConfig = () => {
  if (readonly) {
    return
  }
  nodeSetting.value.showDelayTimerNodeConfig(currentNode.value)
  nodeSetting.value.openDrawer()
}

// Delete node。Update the current node to a child node
const deleteNode = () => {
  emits('update:flowNode', currentNode.value.childNode)
}
</script>

<style lang="scss" scoped></style>
