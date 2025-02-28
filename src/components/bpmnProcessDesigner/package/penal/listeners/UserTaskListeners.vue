<template>
  <div class="panel-tab__content">
    <el-table :data="elementListenersList" size="small" border>
      <el-table-column label="ID" width="50px" type="index" />
      <el-table-column
        label="Event Type"
        min-width="80px"
        show-overflow-tooltip
        :formatter="(row) => listenerEventTypeObject[row.event]"
      />
      <el-table-column label="Event ID" min-width="80px" prop="id" show-overflow-tooltip />
      <el-table-column
        label="Listener Type"
        min-width="80px"
        show-overflow-tooltip
        :formatter="(row) => listenerTypeObject[row.listenerType]"
      />
      <el-table-column label="Operation" width="90px">
        <template #default="scope">
          <el-button size="small" link @click="openListenerForm(scope.row, scope.$index)"
            >Edit</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            size="small"
            link
            style="color: #ff4d4f"
            @click="removeListener(scope.row, scope.$index)"
            >Remove</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <XButton
        size="small"
        type="primary"
        preIcon="ep:plus"
        title="Add Listener"
        @click="openListenerForm(null)"
      />
      <XButton
        type="success"
        preIcon="ep:select"
        title="Selection Listener "
        size="small"
        @click="openProcessListenerDialog"
      />
    </div>

    <!-- monitor edit/establish part -->
    <el-drawer
      v-model="listenerFormModelVisible"
      title="Task Listener"
      :size="`${width}px`"
      append-to-body
      destroy-on-close
    >
      <el-form size="small" :model="listenerForm" label-width="96px" ref="listenerFormRef">
        <el-form-item
          label="Event Type"
          prop="event"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-select v-model="listenerForm.event">
            <el-option
              v-for="i in Object.keys(listenerEventTypeObject)"
              :key="i"
              :label="listenerEventTypeObject[i]"
              :value="i"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Listener ID"
          prop="id"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.id" clearable />
        </el-form-item>
        <el-form-item
          label="Listener Type"
          prop="listenerType"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-select v-model="listenerForm.listenerType">
            <el-option
              v-for="i in Object.keys(listenerTypeObject)"
              :key="i"
              :label="listenerTypeObject[i]"
              :value="i"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'classListener'"
          label="Java Class"
          prop="class"
          key="listener-class"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.class" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'expressionListener'"
          label="Expression"
          prop="expression"
          key="listener-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.expression" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
          label="Proxy Expression"
          prop="delegateExpression"
          key="listener-delegate"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.delegateExpression" clearable />
        </el-form-item>
        <template v-if="listenerForm.listenerType === 'scriptListener'">
          <el-form-item
            label="Script Format"
            prop="scriptFormat"
            key="listener-script-format"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please fill in the script format' }"
          >
            <el-input v-model="listenerForm.scriptFormat" clearable />
          </el-form-item>
          <el-form-item
            label="Script Type"
            prop="scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please select script type' }"
          >
            <el-select v-model="listenerForm.scriptType">
              <el-option label="Inline Script " value="inlineScript" />
              <el-option label="External Script" value="externalScript" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'inlineScript'"
            label="Script Content"
            prop="value"
            key="listener-script"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please fill in the script content' }"
          >
            <el-input v-model="listenerForm.value" clearable />
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'externalScript'"
            label="Resource Url"
            prop="resource"
            key="listener-resource"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please fill in the resource url' }"
          >
            <el-input v-model="listenerForm.resource" clearable />
          </el-form-item>
        </template>

        <template v-if="listenerForm.event === 'timeout'">
          <el-form-item label="Timer Type" prop="eventDefinitionType" key="eventDefinitionType">
            <el-select v-model="listenerForm.eventDefinitionType">
              <el-option label="Date" value="date" />
              <el-option label="Duration" value="duration" />
              <el-option label="Loop" value="cycle" />
              <el-option label="None" value="null" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="!!listenerForm.eventDefinitionType && listenerForm.eventDefinitionType !== 'null'"
            label="Timer"
            prop="eventTimeDefinitions"
            key="eventTimeDefinitions"
            :rules="{ required: true, trigger: ['blur', 'change'], message: 'Please fill in the timer config' }"
          >
            <el-input v-model="listenerForm.eventTimeDefinitions" clearable />
          </el-form-item>
        </template>
      </el-form>

      <el-divider />
      <p class="listener-filed__title">
        <span><Icon icon="ep:menu" />Inject Fields：</span>
        <el-button size="small" type="primary" @click="openListenerFieldForm(null)"
          >Add Fields</el-button
        >
      </p>
      <el-table
        :data="fieldsListOfListener"
        size="small"
        max-height="240"
        fit
        border
        style="flex: none"
      >
        <el-table-column label="ID" width="50px" type="index" />
        <el-table-column label="Field Name" min-width="100px" prop="name" />
        <el-table-column
          label="Field Type"
          min-width="80px"
          show-overflow-tooltip
          :formatter="(row) => fieldTypeObject[row.fieldType]"
        />
        <el-table-column
          label="Field Value/Expression"
          min-width="100px"
          show-overflow-tooltip
          :formatter="(row) => row.string || row.expression"
        />
        <el-table-column label="Operation" width="100px">
          <template #default="scope">
            <el-button size="small" link @click="openListenerFieldForm(scope.row, scope.$index)"
              >Edit</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              size="small"
              link
              style="color: #ff4d4f"
              @click="removeListenerField(scope.row, scope.$index)"
              >Remove</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="element-drawer__button">
        <el-button size="small" @click="listenerFormModelVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="saveListenerConfig">Save</el-button>
      </div>
    </el-drawer>

    <!-- Inject into the western section edit/establish part -->
    <el-dialog
      title="Field Config"
      v-model="listenerFieldFormModelVisible"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        :model="listenerFieldForm"
        size="small"
        label-width="96px"
        ref="listenerFieldFormRef"
        style="height: 136px"
      >
        <el-form-item
          label="Field Name："
          prop="name"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.name" clearable />
        </el-form-item>
        <el-form-item
          label="Field Type："
          prop="fieldType"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-select v-model="listenerFieldForm.fieldType">
            <el-option
              v-for="i in Object.keys(fieldTypeObject)"
              :key="i"
              :label="fieldTypeObject[i]"
              :value="i"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'string'"
          label="Field Value："
          prop="string"
          key="field-string"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.string" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="Expression："
          prop="expression"
          key="field-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.expression" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="listenerFieldFormModelVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="saveListenerFiled">Confirm</el-button>
      </template>
    </el-dialog>
  </div>

  <!-- Select pop-up window -->
  <ProcessListenerDialog ref="processListenerDialogRef" @select="selectProcessListener" />
</template>
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { createListenerObject, updateElementExtensions } from '../../utils'
import {
  initListenerForm,
  initListenerType,
  eventType,
  listenerType,
  fieldType,
  initListenerForm2
} from './utilSelf'
import ProcessListenerDialog from '@/components/bpmnProcessDesigner/package/penal/listeners/ProcessListenerDialog.vue'

defineOptions({ name: 'UserTaskListeners' })

const props = defineProps({
  id: String,
  type: String
})
const prefix = inject('prefix')
const width = inject('width')
const elementListenersList = ref<any[]>([])
const listenerEventTypeObject = ref(eventType)
const listenerTypeObject = ref(listenerType)
const listenerFormModelVisible = ref(false)
const listenerForm = ref<any>({})
const fieldTypeObject = ref(fieldType)
const fieldsListOfListener = ref<any[]>([])
const listenerFieldFormModelVisible = ref(false) // monitor Inject Field Form Pop up Display status
const editingListenerIndex = ref(-1) // Index where the listener is located，-1 To add
const editingListenerFieldIndex = ref(-1) // Index where the field is located，-1 To add
const listenerFieldForm = ref<any>({}) // monitor Inject fields Details Form
const bpmnElement = ref()
const bpmnElementListeners = ref()
const otherExtensionList = ref()
const listenerFormRef = ref()
const listenerFieldFormRef = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances

const resetListenersList = () => {
  console.log(
    bpmnInstances().bpmnElement,
    'window.bpmnInstances.bpmnElementwindow.bpmnInstances.bpmnElementwindow.bpmnInstances.bpmnElementwindow.bpmnInstances.bpmnElementwindow.bpmnInstances.bpmnElementwindow.bpmnInstances.bpmnElement'
  )
  bpmnElement.value = bpmnInstances().bpmnElement
  otherExtensionList.value = []
  bpmnElementListeners.value =
    bpmnElement.value.businessObject?.extensionElements?.values.filter(
      (ex) => ex.$type === `${prefix}:TaskListener`
    ) ?? []
  elementListenersList.value = bpmnElementListeners.value.map((listener) =>
    initListenerType(listener)
  )
}
const openListenerForm = (listener, index?) => {
  if (listener) {
    listenerForm.value = initListenerForm(listener)
    editingListenerIndex.value = index
  } else {
    listenerForm.value = {}
    editingListenerIndex.value = -1 // Mark as New
  }
  if (listener && listener.fields) {
    fieldsListOfListener.value = listener.fields.map((field) => ({
      ...field,
      fieldType: field.string ? 'string' : 'expression'
    }))
  } else {
    fieldsListOfListener.value = []
    listenerForm.value['fields'] = []
  }
  // Open the sidebar and verify the status clearly
  listenerFormModelVisible.value = true
  nextTick(() => {
    if (listenerFormRef.value) listenerFormRef.value.clearValidate()
  })
}
// Remove the listener
const removeListener = (listener, index?) => {
  console.log(listener, 'listener')
  ElMessageBox.confirm('Are you sure to remove this listener？', 'Tips', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
    .then(() => {
      bpmnElementListeners.value.splice(index, 1)
      elementListenersList.value.splice(index, 1)
      updateElementExtensions(
        bpmnElement.value,
        otherExtensionList.value.concat(bpmnElementListeners.value)
      )
    })
    .catch(() => console.info('Operation Cancelled'))
}
// Save listener
const saveListenerConfig = async () => {
  let validateStatus = await listenerFormRef.value.validate()
  if (!validateStatus) return // If the verification fails, return directly
  const listenerObject = createListenerObject(listenerForm.value, true, prefix)
  if (editingListenerIndex.value === -1) {
    bpmnElementListeners.value.push(listenerObject)
    elementListenersList.value.push(listenerForm.value)
  } else {
    bpmnElementListeners.value.splice(editingListenerIndex.value, 1, listenerObject)
    elementListenersList.value.splice(editingListenerIndex.value, 1, listenerForm.value)
  }
  // Save other configurations
  otherExtensionList.value =
    bpmnElement.value.businessObject?.extensionElements?.values?.filter(
      (ex) => ex.$type !== `${prefix}:TaskListener`
    ) ?? []
  updateElementExtensions(
    bpmnElement.value,
    otherExtensionList.value.concat(bpmnElementListeners.value)
  )
  // 4. Hide sidebar
  listenerFormModelVisible.value = false
  listenerForm.value = {}
}
// Open the listener field editing pop-up window
const openListenerFieldForm = (field, index?) => {
  listenerFieldForm.value = field ? JSON.parse(JSON.stringify(field)) : {}
  editingListenerFieldIndex.value = field ? index : -1
  listenerFieldFormModelVisible.value = true
  nextTick(() => {
    if (listenerFieldFormRef.value) listenerFieldFormRef.value.clearValidate()
  })
}
// Save listener injection field
const saveListenerFiled = async () => {
  let validateStatus = await listenerFieldFormRef.value.validate()
  if (!validateStatus) return // If the verification fails, return directly
  if (editingListenerFieldIndex.value === -1) {
    fieldsListOfListener.value.push(listenerFieldForm.value)
    listenerForm.value.fields.push(listenerFieldForm.value)
  } else {
    fieldsListOfListener.value.splice(editingListenerFieldIndex.value, 1, listenerFieldForm.value)
    listenerForm.value.fields.splice(editingListenerFieldIndex.value, 1, listenerFieldForm.value)
  }
  listenerFieldFormModelVisible.value = false
  nextTick(() => {
    listenerFieldForm.value = {}
  })
}
// Remove listener field
const removeListenerField = (field, index) => {
  console.log(field, 'field')
  ElMessageBox.confirm('Are you sure to remove this field？', 'Tips', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
    .then(() => {
      fieldsListOfListener.value.splice(index, 1)
      listenerForm.value.fields.splice(index, 1)
    })
    .catch(() => console.info('Operation Cancelled'))
}

// Open the listener pop-up window
const processListenerDialogRef = ref()
const openProcessListenerDialog = async () => {
  processListenerDialogRef.value.open('task')
}
const selectProcessListener = (listener) => {
  const listenerForm = initListenerForm2(listener)
  const listenerObject = createListenerObject(listenerForm, true, prefix)
  bpmnElementListeners.value.push(listenerObject)
  elementListenersList.value.push(listenerForm)

  // Save other configurations
  otherExtensionList.value =
    bpmnElement.value.businessObject?.extensionElements?.values?.filter(
      (ex) => ex.$type !== `${prefix}:TaskListener`
    ) ?? []
  updateElementExtensions(
    bpmnElement.value,
    otherExtensionList.value.concat(bpmnElementListeners.value)
  )
}

watch(
  () => props.id,
  (val) => {
    val &&
      val.length &&
      nextTick(() => {
        resetListenersList()
      })
  },
  { immediate: true }
)
</script>
