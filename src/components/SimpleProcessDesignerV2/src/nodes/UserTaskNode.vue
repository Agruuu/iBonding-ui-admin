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
          <div class="node-title-icon user-task"><span class="iconfont icon-approve"></span></div>
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
        <div class="node-content" @click="nodeClick">
          <div class="node-text" :title="currentNode.showText" v-if="currentNode.showText">
            {{ currentNode.showText }}
          </div>
          <div class="node-text" v-else>
            {{ NODE_DEFAULT_TEXT.get(NodeType.USER_TASK_NODE) }}
          </div>
          <Icon icon="ep:arrow-right-bold" v-if="!readonly" />
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
  </div>
  <UserTaskNodeConfig
    v-if="currentNode"
    ref="nodeSetting"
    :flow-node="currentNode"
    @find:return-task-nodes="findReturnTaskNodes"
  />
  <!-- Approval Record -->
  <el-dialog
    :title="dialogTitle || 'Approval Record'"
    v-model="dialogVisible"
    width="1000px"
    append-to-body
  >
    <el-row>
      <el-table :data="selectTasks" size="small" border header-cell-class-name="table-header-gray">
        <el-table-column
          label="ID"
          header-align="center"
          align="center"
          type="index"
          width="50"
        />
        <el-table-column label="Approver" min-width="100" align="center">
          <template #default="scope">
            {{ scope.row.assigneeUser?.nickname || scope.row.ownerUser?.nickname }}
          </template>
        </el-table-column>

        <el-table-column label="Department" min-width="100" align="center">
          <template #default="scope">
            {{ scope.row.assigneeUser?.deptName || scope.row.ownerUser?.deptName }}
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="Start Time"
          prop="createTime"
          min-width="140"
        />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="End Time"
          prop="endTime"
          min-width="140"
        />
        <el-table-column align="center" label="Approval Status" prop="status" min-width="90">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="Approval Suggestion" prop="reason" min-width="120" />
        <el-table-column align="center" label="Duration" prop="durationInMillis" width="100">
          <template #default="scope">
            {{ formatPast2(scope.row.durationInMillis) }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-dialog>
</template>
<script setup lang="ts">
import { SimpleFlowNode, NodeType, NODE_DEFAULT_TEXT } from '../consts'
import { useWatchNode, useNodeName2, useTaskStatusClass } from '../node'
import NodeHandler from '../NodeHandler.vue'
import UserTaskNodeConfig from '../nodes-config/UserTaskNodeConfig.vue'
import { dateFormatter, formatPast2 } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
defineOptions({
  name: 'UserTaskNode'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
const emits = defineEmits<{
  'update:flowNode': [node: SimpleFlowNode | undefined]
  'find:parentNode': [nodeList: SimpleFlowNode[], nodeType: NodeType]
}>()

// Read only or not
const readonly = inject<Boolean>('readonly')
const tasks = inject<Ref<any[]>>('tasks', ref([]))
// Monitoring node changes
const currentNode = useWatchNode(props)
// Node Name Editing
const { showInput, blurEvent, clickTitle } = useNodeName2(currentNode, NodeType.START_USER_NODE)
const nodeSetting = ref()

const nodeClick = () => {
  if (readonly) {
    if (tasks && tasks.value) {
      dialogTitle.value = currentNode.value.name
      // read only mode，Pop up window displaying task information
      selectTasks.value = tasks.value.filter(
        (item: any) => item?.taskDefinitionKey === currentNode.value.id
      )
      dialogVisible.value = true
    }
  } else {
    // Edit mode，Open node configuration、Pass the current node to the configuration component
    nodeSetting.value.showUserTaskNodeConfig(currentNode.value)
    nodeSetting.value.openDrawer()
  }
}

const deleteNode = () => {
  emits('update:flowNode', currentNode.value.childNode)
}
// Search to reject user nodes
const findReturnTaskNodes = (
  matchNodeList: SimpleFlowNode[] // Matching nodes
) => {
  // Search from parent node
  emits('find:parentNode', matchNodeList, NodeType.USER_TASK_NODE)
}

// Task pop-up display，Used for read-only mode
const dialogVisible = ref(false) // Pop up visibility
const dialogTitle = ref<string | undefined>(undefined) // Pop up title
const selectTasks = ref<any[] | undefined>([]) // Selected task array
</script>
<style lang="scss" scoped></style>
