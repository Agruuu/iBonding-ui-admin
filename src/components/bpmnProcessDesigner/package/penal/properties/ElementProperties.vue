<template>
  <div class="panel-tab__content">
    <el-table :data="elementPropertyList" max-height="240" fit border>
      <el-table-column label="ID" width="50px" type="index" />
      <el-table-column label="Attribute Name" prop="name" min-width="100px" show-overflow-tooltip />
      <el-table-column label="Attribute Value" prop="value" min-width="100px" show-overflow-tooltip />
      <el-table-column label="Operation" width="110px">
        <template #default="scope">
          <el-button link @click="openAttributesForm(scope.row, scope.$index)" size="small">
            Edit
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            link
            size="small"
            style="color: #ff4d4f"
            @click="removeAttributes(scope.row, scope.$index)"
          >
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <XButton
        type="primary"
        preIcon="ep:plus"
        title="Add Attribute"
        @click="openAttributesForm(null, -1)"
      />
    </div>

    <el-dialog
      v-model="propertyFormModelVisible"
      title="Attribute Config"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form :model="propertyForm" label-width="80px" ref="attributeFormRef">
        <el-form-item label="Attribute Name：" prop="name">
          <el-input v-model="propertyForm.name" clearable />
        </el-form-item>
        <el-form-item label="Attribute Value：" prop="value">
          <el-input v-model="propertyForm.value" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="propertyFormModelVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveAttribute">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
defineOptions({ name: 'ElementProperties' })
const props = defineProps({
  id: String,
  type: String
})
const prefix = inject('prefix')
// const width = inject('width')

const elementPropertyList = ref<any[]>([])
const propertyForm = ref<any>({})
const editingPropertyIndex = ref(-1)
const propertyFormModelVisible = ref(false)
const bpmnElement = ref()
const otherExtensionList = ref()
const bpmnElementProperties = ref()
const bpmnElementPropertyList = ref()
const attributeFormRef = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances

const resetAttributesList = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  otherExtensionList.value = [] // Other extended configurations
  bpmnElementProperties.value =
    // bpmnElement.value.businessObject?.extensionElements?.filter((ex) => {
    bpmnElement.value.businessObject?.extensionElements?.values?.filter((ex) => {
      if (ex.$type !== `${prefix}:Properties`) {
        otherExtensionList.value.push(ex)
      }
      return ex.$type === `${prefix}:Properties`
    }) ?? [];

  // Save all Expand attribute fields
  bpmnElementPropertyList.value = bpmnElementProperties.value.reduce(
    (pre, current) => pre.concat(current.values),
    []
  )
  // copy display
  elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList.value ?? []))
}
const openAttributesForm = (attr, index) => {
  editingPropertyIndex.value = index
  propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr))
  propertyFormModelVisible.value = true
  nextTick(() => {
    if (attributeFormRef.value) attributeFormRef.value.clearValidate()
  })
}
const removeAttributes = (attr, index) => {
  console.log(attr, 'attr')
  ElMessageBox.confirm('Are you sure to remove this attribute？', 'Tips', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
    .then(() => {
      elementPropertyList.value.splice(index, 1)
      bpmnElementPropertyList.value.splice(index, 1)
      // Create a new save list for attribute fields
      const propertiesObject = bpmnInstances().moddle.create(`${prefix}:Properties`, {
        values: bpmnElementPropertyList.value
      })
      updateElementExtensions(propertiesObject)
      resetAttributesList()
    })
    .catch(() => console.info('Operation Cancelled'))
}
const saveAttribute = () => {
  console.log(propertyForm.value, 'propertyForm.value')
  const { name, value } = propertyForm.value
  if (editingPropertyIndex.value !== -1) {
    bpmnInstances().modeling.updateModdleProperties(
      toRaw(bpmnElement.value),
      toRaw(bpmnElementPropertyList.value)[toRaw(editingPropertyIndex.value)],
      {
        name,
        value
      }
    )
  } else {
    // New attribute field
    const newPropertyObject = bpmnInstances().moddle.create(`${prefix}:Property`, {
      name,
      value
    })
    // Create a new save list for attribute fields
    const propertiesObject = bpmnInstances().moddle.create(`${prefix}:Properties`, {
      values: bpmnElementPropertyList.value.concat([newPropertyObject])
    })
    updateElementExtensions(propertiesObject)
  }
  propertyFormModelVisible.value = false
  resetAttributesList()
}
const updateElementExtensions = (properties) => {
  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: otherExtensionList.value.concat([properties])
  })
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions
  })
}

watch(
  () => props.id,
  (val) => {
    if (val) {
      val && val.length && resetAttributesList()
    }
  },
  { immediate: true }
)
</script>
