<template>
  <div class="panel-tab__content">
    <el-radio-group
      v-if="type === 'UserTask'"
      v-model="approveMethod"
      @change="onApproveMethodChange"
    >
      <div class="flex-col">
        <div v-for="(item, index) in APPROVE_METHODS" :key="index">
          <el-radio :value="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
          <el-form-item prop="approveRatio">
            <el-input-number
              v-model="approveRatio"
              :min="10"
              :max="100"
              :step="10"
              size="small"
              v-if="
                item.value === ApproveMethodType.APPROVE_BY_RATIO &&
                approveMethod === ApproveMethodType.APPROVE_BY_RATIO
              "
              @change="onApproveRatioChange"
            />
          </el-form-item>
        </div>
      </div>
    </el-radio-group>
    <div v-else>
      The implementation of multi - instance for nodes other than UserTask remains to be done.
    </div>
    <!-- Merge with the Simple designer configuration while keeping the previous code. -->
    <el-form label-width="90px" style="display: none">
      <el-form-item label="Quick Config">
        <el-button size="small" @click="changeConfig('Sequential Approval')">Sequential Approval</el-button>
        <el-button size="small" @click="changeConfig('Countersign')">Countersign</el-button>
        <el-button size="small" @click="changeConfig('Optional Sign')">Optional Sign</el-button>
      </el-form-item>
      <el-form-item label="Countersign Type">
        <el-select v-model="loopCharacteristics" @change="changeLoopCharacteristicsType">
          <el-option label="Parallel Multi Instance" value="ParallelMultiInstance" />
          <el-option label="Sequential Multi Instance" value="SequentialMultiInstance" />
          <el-option label="None" value="Null" />
        </el-select>
      </el-form-item>
      <template
        v-if="
          loopCharacteristics === 'ParallelMultiInstance' ||
          loopCharacteristics === 'SequentialMultiInstance'
        "
      >
        <el-form-item label="Loop Count" key="loopCardinality">
          <el-input
            v-model="loopInstanceForm.loopCardinality"
            clearable
            @change="updateLoopCardinality"
          />
        </el-form-item>
        <el-form-item label="Collection" key="collection" v-show="false">
          <el-input v-model="loopInstanceForm.collection" clearable @change="updateLoopBase" />
        </el-form-item>
        <!-- add by Agruuu：Since the "element variables" are not needed for the time being, the `display` property here is set to `none`. -->
        <el-form-item label="Element Variable" key="elementVariable" style="display: none">
          <el-input v-model="loopInstanceForm.elementVariable" clearable @change="updateLoopBase" />
        </el-form-item>
        <el-form-item label="Completion Conditions" key="completionCondition">
          <el-input
            v-model="loopInstanceForm.completionCondition"
            clearable
            @change="updateLoopCondition"
          />
        </el-form-item>
        <!-- add by Agruuu：Since the "element variables" are not needed for the time being, the `display` property here is set to `none`. -->
        <el-form-item label="Async Status" key="async" style="display: none">
          <el-checkbox
            v-model="loopInstanceForm.asyncBefore"
            label="Async Before"
            value="Async Before"
            @change="updateLoopAsync('asyncBefore')"
          />
          <el-checkbox
            v-model="loopInstanceForm.asyncAfter"
            label="Async After"
            value="Async After"
            @change="updateLoopAsync('asyncAfter')"
          />
          <el-checkbox
            v-model="loopInstanceForm.exclusive"
            v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
            label="Exclude"
            value="Exclude"
            @change="updateLoopAsync('exclusive')"
          />
        </el-form-item>
        <el-form-item
          label="Retry Cycle "
          prop="timeCycle"
          v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
          key="timeCycle"
        >
          <el-input v-model="loopInstanceForm.timeCycle" clearable @change="updateLoopTimeCycle" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ApproveMethodType, APPROVE_METHODS } from '@/components/SimpleProcessDesignerV2/src/consts'

defineOptions({ name: 'ElementMultiInstance' })

const props = defineProps({
  businessObject: Object,
  type: String,
  id: String
})
const prefix = inject('prefix')
const loopCharacteristics = ref('')
//Default configuration，Used to overwrite non-existent options，Avoid error reporting
const defaultLoopInstanceForm = ref({
  completionCondition: '',
  loopCardinality: '',
  extensionElements: [],
  asyncAfter: false,
  asyncBefore: false,
  exclusive: false
})
const loopInstanceForm = ref<any>({})
const bpmnElement = ref(null)
const multiLoopInstance = ref(null)
const bpmnInstances = () => (window as any)?.bpmnInstances

const getElementLoop = (businessObject) => {
  if (!businessObject.loopCharacteristics) {
    loopCharacteristics.value = 'Null'
    loopInstanceForm.value = {}
    return
  }
  if (businessObject.loopCharacteristics.$type === 'bpmn:StandardLoopCharacteristics') {
    loopCharacteristics.value = 'StandardLoop'
    loopInstanceForm.value = {}
    return
  }
  if (businessObject.loopCharacteristics.isSequential) {
    loopCharacteristics.value = 'SequentialMultiInstance'
  } else {
    loopCharacteristics.value = 'ParallelMultiInstance'
  }
  // Merge configuration
  loopInstanceForm.value = {
    ...defaultLoopInstanceForm.value,
    ...businessObject.loopCharacteristics,
    completionCondition: businessObject.loopCharacteristics?.completionCondition?.body ?? '',
    loopCardinality: businessObject.loopCharacteristics?.loopCardinality?.body ?? ''
  }
  // Keep the `loopCharacteristics` instance on the current element's `businessObject`.
  multiLoopInstance.value = bpmnInstances().bpmnElement.businessObject.loopCharacteristics
  // Update Form
  if (
    businessObject.loopCharacteristics.extensionElements &&
    businessObject.loopCharacteristics.extensionElements.values &&
    businessObject.loopCharacteristics.extensionElements.values.length
  ) {
    loopInstanceForm.value['timeCycle'] =
      businessObject.loopCharacteristics.extensionElements.values[0].body
  }
}

const changeLoopCharacteristicsType = (type) => {
  // this.loopInstanceForm = { ...this.defaultLoopInstanceForm }; // Switch type and cancel the original form configuration
  // Cancel multi instance configuration
  if (type === 'Null') {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      loopCharacteristics: null
    })
    return
  }
  // Configure Loop
  if (type === 'StandardLoop') {
    const loopCharacteristicsObject = bpmnInstances().moddle.create(
      'bpmn:StandardLoopCharacteristics'
    )
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      loopCharacteristics: loopCharacteristicsObject
    })
    multiLoopInstance.value = null
    return
  }
  // sequential
  if (type === 'SequentialMultiInstance') {
    multiLoopInstance.value = bpmnInstances().moddle.create(
      'bpmn:MultiInstanceLoopCharacteristics',
      { isSequential: true }
    )
  } else {
    multiLoopInstance.value = bpmnInstances().moddle.create(
      'bpmn:MultiInstanceLoopCharacteristics',
      { collection: '${coll_userList}' }
    )
  }
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    loopCharacteristics: toRaw(multiLoopInstance.value)
  })
}

// Cyclic cardinality
const updateLoopCardinality = (cardinality) => {
  let loopCardinality = null
  if (cardinality && cardinality.length) {
    loopCardinality = bpmnInstances().moddle.create('bpmn:FormalExpression', {
      body: cardinality
    })
  }
  bpmnInstances().modeling.updateModdleProperties(
    toRaw(bpmnElement.value),
    multiLoopInstance.value,
    {
      loopCardinality
    }
  )
}

// Completion conditions
const updateLoopCondition = (condition) => {
  let completionCondition = null
  if (condition && condition.length) {
    completionCondition = bpmnInstances().moddle.create('bpmn:FormalExpression', {
      body: condition
    })
  }
  bpmnInstances().modeling.updateModdleProperties(
    toRaw(bpmnElement.value),
    multiLoopInstance.value,
    {
      completionCondition
    }
  )
}

// Retry Cycle 
const updateLoopTimeCycle = (timeCycle) => {
  const extensionElements = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: [
      bpmnInstances().moddle.create(`${prefix}:FailedJobRetryTimeCycle`, {
        body: timeCycle
      })
    ]
  })
  bpmnInstances().modeling.updateModdleProperties(
    toRaw(bpmnElement.value),
    multiLoopInstance.value,
    {
      extensionElements
    }
  )
}

// Directly updated basic information
const updateLoopBase = () => {
  bpmnInstances().modeling.updateModdleProperties(
    toRaw(bpmnElement.value),
    multiLoopInstance.value,
    {
      collection: loopInstanceForm.value.collection || null,
      elementVariable: loopInstanceForm.value.elementVariable || null
    }
  )
}

// Each asynchronous state
const updateLoopAsync = (key) => {
  const { asyncBefore, asyncAfter } = loopInstanceForm.value
  let asyncAttr = Object.create(null)
  if (!asyncBefore && !asyncAfter) {
    // this.$set(this.loopInstanceForm, "exclusive", false);
    loopInstanceForm.value['exclusive'] = false
    asyncAttr = { asyncBefore: false, asyncAfter: false, exclusive: false, extensionElements: null }
  } else {
    asyncAttr[key] = loopInstanceForm.value[key]
  }
  bpmnInstances().modeling.updateModdleProperties(
    toRaw(bpmnElement.value),
    multiLoopInstance.value,
    asyncAttr
  )
}

const changeConfig = (config) => {
  if (config === 'Sequential Approval') {
    changeLoopCharacteristicsType('SequentialMultiInstance')
    updateLoopCardinality('1')
    updateLoopCondition('${ nrOfCompletedInstances >= nrOfInstances }')
  } else if (config === 'Countersign') {
    changeLoopCharacteristicsType('ParallelMultiInstance')
    updateLoopCondition('${ nrOfCompletedInstances >= nrOfInstances }')
  } else if (config === 'Optional Sign') {
    changeLoopCharacteristicsType('ParallelMultiInstance')
    updateLoopCondition('${ nrOfCompletedInstances > 0 }')
  }
}

/**
 * -----New version with multiple instances-----
 */
const approveMethod = ref()
const approveRatio = ref(100)
const otherExtensions = ref()
const getElementLoopNew = () => {
  if (props.type === 'UserTask') {
    const extensionElements =
      bpmnElement.value.businessObject?.extensionElements ??
      bpmnInstances().moddle.create('bpmn:ExtensionElements', { values: [] })
    approveMethod.value = extensionElements.values.filter(
      (ex) => ex.$type === `${prefix}:ApproveMethod`
    )?.[0]?.value

    otherExtensions.value =
      extensionElements.values.filter((ex) => ex.$type !== `${prefix}:ApproveMethod`) ?? []

    if (!approveMethod.value) {
      approveMethod.value = ApproveMethodType.SEQUENTIAL_APPROVE
      updateLoopCharacteristics()
    }
  }
}
const onApproveMethodChange = () => {
  approveRatio.value = 100
  updateLoopCharacteristics()
}
const onApproveRatioChange = () => {
  updateLoopCharacteristics()
}
const updateLoopCharacteristics = () => {
  // Generate the multiInstanceLoopCharacteristics node based on the ApproveMethod.
  if (approveMethod.value === ApproveMethodType.RANDOM_SELECT_ONE_APPROVE) {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      loopCharacteristics: null
    })
  } else {
    if (approveMethod.value === ApproveMethodType.APPROVE_BY_RATIO) {
      multiLoopInstance.value = bpmnInstances().moddle.create(
        'bpmn:MultiInstanceLoopCharacteristics',
        { isSequential: false, collection: '${coll_userList}' }
      )
      multiLoopInstance.value.completionCondition = bpmnInstances().moddle.create(
        'bpmn:FormalExpression',
        {
          body: '${ nrOfCompletedInstances/nrOfInstances >= ' + approveRatio.value / 100 + '}'
        }
      )
    }
    if (approveMethod.value === ApproveMethodType.ANY_APPROVE) {
      multiLoopInstance.value = bpmnInstances().moddle.create(
        'bpmn:MultiInstanceLoopCharacteristics',
        { isSequential: false, collection: '${coll_userList}' }
      )
      multiLoopInstance.value.completionCondition = bpmnInstances().moddle.create(
        'bpmn:FormalExpression',
        {
          body: '${ nrOfCompletedInstances > 0 }'
        }
      )
    }
    if (approveMethod.value === ApproveMethodType.SEQUENTIAL_APPROVE) {
      multiLoopInstance.value = bpmnInstances().moddle.create(
        'bpmn:MultiInstanceLoopCharacteristics',
        { isSequential: true, collection: '${coll_userList}' }
      )
      multiLoopInstance.value.loopCardinality = bpmnInstances().moddle.create(
        'bpmn:FormalExpression',
        {
          body: '1'
        }
      )
      multiLoopInstance.value.completionCondition = bpmnInstances().moddle.create(
        'bpmn:FormalExpression',
        {
          body: '${ nrOfCompletedInstances >= nrOfInstances }'
        }
      )
    }
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      loopCharacteristics: toRaw(multiLoopInstance.value)
    })
  }

  // Add ApproveMethod to ExtensionElements.
  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: [
      ...otherExtensions.value,
      bpmnInstances().moddle.create(`${prefix}:ApproveMethod`, {
        value: approveMethod.value
      })
    ]
  })
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions
  })
}

onBeforeUnmount(() => {
  multiLoopInstance.value = null
  bpmnElement.value = null
})

watch(
  () => props.id,
  (val) => {
    if (val) {
      nextTick(() => {
        bpmnElement.value = bpmnInstances().bpmnElement
        // getElementLoop(val)
        getElementLoopNew()
      })
    }
  },
  { immediate: true }
)
</script>
