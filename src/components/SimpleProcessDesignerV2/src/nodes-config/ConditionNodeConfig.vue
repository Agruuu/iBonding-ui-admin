<template>
  <el-drawer
    :append-to-body="true"
    v-model="settingVisible"
    :show-close="false"
    :size="588"
    :before-close="handleClose"
  >
    <template #header>
      <div class="config-header">
        <input
          v-if="showInput"
          type="text"
          class="config-editable-input"
          @blur="blurEvent()"
          v-mountedFocus
          v-model="currentNode.name"
          :placeholder="currentNode.name"
        />
        <div v-else class="node-name"
          >{{ currentNode.name }}
          <Icon class="ml-1" icon="ep:edit-pen" :size="16" @click="clickIcon()"
        /></div>

        <div class="divide-line"></div>
      </div>
    </template>
    <div>
      <div class="mb-3 font-size-16px" v-if="currentNode.conditionSetting?.defaultFlow"
        >When other conditions are not met，Will enter this branch（This branch cannot be edited or deleted）</div
      >
      <div v-else>
        <Condition ref="conditionRef" v-model="condition" />
      </div>
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
import {
  SimpleFlowNode,
  ConditionType,
  COMPARISON_OPERATORS,
} from '../consts'
import { getDefaultConditionNodeName } from '../utils'
import { useFormFieldsAndStartUser } from '../node'
import Condition from './components/Condition.vue'
const message = useMessage() // Message pop-up window
defineOptions({
  name: 'ConditionNodeConfig'
})
const props = defineProps({
  conditionNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  },
  nodeIndex: {
    type: Number,
    required: true
  }
})
const settingVisible = ref(false)
const currentNode = ref<SimpleFlowNode>(props.conditionNode)
const condition = ref<any>()
const open = () => {
  condition.value = currentNode.value.conditionSetting
  settingVisible.value = true
}

watch(
  () => props.conditionNode,
  (newValue) => {
    currentNode.value = newValue
  }
)
// Display name input box
const showInput = ref(false)

const clickIcon = () => {
  showInput.value = true
}
// Input box loses focus
const blurEvent = () => {
  showInput.value = false
  currentNode.value.name =
    currentNode.value.name ||
    getDefaultConditionNodeName(props.nodeIndex, currentNode.value?.conditionSetting?.defaultFlow)
}



defineExpose({ open }) // provide open method，Used to open pop ups

// close
const closeDrawer = () => {
  settingVisible.value = false
}

const handleClose = async (done: (cancel?: boolean) => void) => {
  const isSuccess = await saveConfig()
  if (!isSuccess) {
    done(true) // afferent true block closure
  } else {
    done()
  }
}

const conditionRef = ref()
// Save configuration
const saveConfig = async () => {
  if (!currentNode.value.conditionSetting?.defaultFlow) {
    // validate form 
    const valid = await conditionRef.value.validate()
    if (!valid) return false
    const showText = getShowText()
    if (!showText) {
      return false
    }
    currentNode.value.showText = showText
    currentNode.value.conditionSetting!.conditionType = condition.value?.conditionType
    if (currentNode.value.conditionSetting?.conditionType === ConditionType.EXPRESSION) {
      currentNode.value.conditionSetting.conditionGroups = undefined
      currentNode.value.conditionSetting.conditionExpression = condition.value?.conditionExpression
    }
    if (currentNode.value.conditionSetting!.conditionType === ConditionType.RULE) {
      currentNode.value.conditionSetting!.conditionExpression = undefined
      currentNode.value.conditionSetting!.conditionGroups = condition.value?.conditionGroups
    }
  }
  settingVisible.value = false
  return true
}
const getShowText = (): string => {
  let showText = ''
  if (condition.value?.conditionType === ConditionType.EXPRESSION) {
    if (condition.value.conditionExpression) {
      showText = `Expression：${condition.value.conditionExpression}`
    }
  }
  if (condition.value?.conditionType === ConditionType.RULE) {
    // Is the condition group related to the relationship
    const groupAnd = condition.value.conditionGroups?.and
    let warningMesg: undefined | string = undefined
    const conditionGroup = condition.value.conditionGroups?.conditions.map((item) => {
      return (
        '(' +
        item.rules
          .map((rule) => {
            if (rule.leftSide && rule.rightSide) {
              return (
                getFieldTitle(rule.leftSide) + ' ' + getOpName(rule.opCode) + ' ' + rule.rightSide
              )
            } else {
              // There is an imperfect rule。Error prompt
              warningMesg = 'Please improve the conditions and rules'
              return ''
            }
          })
          .join(item.and ? ' And ' : ' Or ') +
        ' ) '
      )
    })
    if (warningMesg) {
      message.warning(warningMesg)
      showText = ''
    } else {
      showText = conditionGroup!.join(groupAnd ? ' And ' : ' Or ')
    }
  }
  return showText
}
// Process form fields and initiator fields.
const fieldOptions = useFormFieldsAndStartUser()

/** Get field name */
const getFieldTitle = (field: string) => {
  const item = fieldOptions.find((item) => item.field === field)
  return item?.title
}

/** Get operator name */
const getOpName = (opCode: string): string => {
  const opName = COMPARISON_OPERATORS.find((item: any) => item.value === opCode)
  return opName?.label
}
</script>

<style lang="scss" scoped>
.condition-group-tool {
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin-bottom: 20px;
}

.condition-group {
  position: relative;

  &:hover {
    border-color: #0089ff;

    .condition-group-delete {
      opacity: 1;
    }
  }

  .condition-group-delete {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    cursor: pointer;
    opacity: 0;
  }
}

::v-deep(.el-card__header) {
  padding: 8px var(--el-card-padding);
  border-bottom: 1px solid var(--el-card-border-color);
  box-sizing: border-box;
}
</style>
