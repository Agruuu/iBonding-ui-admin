<template>
  <div class="panel-tab__content">
    <el-form label-width="90px" :model="needProps" :rules="rules">
      <div v-if="needProps.type == 'bpmn:Process'">
        <!-- If it is Process When it comes to information，Use custom forms -->
        <el-form-item label="Process ID" prop="id">
          <el-input
            v-model="needProps.id"
            placeholder="Please enter the process id"
            :disabled="needProps.id !== undefined && needProps.id.length > 0"
            @change="handleKeyUpdate"
          />
        </el-form-item>
        <el-form-item label="Process Name" prop="name">
          <el-input
            v-model="needProps.name"
            placeholder="Please enter the process name"
            clearable
            @change="handleNameUpdate"
          />
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="ID">
          <el-input v-model="elementBaseInfo.id" clearable @change="updateBaseInfo('id')" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ElementBaseInfo' })

const props = defineProps({
  businessObject: {
    type: Object,
    default: () => {}
  },
  model: {
    type: Object,
    default: () => {}
  }
})
const needProps = ref<any>({})
const bpmnElement = ref()
const elementBaseInfo = ref<any>({})
// The data in the dropdown box of the process form
// const forms = ref([])
// Validation of Process Models
const rules = reactive({
  id: [{ required: true, message: 'Process ID cannot be empty', trigger: 'blur' }],
  name: [{ required: true, message: 'Process name cannot be empty', trigger: 'blur' }]
})

const bpmnInstances = () => (window as any)?.bpmnInstances
const resetBaseInfo = () => {
  console.log(window, 'window')
  console.log(bpmnElement.value, 'bpmnElement')

  bpmnElement.value = bpmnInstances()?.bpmnElement
  // console.log(bpmnElement.value, 'resetBaseInfo11111111111')
  elementBaseInfo.value = bpmnElement.value.businessObject
  needProps.value['type'] = bpmnElement.value.businessObject.$type
  // elementBaseInfo.value['typess'] = bpmnElement.value.businessObject.$type

  // elementBaseInfo.value = JSON.parse(JSON.stringify(bpmnElement.value.businessObject))
  // console.log(elementBaseInfo.value, 'elementBaseInfo22222222222')
}
const handleKeyUpdate = (value) => {
  // Validate the value of `value`. Only when it passes the XML NCName check should the assignment be made. Otherwise, it will cause errors in the flow chart and prevent its drawing.
  if (!value) {
    return
  }
  if (!value.match(/[a-zA-Z_][\-_.0-9a-zA-Z$]*/)) {
    console.log('The key does not meet the XML NCName rules, so no assignment is performed.')
    return
  }
  console.log('The key meets the XML NCName rules, so assignment is performed.')

  // In the BPMN XML, the process key actually corresponds to the id node.
  elementBaseInfo.value['id'] = value

  setTimeout(() => {
    updateBaseInfo('id')
  }, 100)
}
const handleNameUpdate = (value) => {
  console.log(elementBaseInfo, 'elementBaseInfo')
  if (!value) {
    return
  }
  elementBaseInfo.value['name'] = value

  setTimeout(() => {
    updateBaseInfo('name')
  }, 100)
}
// const handleDescriptionUpdate=(value)=> {
// TODO Agruuu：documentation Temporarily unable to modify，I'll take a look later
// this.elementBaseInfo['documentation'] = value;
// this.updateBaseInfo('documentation');
// }
const updateBaseInfo = (key) => {
  console.log(key, 'key')
  // trigger elementBaseInfo Corresponding fields
  const attrObj = Object.create(null)
  // console.log(attrObj, 'attrObj')
  attrObj[key] = elementBaseInfo.value[key]
  // console.log(attrObj, 'attrObj111')
  // const attrObj = {
  //   id: elementBaseInfo.value[key]
  //   // di: { id: `${elementBaseInfo.value[key]}_di` }
  // }
  // console.log(elementBaseInfo, 'elementBaseInfo11111111111')
  needProps.value = { ...elementBaseInfo.value, ...needProps.value }

  if (key === 'id') {
    // console.log('jinru')
    console.log(window, 'window')
    console.log(bpmnElement.value, 'bpmnElement')
    console.log(toRaw(bpmnElement.value), 'bpmnElement')
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      id: elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` }
    })
  } else {
    console.log(attrObj, 'attrObj')
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), attrObj)
  }
}

watch(
  () => props.businessObject,
  (val) => {
    // console.log(val, 'val11111111111111111111')
    if (val) {
      // nextTick(() => {
      resetBaseInfo()
      // })
    }
  }
)

watch(
  () => props.model?.key,
  (val) => {
    // When uploading a BPMN flowchart, ensure the update of the key and name.
    if (val) {
      handleKeyUpdate(props.model.key)
      handleNameUpdate(props.model.name)
    }
  },
  {
    immediate: true
  }
)

// watch(
//   () => ({ ...props }),
//   (oldVal, newVal) => {
//     console.log(oldVal, 'oldVal')
//     console.log(newVal, 'newVal')
//     if (newVal) {
//       needProps.value = newVal
//     }
//   },
//   {
//     immediate: true
//   }
// )
// 'model.key': {
//   immediate: false,
//   handler: function (val) {
//     this.handleKeyUpdate(val)
//   }
// }
onBeforeUnmount(() => {
  bpmnElement.value = null
})
</script>
