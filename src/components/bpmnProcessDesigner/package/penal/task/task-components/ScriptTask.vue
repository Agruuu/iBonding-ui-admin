<template>
  <div style="margin-top: 16px">
    <el-form-item label="Script Format">
      <el-input
        v-model="scriptTaskForm.scriptFormat"
        clearable
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </el-form-item>
    <el-form-item label="Script Type">
      <el-select v-model="scriptTaskForm.scriptType">
        <el-option label="Inline Script " value="inline" />
        <el-option label="External Resources" value="external" />
      </el-select>
    </el-form-item>
    <el-form-item label="Script" v-show="scriptTaskForm.scriptType === 'inline'">
      <el-input
        v-model="scriptTaskForm.script"
        type="textarea"
        resize="vertical"
        :autosize="{ minRows: 2, maxRows: 4 }"
        clearable
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </el-form-item>
    <el-form-item label="Resource Url" v-show="scriptTaskForm.scriptType === 'external'">
      <el-input
        v-model="scriptTaskForm.resource"
        clearable
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </el-form-item>
    <el-form-item label="Result Variable">
      <el-input
        v-model="scriptTaskForm.resultVariable"
        clearable
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'ScriptTask' })
const props = defineProps({
  id: String,
  type: String
})
const defaultTaskForm = ref({
  scriptFormat: '',
  script: '',
  resource: '',
  resultVariable: ''
})
const scriptTaskForm = ref<any>({})
const bpmnElement = ref()

const bpmnInstances = () => (window as any)?.bpmnInstances

const resetTaskForm = () => {
  for (let key in defaultTaskForm.value) {
    let value = bpmnElement.value?.businessObject[key] || defaultTaskForm.value[key]
    scriptTaskForm.value[key] = value
  }
  scriptTaskForm.value.scriptType = scriptTaskForm.value.script ? 'inline' : 'external'
}
const updateElementTask = () => {
  let taskAttr = Object.create(null)
  taskAttr.scriptFormat = scriptTaskForm.value.scriptFormat || null
  taskAttr.resultVariable = scriptTaskForm.value.resultVariable || null
  if (scriptTaskForm.value.scriptType === 'inline') {
    taskAttr.script = scriptTaskForm.value.script || null
    taskAttr.resource = null
  } else {
    taskAttr.resource = scriptTaskForm.value.resource || null
    taskAttr.script = null
  }
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), taskAttr)
}

onBeforeUnmount(() => {
  bpmnElement.value = null
})

watch(
  () => props.id,
  () => {
    bpmnElement.value = bpmnInstances().bpmnElement
    nextTick(() => {
      resetTaskForm()
    })
  },
  { immediate: true }
)
</script>
