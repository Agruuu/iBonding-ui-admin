<template>
  <el-drawer
    :append-to-body="true"
    v-model="settingVisible"
    :show-close="false"
    :size="630"
    :before-close="saveConfig"
  >
    <template #header>
      <div class="config-header">
        <input
          v-if="showInput"
          type="text"
          class="config-editable-input"
          @blur="blurEvent()"
          v-mountedFocus
          v-model="nodeName"
          :placeholder="nodeName"
        />
        <div v-else class="node-name">
          {{ nodeName }} <Icon class="ml-1" icon="ep:edit-pen" :size="16" @click="clickIcon()" />
        </div>
        <div class="divide-line"></div>
      </div>
    </template>
    <div>
      <el-form label-position="top">
        <el-card class="mb-15px" v-for="(item, index) in routerGroups" :key="index">
          <template #header>
            <div class="flex flex-items-center">
              <el-text size="large">Route {{ index + 1 }}</el-text>
              <el-select class="ml-15px" v-model="item.nodeId" style="width: 180px">
                <el-option
                  v-for="node in nodeOptions"
                  :key="node.value"
                  :label="node.label"
                  :value="node.value"
                />
              </el-select>
              <el-button class="mla" type="danger" link @click="deleteRouterGroup(index)">
                Delete
              </el-button>
            </div>
          </template>
          <Condition
            :ref="($event) => (conditionRef[index] = $event)"
            v-model="routerGroups[index]"
          />
        </el-card>
      </el-form>

      <el-button class="w-1/1" type="primary" :icon="Plus" @click="addRouterGroup">
        Add Routing Branch
      </el-button>
    </div>
    <template #footer>
      <el-divider />
      <div>
        <el-button type="primary" @click="saveConfig">Confirm</el-button>
        <el-button @click="closeDrawer">Cancel</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { SimpleFlowNode, NodeType, ConditionType, RouterSetting } from '../consts'
import { useWatchNode, useDrawer, useNodeName } from '../node'
import Condition from './components/Condition.vue'

defineOptions({
  name: 'RouterNodeConfig'
})
const message = useMessage() // Message pop-up window
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
const processNodeTree = inject<Ref<SimpleFlowNode>>('processNodeTree')
// Drawer configuration
const { settingVisible, closeDrawer, openDrawer } = useDrawer()
// Current node
const currentNode = useWatchNode(props)
// Node Name
const { nodeName, showInput, clickIcon, blurEvent } = useNodeName(NodeType.ROUTER_BRANCH_NODE)
const routerGroups = ref<RouterSetting[]>([])
const nodeOptions = ref<any>([])
const conditionRef = ref([])

/** Save configuration */
const saveConfig = async () => {
  // validate form 
  let valid = true
  for (const item of conditionRef.value) {
    if (item && !(await item.validate())) {
      valid = false
    }
  }
  if (!valid) return false
  const showText = getShowText()
  if (!showText) return false
  currentNode.value.name = nodeName.value!
  currentNode.value.showText = showText
  currentNode.value.routerGroups = routerGroups.value
  settingVisible.value = false
  return true
}
// Display the configuration of routing branch nodes， Transferred from the parent component
const showRouteNodeConfig = (node: SimpleFlowNode) => {
  getRouterNode(processNodeTree?.value)
  routerGroups.value = []
  nodeName.value = node.name
  if (node.routerGroups) {
    routerGroups.value = node.routerGroups
  }
}

const getShowText = () => {
  if (!routerGroups.value || !Array.isArray(routerGroups.value) || routerGroups.value.length <= 0) {
    message.warning('Please configure the routing!')
    return ''
  }
  for (const route of routerGroups.value) {
    if (!route.nodeId || !route.conditionType) {
      message.warning('Please improve the routing configuration items!')
      return ''
    }
    if (route.conditionType === ConditionType.EXPRESSION && !route.conditionExpression) {
      message.warning('Please improve the routing configuration items!')
      return ''
    }
    if (route.conditionType === ConditionType.RULE) {
      for (const condition of route.conditionGroups.conditions) {
        for (const rule of condition.rules) {
          if (!rule.leftSide || !rule.rightSide) {
            message.warning('Please improve the routing configuration items!')
            return ''
          }
        }
      }
    }
  }
  return `${routerGroups.value.length} routing branch`
}

const addRouterGroup = () => {
  routerGroups.value.push({
    nodeId: '',
    conditionType: ConditionType.RULE,
    conditionExpression: '',
    conditionGroups: {
      and: true,
      conditions: [
        {
          and: true,
          rules: [
            {
              opCode: '==',
              leftSide: '',
              rightSide: ''
            }
          ]
        }
      ]
    }
  })
}

const deleteRouterGroup = (index: number) => {
  routerGroups.value.splice(index, 1)
}

// Recursive retrieval of all nodes
const getRouterNode = (node) => {
  // TODO It is best to meet the following requirements as well
  // Parallel branch、Internal nodes of the inclusive branch cannot jump to external nodes
  // Conditional branch nodes can jump up to external nodes
  while (true) {
    if (!node) break
    if (node.type !== NodeType.ROUTER_BRANCH_NODE && node.type !== NodeType.CONDITION_NODE) {
      nodeOptions.value.push({
        label: node.name,
        value: node.id
      })
    }
    if (!node.childNode || node.type === NodeType.END_EVENT_NODE) {
      break
    }
    if (node.conditionNodes && node.conditionNodes.length) {
      node.conditionNodes.forEach((item) => {
        getRouterNode(item)
      })
    }
    node = node.childNode
  }
}

defineExpose({ openDrawer, showRouteNodeConfig }) // Expose method to parent component
</script>
