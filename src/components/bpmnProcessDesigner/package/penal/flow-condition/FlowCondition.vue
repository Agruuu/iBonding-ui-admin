<template>
  <div class="panel-tab__content">
    <el-form :model="flowConditionForm" label-width="90px" size="small">
      <el-form-item label="Circulation Type">
        <el-select v-model="flowConditionForm.type" @change="updateFlowType">
          <el-option label="Normal Flow Path" value="normal" />
          <el-option label="Default Flow Path" value="default" />
          <el-option label="Conditional Flow Path" value="condition" />
        </el-select>
      </el-form-item>
      <el-form-item label="Condition Format" v-if="flowConditionForm.type === 'condition'" key="condition">
        <el-select v-model="flowConditionForm.conditionType">
          <el-option label="Expression" value="expression" />
          <el-option label="Script" value="script" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Expression"
        v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'expression'"
        key="express"
      >
        <el-input
          v-model="flowConditionForm.body"
          style="width: 192px"
          clearable
          @change="updateFlowCondition"
        />
      </el-form-item>
      <template
        v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'script'"
      >
        <el-form-item label="Script Language " key="language">
          <el-input v-model="flowConditionForm.language" clearable @change="updateFlowCondition" />
        </el-form-item>
        <el-form-item label="Script Type" key="scriptType">
          <el-select v-model="flowConditionForm.scriptType">
            <el-option label="Inline Script " value="inlineScript" />
            <el-option label="External Script" value="externalScript" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Script"
          v-if="flowConditionForm.scriptType === 'inlineScript'"
          key="body"
        >
          <el-input
            v-model="flowConditionForm.body"
            type="textarea"
            clearable
            @change="updateFlowCondition"
          />
        </el-form-item>
        <el-form-item
          label="Resource Url"
          v-if="flowConditionForm.scriptType === 'externalScript'"
          key="resource"
        >
          <el-input v-model="flowConditionForm.resource" clearable @change="updateFlowCondition" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'FlowCondition' })

const props = defineProps({
  businessObject: Object,
  type: String
})
const flowConditionForm = ref<any>({})
const bpmnElement = ref()
const bpmnElementSource = ref()
const bpmnElementSourceRef = ref()
const flowConditionRef = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances
const resetFlowCondition = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  bpmnElementSource.value = bpmnElement.value.source
  bpmnElementSourceRef.value = bpmnElement.value.businessObject.sourceRef
  // Initialize default type by default
  flowConditionForm.value = { type: 'default' }
  if (
    bpmnElementSourceRef.value &&
    bpmnElementSourceRef.value.default &&
    bpmnElementSourceRef.value.default.id === bpmnElement.value.id
  ) {
    flowConditionForm.value = { type: 'default' }
  } else if (!bpmnElement.value.businessObject.conditionExpression) {
    // ordinary
    flowConditionForm.value = { type: 'normal' }
  } else {
    // With conditions
    const conditionExpression = bpmnElement.value.businessObject.conditionExpression
    flowConditionForm.value = { ...conditionExpression, type: 'condition' }
    // resource Can be directly identified Is it an external resource script
    if (flowConditionForm.value.resource) {
      // this.$set(this.flowConditionForm, "conditionType", "script");
      // this.$set(this.flowConditionForm, "scriptType", "externalScript");
      flowConditionForm.value['conditionType'] = 'script'
      flowConditionForm.value['scriptType'] = 'externalScript'
      return
    }
    if (conditionExpression.language) {
      // this.$set(this.flowConditionForm, "conditionType", "script");
      // this.$set(this.flowConditionForm, "scriptType", "inlineScript");
      flowConditionForm.value['conditionType'] = 'script'
      flowConditionForm.value['scriptType'] = 'inlineScript'

      return
    }
    // this.$set(this.flowConditionForm, "conditionType", "expression");
    flowConditionForm.value['conditionType'] = 'expression'
  }
}
const updateFlowType = (flowType) => {
  // Normal condition category
  if (flowType === 'condition') {
    flowConditionRef.value = bpmnInstances().moddle.create('bpmn:FormalExpression')
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      conditionExpression: flowConditionRef.value
    })
    return
  }
  // Default Path
  if (flowType === 'default') {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      conditionExpression: null
    })
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElementSource.value), {
      default: toRaw(bpmnElement.value)
    })
    return
  }
  // Normal path，If the default path of the source node is the current connection time，Clear the default path configuration of the parent element
  if (
    bpmnElementSourceRef.value.default &&
    bpmnElementSourceRef.value.default.id === bpmnElement.value.id
  ) {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElementSource.value), {
      default: null
    })
  }
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    conditionExpression: null
  })
}
const updateFlowCondition = () => {
  let { conditionType, scriptType, body, resource, language } = flowConditionForm.value
  let condition
  if (conditionType === 'expression') {
    condition = bpmnInstances().moddle.create('bpmn:FormalExpression', { body })
  } else {
    if (scriptType === 'inlineScript') {
      condition = bpmnInstances().moddle.create('bpmn:FormalExpression', { body, language })
      // this.$set(this.flowConditionForm, "resource", "");
      flowConditionForm.value['resource'] = ''
    } else {
      // this.$set(this.flowConditionForm, "body", "");
      flowConditionForm.value['body'] = ''
      condition = bpmnInstances().moddle.create('bpmn:FormalExpression', {
        resource,
        language
      })
    }
  }
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    conditionExpression: condition
  })
}

onBeforeUnmount(() => {
  bpmnElement.value = null
  bpmnElementSource.value = null
  bpmnElementSourceRef.value = null
})

watch(
  () => props.businessObject,
  (val) => {
    console.log(val, 'val')
    nextTick(() => {
      resetFlowCondition()
    })
  },
  {
    immediate: true
  }
)
</script>
