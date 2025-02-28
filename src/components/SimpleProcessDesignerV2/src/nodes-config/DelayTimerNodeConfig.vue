<template>
  <el-drawer
    :append-to-body="true"
    v-model="settingVisible"
    :show-close="false"
    :size="550"
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
      <el-form ref="formRef" :model="configForm" label-position="top" :rules="formRules">
        <el-form-item label="Delay Time" prop="delayType">
          <el-radio-group v-model="configForm.delayType">
            <el-radio-button
              v-for="item in DELAY_TYPE"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="configForm.delayType === DelayTypeEnum.FIXED_TIME_DURATION">
          <el-form-item prop="timeDuration">
            <el-input-number
              class="mr-2"
              :style="{ width: '100px' }"
              v-model="configForm.timeDuration"
              :min="1"
              controls-position="right"
            />
          </el-form-item>
          <el-select v-model="configForm.timeUnit" class="mr-2" :style="{ width: '100px' }">
            <el-option
              v-for="item in TIME_UNIT_TYPES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-text> after proceed to the next node</el-text>
        </el-form-item>
        <el-form-item v-if="configForm.delayType === DelayTypeEnum.FIXED_DATE_TIME" prop="dateTime">
          <el-date-picker
            class="mr-2"
            v-model="configForm.dateTime"
            type="datetime"
            placeholder="Please select a date and time"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
          <el-text> after proceed to the next node</el-text>
        </el-form-item>
      </el-form>
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
  NodeType,
  TIME_UNIT_TYPES,
  TimeUnitType,
  DelayTypeEnum,
  DELAY_TYPE
} from '../consts'
import { useWatchNode, useDrawer, useNodeName } from '../node'
import { convertTimeUnit } from '../utils'
defineOptions({
  name: 'DelayTimerNodeConfig'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
// Drawer configuration
const { settingVisible, closeDrawer, openDrawer } = useDrawer()
// Current node
const currentNode = useWatchNode(props)
// Node Name
const { nodeName, showInput, clickIcon, blurEvent } = useNodeName(NodeType.DELAY_TIMER_NODE)
// CC form configuration
const formRef = ref() // form  Ref
// Form verification rules
const formRules = reactive({
  delayType: [{ required: true, message: 'The delay time cannot be empty', trigger: 'change' }],
  timeDuration: [{ required: true, message: 'The time duration cannot be empty', trigger: 'change' }],
  dateTime: [{ required: true, message: 'The date time cannot be empty', trigger: 'change' }]
})
// Configure form data
const configForm = ref({
  delayType: DelayTypeEnum.FIXED_TIME_DURATION,
  timeDuration: 1,
  timeUnit: TimeUnitType.HOUR,
  dateTime: ''
})
// Save configuration
const saveConfig = async () => {
  if (!formRef) return false
  const valid = await formRef.value.validate()
  if (!valid) return false
  const showText = getShowText()
  if (!showText) return false
  currentNode.value.name = nodeName.value!
  currentNode.value.showText = showText
  if (configForm.value.delayType === DelayTypeEnum.FIXED_TIME_DURATION) {
    currentNode.value.delaySetting = {
      delayType: configForm.value.delayType,
      delayTime: getIsoTimeDuration()
    }
  }
  if (configForm.value.delayType === DelayTypeEnum.FIXED_DATE_TIME) {
    currentNode.value.delaySetting = {
      delayType: configForm.value.delayType,
      delayTime: configForm.value.dateTime
    }
  }
  settingVisible.value = false
  return true
}
const getShowText = (): string => {
  let showText = ''
  if (configForm.value.delayType === DelayTypeEnum.FIXED_TIME_DURATION) {
    showText = `Delay ${configForm.value.timeDuration}${TIME_UNIT_TYPES.find((item) => item.value === configForm.value.timeUnit).label}`
  }
  if (configForm.value.delayType === DelayTypeEnum.FIXED_DATE_TIME) {
    showText = `Delay to ${configForm.value.dateTime.replace('T', ' ')}`
  }
  return showText
}
const getIsoTimeDuration = () => {
  let strTimeDuration = 'PT'
  if (configForm.value.timeUnit === TimeUnitType.MINUTE) {
    strTimeDuration += configForm.value.timeDuration + 'M'
  }
  if (configForm.value.timeUnit === TimeUnitType.HOUR) {
    strTimeDuration += configForm.value.timeDuration + 'H'
  }
  if (configForm.value.timeUnit === TimeUnitType.DAY) {
    strTimeDuration += configForm.value.timeDuration + 'D'
  }
  return strTimeDuration
}
// Display Delay Node Configuration， Transferred from the parent component
const showDelayTimerNodeConfig = (node: SimpleFlowNode) => {
  nodeName.value = node.name
  if (node.delaySetting) {
    configForm.value.delayType = node.delaySetting.delayType
    // Fixed duration
    if (configForm.value.delayType === DelayTypeEnum.FIXED_TIME_DURATION) {
      const strTimeDuration = node.delaySetting.delayTime
      let parseTime = strTimeDuration.slice(2, strTimeDuration.length - 1)
      let parseTimeUnit = strTimeDuration.slice(strTimeDuration.length - 1)
      configForm.value.timeDuration = parseInt(parseTime)
      configForm.value.timeUnit = convertTimeUnit(parseTimeUnit)
    }
    // Fixed date and time
    if (configForm.value.delayType === DelayTypeEnum.FIXED_DATE_TIME) {
      configForm.value.dateTime = node.delaySetting.delayTime
    }
  }
}

defineExpose({ openDrawer, showDelayTimerNodeConfig }) // Expose method to parent component
</script>

<style lang="scss" scoped></style>
