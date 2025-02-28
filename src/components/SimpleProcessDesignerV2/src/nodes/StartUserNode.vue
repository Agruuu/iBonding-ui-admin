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
          <div class="node-title-icon start-user"
            ><span class="iconfont icon-start-user"></span
          ></div>
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
            {{ NODE_DEFAULT_TEXT.get(NodeType.START_USER_NODE) }}
          </div>
          <Icon icon="ep:arrow-right-bold" v-if="!readonly" />
        </div>
      </div>
      <!-- Pass child nodes to add node components. Add nodes before child nodes -->
      <NodeHandler
        v-if="currentNode"
        v-model:child-node="currentNode.childNode"
        :current-node="currentNode"
      />
    </div>
  </div>
  <StartUserNodeConfig v-if="!readonly && currentNode" ref="nodeSetting" :flow-node="currentNode" />
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
import NodeHandler from '../NodeHandler.vue'
import { useWatchNode, useNodeName2, useTaskStatusClass } from '../node'
import { SimpleFlowNode, NODE_DEFAULT_TEXT, NodeType } from '../consts'
import StartUserNodeConfig from '../nodes-config/StartUserNodeConfig.vue'
import { dateFormatter, formatPast2 } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
defineOptions({
  name: 'StartEventNode'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    default: () => null
  }
})
const readonly = inject<Boolean>('readonly') // Read only or not
const tasks = inject<Ref<any[]>>('tasks', ref([]))
// Define events，Update parent component。
const emits = defineEmits<{
  'update:modelValue': [node: SimpleFlowNode | undefined]
}>()
// Monitoring node changes
const currentNode = useWatchNode(props)
// Node Name Editing
const { showInput, blurEvent, clickTitle } = useNodeName2(currentNode, NodeType.START_USER_NODE)

const nodeSetting = ref()
//
const nodeClick = () => {
  if (readonly) {
    // read only mode，Pop up window displaying task information
    if (tasks && tasks.value) {
      dialogTitle.value = currentNode.value.name
      selectTasks.value = tasks.value.filter(
        (item: any) => item?.taskDefinitionKey === currentNode.value.id
      )
      dialogVisible.value = true
    }
  } else {
    // Edit mode，Open node configuration、Pass the current node to the configuration component
    nodeSetting.value.showStartUserNodeConfig(currentNode.value)
    nodeSetting.value.openDrawer()
  }
}

// Task pop-up display，Used for read-only mode
const dialogVisible = ref(false) // Pop up visibility
const dialogTitle = ref<string | undefined>(undefined) // Pop up title
const selectTasks = ref<any[] | undefined>([]) // Selected task array
</script>
<style lang="scss" scoped></style>
