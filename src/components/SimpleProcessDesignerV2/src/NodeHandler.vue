<template>
  <div class="node-handler-wrapper">
    <div class="node-handler">
      <el-popover
        trigger="hover"
        v-model:visible="popoverShow"
        placement="right-start"
        width="auto"
        v-if="!readonly"
      >
        <div class="handler-item-wrapper">
          <div class="handler-item" @click="addNode(NodeType.USER_TASK_NODE)">
            <div class="approve handler-item-icon">
              <span class="iconfont icon-approve icon-size"></span>
            </div>
            <div class="handler-item-text">Approver</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.COPY_TASK_NODE)">
            <div class="handler-item-icon copy">
              <span class="iconfont icon-size icon-copy"></span>
            </div>
            <div class="handler-item-text">CC (Copy)</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.CONDITION_BRANCH_NODE)">
            <div class="handler-item-icon condition">
              <span class="iconfont icon-size icon-exclusive"></span>
            </div>
            <div class="handler-item-text">Condition Branch</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.PARALLEL_BRANCH_NODE)">
            <div class="handler-item-icon parallel">
              <span class="iconfont icon-size icon-parallel"></span>
            </div>
            <div class="handler-item-text">Parallel Branch</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.INCLUSIVE_BRANCH_NODE)">
            <div class="handler-item-icon inclusive">
              <span class="iconfont icon-size icon-inclusive"></span>
            </div>
            <div class="handler-item-text">Inclusive Branch</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.DELAY_TIMER_NODE)">
            <div class="handler-item-icon delay">
              <span class="iconfont icon-size icon-delay"></span>
            </div>
            <div class="handler-item-text">Delay Generator</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.ROUTER_BRANCH_NODE)">
            <div class="handler-item-icon router">
              <span class="iconfont icon-size icon-router"></span>
            </div>
            <div class="handler-item-text">Routing Branch</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.TRIGGER_NODE)">
            <div class="handler-item-icon trigger">
              <span class="iconfont icon-size icon-trigger"></span>
            </div>
            <div class="handler-item-text">Trigger</div>
          </div>
        </div> 
        <template #reference>
          <div class="add-icon"><Icon icon="ep:plus" /></div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ApproveMethodType,
  AssignEmptyHandlerType,
  AssignStartUserHandlerType,
  ConditionType,
  NODE_DEFAULT_NAME,
  NodeType,
  RejectHandlerType,
  SimpleFlowNode,
  DEFAULT_CONDITION_GROUP_VALUE
} from './consts'
import {generateUUID} from '@/utils'

defineOptions({
  name: 'NodeHandler'
})

const message = useMessage() // Message pop-up window

const popoverShow = ref(false)
const props = defineProps({
  childNode: {
    type: Object as () => SimpleFlowNode,
    default: null
  },
  currentNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
const emits = defineEmits(['update:childNode'])

const readonly = inject<Boolean>('readonly') // Read only or not

const addNode = (type: number) => {
  // check：conditional branch、Inclusive branch behind，Directly adding parallel branches is not allowed
  if (
    type === NodeType.PARALLEL_BRANCH_NODE &&
    [NodeType.CONDITION_BRANCH_NODE, NodeType.INCLUSIVE_BRANCH_NODE].includes(
      props.currentNode?.type
    )
  ) {
    message.error('conditional branch、Inclusive branch behind，Directly adding parallel branches is not allowed')
    return
  }

  popoverShow.value = false
  if (type === NodeType.USER_TASK_NODE) {
    const id = 'Activity_' + generateUUID()
    const data: SimpleFlowNode = {
      id: id,
      name: NODE_DEFAULT_NAME.get(NodeType.USER_TASK_NODE) as string,
      showText: '',
      type: NodeType.USER_TASK_NODE,
      approveMethod: ApproveMethodType.SEQUENTIAL_APPROVE,
      // timeout handler 
      rejectHandler: {
        type: RejectHandlerType.FINISH_PROCESS
      },
      timeoutHandler: {
        enable: false
      },
      assignEmptyHandler: {
        type: AssignEmptyHandlerType.APPROVE
      },
      assignStartUserHandlerType: AssignStartUserHandlerType.START_USER_AUDIT,
      childNode: props.childNode,
      taskCreateListener: {
        enable: false
      },
      taskAssignListener: {
        enable: false
      },
      taskCompleteListener: {
        enable: false
      }
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.COPY_TASK_NODE) {
    const data: SimpleFlowNode = {
      id: 'Activity_' + generateUUID(),
      name: NODE_DEFAULT_NAME.get(NodeType.COPY_TASK_NODE) as string,
      showText: '',
      type: NodeType.COPY_TASK_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.CONDITION_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      name: 'Condition Branch',
      type: NodeType.CONDITION_BRANCH_NODE,
      id: 'GateWay_' + generateUUID(),
      childNode: props.childNode,
      conditionNodes: [
        {
          id: 'Flow_' + generateUUID(),
          name: 'Condition 1',
          showText: '',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: false,
            conditionType: ConditionType.RULE,
            conditionGroups: DEFAULT_CONDITION_GROUP_VALUE
          }
        },
        {
          id: 'Flow_' + generateUUID(),
          name: 'Other Situations',
          showText: 'When other conditions are not met，Will enter this branch',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: true
          }
        }
      ]
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.PARALLEL_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      name: 'Parallel Branch',
      type: NodeType.PARALLEL_BRANCH_NODE,
      id: 'GateWay_' + generateUUID(),
      childNode: props.childNode,
      conditionNodes: [
        {
          id: 'Flow_' + generateUUID(),
          name: 'Parallel 1',
          showText: 'No need to configure conditions for simultaneous execution',
          type: NodeType.CONDITION_NODE,
          childNode: undefined
        },
        {
          id: 'Flow_' + generateUUID(),
          name: 'Parallel 2',
          showText: 'No need to configure conditions for simultaneous execution',
          type: NodeType.CONDITION_NODE,
          childNode: undefined
        }
      ]
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.INCLUSIVE_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      name: 'Inclusive Branch',
      type: NodeType.INCLUSIVE_BRANCH_NODE,
      id: 'GateWay_' + generateUUID(),
      childNode: props.childNode,
      conditionNodes: [
        {
          id: 'Flow_' + generateUUID(),
          name: 'Material Condition 1',
          showText: '',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: false,
            conditionType: ConditionType.RULE,
            conditionGroups: DEFAULT_CONDITION_GROUP_VALUE
          }
        },
        {
          id: 'Flow_' + generateUUID(),
          name: 'Other Situations',
          showText: 'When other conditions are not met，Will enter this branch',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: true
          }
        }
      ]
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.DELAY_TIMER_NODE) {
    const data: SimpleFlowNode = {
      id: 'Activity_' + generateUUID(),
      name: NODE_DEFAULT_NAME.get(NodeType.DELAY_TIMER_NODE) as string,
      showText: '',
      type: NodeType.DELAY_TIMER_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.ROUTER_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      id: 'GateWay_' + generateUUID(),
      name: NODE_DEFAULT_NAME.get(NodeType.ROUTER_BRANCH_NODE) as string,
      showText: '',
      type: NodeType.ROUTER_BRANCH_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.TRIGGER_NODE) {
    const data: SimpleFlowNode = {
      id: 'Activity_' + generateUUID(),
      name: NODE_DEFAULT_NAME.get(NodeType.TRIGGER_NODE) as string,
      showText: '',
      type: NodeType.TRIGGER_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
}
</script>

<style lang="scss" scoped></style>
