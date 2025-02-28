<template>
  <div class="panel-tab__content">
    <el-form label-width="80px">
      <el-form-item label="Process Form">
        <!--        <el-input v-model="formKey" clearable @change="updateElementFormKey" />-->
        <el-select v-model="formKey" clearable @change="updateElementFormKey">
          <el-option v-for="form in formList" :key="form.id" :label="form.name" :value="form.id" />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="Business Key">-->
      <!--        <el-select v-model="businessKey" @change="updateElementBusinessKey">-->
      <!--          <el-option v-for="i in fieldList" :key="i.id" :value="i.id" :label="i.label" />-->
      <!--          <el-option label="None" value="" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
    </el-form>

    <!--Field List-->
    <!--    <div class="element-property list-property">-->
    <!--      <el-divider><Icon icon="ep:coin" /> Form Field </el-divider>-->
    <!--      <el-table :data="fieldList" max-height="240" fit border>-->
    <!--        <el-table-column label="ID" type="index" width="50px" />-->
    <!--        <el-table-column label="Field Name" prop="label" min-width="80px" show-overflow-tooltip />-->
    <!--        <el-table-column-->
    <!--          label="Field Type"-->
    <!--          prop="type"-->
    <!--          min-width="80px"-->
    <!--          :formatter="(row) => fieldType[row.type] || row.type"-->
    <!--          show-overflow-tooltip-->
    <!--        />-->
    <!--        <el-table-column-->
    <!--          label="Default Value"-->
    <!--          prop="defaultValue"-->
    <!--          min-width="80px"-->
    <!--          show-overflow-tooltip-->
    <!--        />-->
    <!--        <el-table-column label="Operation" width="90px">-->
    <!--          <template #default="scope">-->
    <!--            <el-button type="primary" link @click="openFieldForm(scope, scope.$index)"-->
    <!--              >Edit</el-button-->
    <!--            >-->
    <!--            <el-divider direction="vertical" />-->
    <!--            <el-button-->
    <!--              type="primary"-->
    <!--              link-->
    <!--              style="color: #ff4d4f"-->
    <!--              @click="removeField(scope, scope.$index)"-->
    <!--              >Remove</el-button-->
    <!--            >-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--      </el-table>-->
    <!--    </div>-->
    <!--    <div class="element-drawer__button">-->
    <!--      <XButton type="primary" proIcon="ep:plus" title="Add Field" @click="openFieldForm(null, -1)" />-->
    <!--    </div>-->

    <!--Field Configuration Sidebar-->
    <!--    <el-drawer-->
    <!--      v-model="fieldModelVisible"-->
    <!--      title="Field Configuration"-->
    <!--      :size="`${width}px`"-->
    <!--      append-to-body-->
    <!--      destroy-on-close-->
    <!--    >-->
    <!--      <el-form :model="formFieldForm" label-width="90px">-->
    <!--        <el-form-item label="Field ID">-->
    <!--          <el-input v-model="formFieldForm.id" clearable />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Type">-->
    <!--          <el-select-->
    <!--            v-model="formFieldForm.typeType"-->
    <!--            placeholder="Please select field type"-->
    <!--            clearable-->
    <!--            @change="changeFieldTypeType"-->
    <!--          >-->
    <!--            <el-option v-for="(value, key) of fieldType" :label="value" :value="key" :key="key" />-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Type Name" v-if="formFieldForm.typeType === 'custom'">-->
    <!--          <el-input v-model="formFieldForm.type" clearable />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Name">-->
    <!--          <el-input v-model="formFieldForm.label" clearable />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Time Format" v-if="formFieldForm.typeType === 'date'">-->
    <!--          <el-input v-model="formFieldForm.datePattern" clearable />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Default Value">-->
    <!--          <el-input v-model="formFieldForm.defaultValue" clearable />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->

    <!--      &lt;!&ndash; Enumeration value setting &ndash;&gt;-->
    <!--      <template v-if="formFieldForm.type === 'enum'">-->
    <!--        <el-divider key="enum-divider" />-->
    <!--        <p class="listener-filed__title" key="enum-title">-->
    <!--          <span><Icon icon="ep:menu" />List of Enum：</span>-->
    <!--          <el-button type="primary" @click="openFieldOptionForm(null, -1, 'enum')"-->
    <!--            >Add Enume</el-button-->
    <!--          >-->
    <!--        </p>-->
    <!--        <el-table :data="fieldEnumList" key="enum-table" max-height="240" fit border>-->
    <!--          <el-table-column label="ID" width="50px" type="index" />-->
    <!--          <el-table-column label="Enum ID" prop="id" min-width="100px" show-overflow-tooltip />-->
    <!--          <el-table-column label="Enum Name" prop="name" min-width="100px" show-overflow-tooltip />-->
    <!--          <el-table-column label="Operation" width="90px">-->
    <!--            <template #default="scope">-->
    <!--              <el-button-->
    <!--                type="primary"-->
    <!--                link-->
    <!--                @click="openFieldOptionForm(scope, scope.$index, 'enum')"-->
    <!--                >Edit</el-button-->
    <!--              >-->
    <!--              <el-divider direction="vertical" />-->
    <!--              <el-button-->
    <!--                type="primary"-->
    <!--                link-->
    <!--                style="color: #ff4d4f"-->
    <!--                @click="removeFieldOptionItem(scope, scope.$index, 'enum')"-->
    <!--                >Remove</el-button-->
    <!--              >-->
    <!--            </template>-->
    <!--          </el-table-column>-->
    <!--        </el-table>-->
    <!--      </template>-->

    <!--      &lt;!&ndash; Verification rules &ndash;&gt;-->
    <!--      <el-divider key="validation-divider" />-->
    <!--      <p class="listener-filed__title" key="validation-title">-->
    <!--        <span><Icon icon="ep:menu" />Constraint condition list：</span>-->
    <!--        <el-button type="primary" @click="openFieldOptionForm(null, -1, 'constraint')"-->
    <!--          >Add constraints</el-button-->
    <!--        >-->
    <!--      </p>-->
    <!--      <el-table :data="fieldConstraintsList" key="validation-table" max-height="240" fit border>-->
    <!--        <el-table-column label="ID" width="50px" type="index" />-->
    <!--        <el-table-column label="Constraint Name" prop="name" min-width="100px" show-overflow-tooltip />-->
    <!--        <el-table-column label="Constraint Config" prop="config" min-width="100px" show-overflow-tooltip />-->
    <!--        <el-table-column label="Operation" width="90px">-->
    <!--          <template #default="scope">-->
    <!--            <el-button-->
    <!--              type="primary"-->
    <!--              link-->
    <!--              @click="openFieldOptionForm(scope, scope.$index, 'constraint')"-->
    <!--              >Edit</el-button-->
    <!--            >-->
    <!--            <el-divider direction="vertical" />-->
    <!--            <el-button-->
    <!--              type="primary"-->
    <!--              link-->
    <!--              style="color: #ff4d4f"-->
    <!--              @click="removeFieldOptionItem(scope, scope.$index, 'constraint')"-->
    <!--              >Remove</el-button-->
    <!--            >-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--      </el-table>-->

    <!--      &lt;!&ndash; form properties  &ndash;&gt;-->
    <!--      <el-divider key="property-divider" />-->
    <!--      <p class="listener-filed__title" key="property-title">-->
    <!--        <span><Icon icon="ep:menu" />Field Attribute List：</span>-->
    <!--        <el-button type="primary" @click="openFieldOptionForm(null, -1, 'property')"-->
    <!--          >Add Attribute</el-button-->
    <!--        >-->
    <!--      </p>-->
    <!--      <el-table :data="fieldPropertiesList" key="property-table" max-height="240" fit border>-->
    <!--        <el-table-column label="ID" width="50px" type="index" />-->
    <!--        <el-table-column label="Attribute Number" prop="id" min-width="100px" show-overflow-tooltip />-->
    <!--        <el-table-column label="Attribute Value" prop="value" min-width="100px" show-overflow-tooltip />-->
    <!--        <el-table-column label="Operation" width="90px">-->
    <!--          <template #default="scope">-->
    <!--            <el-button-->
    <!--              type="primary"-->
    <!--              link-->
    <!--              @click="openFieldOptionForm(scope, scope.$index, 'property')"-->
    <!--              >Edit</el-button-->
    <!--            >-->
    <!--            <el-divider direction="vertical" />-->
    <!--            <el-button-->
    <!--              type="primary"-->
    <!--              link-->
    <!--              style="color: #ff4d4f"-->
    <!--              @click="removeFieldOptionItem(scope, scope.$index, 'property')"-->
    <!--              >Remove</el-button-->
    <!--            >-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--      </el-table>-->

    <!--      &lt;!&ndash; Bottom Button &ndash;&gt;-->
    <!--      <div class="element-drawer__button">-->
    <!--        <el-button>Cancel</el-button>-->
    <!--        <el-button type="primary" @click="saveField">Save</el-button>-->
    <!--      </div>-->
    <!--    </el-drawer>-->

    <!--    <el-dialog-->
    <!--      v-model="fieldOptionModelVisible"-->
    <!--      :title="optionModelTitle"-->
    <!--      width="600px"-->
    <!--      append-to-body-->
    <!--      destroy-on-close-->
    <!--    >-->
    <!--      <el-form :model="fieldOptionForm" label-width="96px">-->
    <!--        <el-form-item label="Number/ID" v-if="fieldOptionType !== 'constraint'" key="option-id">-->
    <!--          <el-input v-model="fieldOptionForm.id" clearable />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Name" v-if="fieldOptionType !== 'property'" key="option-name">-->
    <!--          <el-input v-model="fieldOptionForm.name" clearable />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Configure" v-if="fieldOptionType === 'constraint'" key="option-config">-->
    <!--          <el-input v-model="fieldOptionForm.config" clearable />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Value" v-if="fieldOptionType === 'property'" key="option-value">-->
    <!--          <el-input v-model="fieldOptionForm.value" clearable />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <el-button @click="fieldOptionModelVisible = false">Cancel</el-button>-->
    <!--        <el-button type="primary" @click="saveFieldOption">Confirm</el-button>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script lang="ts" setup>
import * as FormApi from '@/api/bpm/form'

defineOptions({ name: 'ElementForm' })

const props = defineProps({
  id: String,
  type: String
})
const prefix = inject('prefix')
const width = inject('width')

const formKey = ref('')
const businessKey = ref('')
const optionModelTitle = ref('')
const fieldList = ref<any[]>([])
const formFieldForm = ref<any>({})
const fieldType = ref({
  long: 'Long',
  string: 'String',
  boolean: 'Boolean ',
  date: 'Date',
  enum: 'Enum',
  custom: 'Custom'
})
const formFieldIndex = ref(-1) // Fields in Editing， -1 to add
const formFieldOptionIndex = ref(-1) // Field configuration items in editing， -1 To add
const fieldModelVisible = ref(false)
const fieldOptionModelVisible = ref(false)
const fieldOptionForm = ref<any>({}) // Current activated field configuration item data
const fieldOptionType = ref('') // The currently activated field configuration item pop-up window type
const fieldEnumList = ref<any[]>([]) // List of enumerated values
const fieldConstraintsList = ref<any[]>([]) // Constraint condition list
const fieldPropertiesList = ref<any[]>([]) // Bind attribute list
const bpmnELement = ref()
const elExtensionElements = ref()
const formData = ref()
const otherExtensions = ref()

const bpmnInstances = () => (window as any)?.bpmnInstances
const resetFormList = () => {
  bpmnELement.value = bpmnInstances().bpmnElement
  formKey.value = bpmnELement.value.businessObject.formKey
  // if (formKey.value?.length > 0) {
  //   formKey.value = parseInt(formKey.value)
  // }
  // Get element extension properties perhaps Create extended attributes
  elExtensionElements.value =
    bpmnELement.value.businessObject.get('extensionElements') ||
    bpmnInstances().moddle.create('bpmn:ExtensionElements', { values: [] })
  // Get element form configuration perhaps Create a new form configuration
  formData.value =
    elExtensionElements.value.values.filter((ex) => ex.$type === `${prefix}:FormData`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:FormData`, { fields: [] })

  // Business Identification businessKey， Bind in formData
  businessKey.value = formData.value.businessKey

  // Keep the remaining extension elements，Easy to update the corresponding attribute of the element later
  otherExtensions.value = elExtensionElements.value.values.filter(
    (ex) => ex.$type !== `${prefix}:FormData`
  )

  // Copy the original value，Fill in the table
  fieldList.value = JSON.parse(JSON.stringify(formData.value.fields || []))

  // Update element extension properties，Avoid subsequent errors
  updateElementExtensions()
}
const updateElementFormKey = () => {
  bpmnInstances().modeling.updateProperties(toRaw(bpmnELement.value), {
    formKey: formKey.value
  })
}
const updateElementBusinessKey = () => {
  bpmnInstances().modeling.updateModdleProperties(toRaw(bpmnELement.value), formData.value, {
    businessKey: businessKey.value
  })
}
// Adjust fields based on type
const changeFieldTypeType = (type) => {
  // this.$set(this.formFieldForm, "type", type === "custom" ? "" : type);
  formFieldForm.value['type'] = type === 'custom' ? '' : type
}

// Open the field details sidebar
const openFieldForm = (field, index) => {
  formFieldIndex.value = index
  if (index !== -1) {
    const FieldObject = formData.value.fields[index]
    formFieldForm.value = JSON.parse(JSON.stringify(field))
    // Set custom type
    // this.$set(this.formFieldForm, "typeType", !this.fieldType[field.type] ? "custom" : field.type);
    formFieldForm.value['typeType'] = !fieldType.value[field.type] ? 'custom' : field.type
    // Initialize enumeration value list
    field.type === 'enum' &&
      (fieldEnumList.value = JSON.parse(JSON.stringify(FieldObject?.values || [])))
    // Initialize constraint condition list
    fieldConstraintsList.value = JSON.parse(
      JSON.stringify(FieldObject?.validation?.constraints || [])
    )
    // Initialize custom attribute list
    fieldPropertiesList.value = JSON.parse(JSON.stringify(FieldObject?.properties?.values || []))
  } else {
    formFieldForm.value = {}
    // Initialize enumeration value list
    fieldEnumList.value = []
    // Initialize constraint condition list
    fieldConstraintsList.value = []
    // Initialize custom attribute list
    fieldPropertiesList.value = []
  }
  fieldModelVisible.value = true
}
// Open Field A certain one Configuration items pop-up notification
const openFieldOptionForm = (option, index, type) => {
  fieldOptionModelVisible.value = true
  fieldOptionType.value = type
  formFieldOptionIndex.value = index
  if (type === 'property') {
    fieldOptionForm.value = option ? JSON.parse(JSON.stringify(option)) : {}
    return (optionModelTitle.value = 'Attribute Config')
  }
  if (type === 'enum') {
    fieldOptionForm.value = option ? JSON.parse(JSON.stringify(option)) : {}
    return (optionModelTitle.value = 'Enum Config')
  }
  fieldOptionForm.value = option ? JSON.parse(JSON.stringify(option)) : {}
  return (optionModelTitle.value = 'Constraint Config')
}

// Save Fields A certain one Configuration items
const saveFieldOption = () => {
  if (formFieldOptionIndex.value === -1) {
    if (fieldOptionType.value === 'property') {
      fieldPropertiesList.value.push(fieldOptionForm.value)
    }
    if (fieldOptionType.value === 'constraint') {
      fieldConstraintsList.value.push(fieldOptionForm.value)
    }
    if (fieldOptionType.value === 'enum') {
      fieldEnumList.value.push(fieldOptionForm.value)
    }
  } else {
    fieldOptionType.value === 'property' &&
      fieldPropertiesList.value.splice(formFieldOptionIndex.value, 1, fieldOptionForm.value)
    fieldOptionType.value === 'constraint' &&
      fieldConstraintsList.value.splice(formFieldOptionIndex.value, 1, fieldOptionForm.value)
    fieldOptionType.value === 'enum' &&
      fieldEnumList.value.splice(formFieldOptionIndex.value, 1, fieldOptionForm.value)
  }
  fieldOptionModelVisible.value = false
  fieldOptionForm.value = {}
}
// Save field configuration
const saveField = () => {
  const { id, type, label, defaultValue, datePattern } = formFieldForm.value
  const Field = bpmnInstances().moddle.create(`${prefix}:FormField`, { id, type, label })
  defaultValue && (Field.defaultValue = defaultValue)
  datePattern && (Field.datePattern = datePattern)
  // Build attributes
  if (fieldPropertiesList.value && fieldPropertiesList.value.length) {
    const fieldPropertyList = fieldPropertiesList.value.map((fp) => {
      return bpmnInstances().moddle.create(`${prefix}:Property`, {
        id: fp.id,
        value: fp.value
      })
    })
    Field.properties = bpmnInstances().moddle.create(`${prefix}:Properties`, {
      values: fieldPropertyList
    })
  }
  // Build verification rules
  if (fieldConstraintsList.value && fieldConstraintsList.value.length) {
    const fieldConstraintList = fieldConstraintsList.value.map((fc) => {
      return bpmnInstances().moddle.create(`${prefix}:Constraint`, {
        name: fc.name,
        config: fc.config
      })
    })
    Field.validation = bpmnInstances().moddle.create(`${prefix}:Validation`, {
      constraints: fieldConstraintList
    })
  }
  // Build enumeration values
  if (fieldEnumList.value && fieldEnumList.value.length) {
    Field.values = fieldEnumList.value.map((fe) => {
      return bpmnInstances().moddle.create(`${prefix}:Value`, { name: fe.name, id: fe.id })
    })
  }
  // Update array With Form configuration instance
  if (formFieldIndex.value === -1) {
    fieldList.value.push(formFieldForm.value)
    formData.value.fields.push(Field)
  } else {
    fieldList.value.splice(formFieldIndex.value, 1, formFieldForm.value)
    formData.value.fields.splice(formFieldIndex.value, 1, Field)
  }
  updateElementExtensions()
  fieldModelVisible.value = false
}

// Remove a certain Field's Configuration items
const removeFieldOptionItem = (option, index, type) => {
  // console.log(option, 'option')
  if (type === 'property') {
    fieldPropertiesList.value.splice(index, 1)
    return
  }
  if (type === 'enum') {
    fieldEnumList.value.splice(index, 1)
    return
  }
  fieldConstraintsList.value.splice(index, 1)
}
// remove field
const removeField = (field, index) => {
  console.log(field, 'field')
  fieldList.value.splice(index, 1)
  formData.value.fields.splice(index, 1)
  updateElementExtensions()
}

const updateElementExtensions = () => {
  // Update back to extended elements
  const newElExtensionElements = bpmnInstances().moddle.create(`bpmn:ExtensionElements`, {
    values: otherExtensions.value.concat(formData.value)
  })
  // Update to element
  bpmnInstances().modeling.updateProperties(toRaw(bpmnELement.value), {
    extensionElements: newElExtensionElements
  })
}

const formList = ref([]) // The data in the dropdown box of the process form
onMounted(async () => {
  formList.value = await FormApi.getFormSimpleList()
})

watch(
  () => props.id,
  (val) => {
    val &&
      val.length &&
      nextTick(() => {
        resetFormList()
      })
  },
  { immediate: true }
)
</script>
