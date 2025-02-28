<template>
  <div class="process-panel__container" :style="{ width: `${width}px`, maxHeight: '600px' }">
    <el-collapse v-model="activeTab" v-if="isReady">
      <el-collapse-item name="base">
        <!-- class="panel-tab__title" -->
        <template #title>
          <Icon icon="ep:info-filled" />
          Routine</template
        >
        <ElementBaseInfo
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
          :model="model"
        />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
        <template #title><Icon icon="ep:comment" />Message And Signal</template>
        <signal-and-massage />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="conditionFormVisible" key="condition">
        <template #title><Icon icon="ep:promotion" />Transfer Condition</template>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="formVisible" key="form">
        <template #title><Icon icon="ep:list" />Form</template>
        <element-form :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="task" v-if="isTaskCollapseItemShow(elementType)" key="task">
        <template #title
          ><Icon icon="ep:checked" />{{ getTaskCollapseItemName(elementType) }}</template
        >
        <element-task :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item
        name="multiInstance"
        v-if="elementType.indexOf('Task') !== -1"
        key="multiInstance"
      >
        <template #title><Icon icon="ep:help-filled" />Multi Person Approval Method</template>
        <element-multi-instance
          :id="elementId"
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item name="listeners" key="listeners">
        <template #title><Icon icon="ep:bell-filled" />Execute Listener</template>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
        <template #title><Icon icon="ep:bell-filled" />Task Listener</template>
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="extensions" key="extensions">
        <template #title><Icon icon="ep:circle-plus-filled" />Expand Attribute</template>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="other" key="other">
        <template #title><Icon icon="ep:promotion" />Other</template>
        <element-other-config :id="elementId" />
      </el-collapse-item>
      <el-collapse-item name="customConfig" key="customConfig">
        <template #title><Icon icon="ep:tools" />Custom config</template>
        <element-custom-config
          :id="elementId"
          :type="elementType"
          :business-object="elementBusinessObject"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import ElementBaseInfo from './base/ElementBaseInfo.vue'
import ElementOtherConfig from './other/ElementOtherConfig.vue'
import ElementTask from './task/ElementTask.vue'
import ElementMultiInstance from './multi-instance/ElementMultiInstance.vue'
import FlowCondition from './flow-condition/FlowCondition.vue'
import SignalAndMassage from './signal-message/SignalAndMessage.vue'
import ElementListeners from './listeners/ElementListeners.vue'
import ElementProperties from './properties/ElementProperties.vue'
// import ElementForm from './form/ElementForm.vue'
import UserTaskListeners from './listeners/UserTaskListeners.vue'
import { getTaskCollapseItemName, isTaskCollapseItemShow } from './task/data'

defineOptions({ name: 'MyPropertiesPanel' })

/**
 * sidebar
 */
const props = defineProps({
  bpmnModeler: {
    type: Object,
    default: () => {}
  },
  prefix: {
    type: String,
    default: 'camunda'
  },
  width: {
    type: Number,
    default: 480
  },
  idEditDisabled: {
    type: Boolean,
    default: false
  },
  model: Object // Data of process model
})

const activeTab = ref('base')
const elementId = ref('')
const elementType = ref('')
const elementBusinessObject = ref<any>({}) // element businessObject image，Provide for use by components that require judgment
const conditionFormVisible = ref(false) // Flow condition setting
const formVisible = ref(false) // Form configuration
const bpmnElement = ref()
const isReady = ref(false)

provide('prefix', props.prefix)
provide('width', props.width)

// initialization bpmnInstances
const initBpmnInstances = () => {
  if (!props.bpmnModeler) return false
  try {
    const instances = {
      modeler: props.bpmnModeler,
      modeling: props.bpmnModeler.get('modeling'),
      moddle: props.bpmnModeler.get('moddle'),
      eventBus: props.bpmnModeler.get('eventBus'),
      bpmnFactory: props.bpmnModeler.get('bpmnFactory'),
      elementFactory: props.bpmnModeler.get('elementFactory'),
      elementRegistry: props.bpmnModeler.get('elementRegistry'),
      replace: props.bpmnModeler.get('replace'),
      selection: props.bpmnModeler.get('selection')
    }

    // Check if all instances exist
    const allInstancesExist = Object.values(instances).every(instance => instance)
    if (allInstancesExist) {
      const w = window as any
      w.bpmnInstances = instances
      return true
    }
    return false
  } catch (error) {
    console.error('initialization bpmnInstances fail:', error)
    return false
  }
}

const bpmnInstances = () => (window as any)?.bpmnInstances

// monitor props.bpmnModeler then initModels
const unwatchBpmn = watch(
  () => props.bpmnModeler,
  async () => {
    // Avoid loading flow chart Not loaded yet
    if (!props.bpmnModeler) {
      console.log('lackprops.bpmnModeler')
      return
    }

    try {
      // Wait for the modeler to finish initializing.
      await nextTick()
      if (initBpmnInstances()) {
        isReady.value = true
        await nextTick()
        getActiveElement()
      } else {
        console.error('modeler Instance not fully initialized')
      }
    } catch (error) {
      console.error('initialization failed:', error)
    }
  },
  {
    immediate: true
  }
)

const getActiveElement = () => {
  if (!isReady.value || !props.bpmnModeler) return

  // Initial first selected element bpmn:Process
  initFormOnChanged(null)
  props.bpmnModeler.on('import.done', (e) => {
    console.log(e, 'eeeee')
    initFormOnChanged(null)
  })
  // Monitor and select events，Modify the currently activated elements and forms
  props.bpmnModeler.on('selection.changed', ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null)
  })
  props.bpmnModeler.on('element.changed', ({ element }) => {
    // ensure modify "Default flow path" When events occur that require modifying multiple elements，The elements of the updated form are inconsistent with the original selected elements。
    if (element && element.id === elementId.value) {
      initFormOnChanged(element)
    }
  })
}

// Initialize data
const initFormOnChanged = (element) => {
  if (!isReady.value || !bpmnInstances()) return

  let activatedElement = element
  if (!activatedElement) {
    activatedElement =
      bpmnInstances().elementRegistry.find((el) => el.type === 'bpmn:Process') ??
      bpmnInstances().elementRegistry.find((el) => el.type === 'bpmn:Collaboration')
  }
  if (!activatedElement) return

  try {
    console.log(`
                ----------
        select element changed:
                  id:  ${activatedElement.id}
                type:  ${activatedElement.businessObject.$type}
                ----------
                `)
    console.log('businessObject: ', activatedElement.businessObject)
    bpmnInstances().bpmnElement = activatedElement
    bpmnElement.value = activatedElement
    elementId.value = activatedElement.id
    elementType.value = activatedElement.type.split(':')[1] || ''
    elementBusinessObject.value = JSON.parse(JSON.stringify(activatedElement.businessObject))
    conditionFormVisible.value = !!(
      elementType.value === 'SequenceFlow' &&
      activatedElement.source &&
      activatedElement.source.type.indexOf('StartEvent') === -1
    )
    formVisible.value = elementType.value === 'UserTask' || elementType.value === 'StartEvent'
  } catch (error) {
    console.error('Initialization of form data failed:', error)
  }
}

onBeforeUnmount(() => {
  const w = window as any
  w.bpmnInstances = null
  isReady.value = false
})

watch(
  () => elementId.value,
  () => {
    activeTab.value = 'base'
  }
)
</script>
