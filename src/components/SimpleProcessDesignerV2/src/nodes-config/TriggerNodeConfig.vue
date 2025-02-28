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
        <el-form-item label="Trigger Type " prop="type">
          <el-select v-model="configForm.type">
            <el-option
              v-for="(item, index) in TRIGGER_TYPES"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <!-- HTTP Request trigger. -->
        <div
          v-if="configForm.type === TriggerTypeEnum.HTTP_REQUEST && configForm.httpRequestSetting"
        >
          <el-form-item>
            <el-alert
              title="Only supported POST request，Receive parameters in the form of a request body"
              type="warning"
              show-icon
              :closable="false"
            />
          </el-form-item>
          <!-- Request address. -->
          <el-form-item label="Request Url." prop="httpRequestSetting.url">
            <el-input v-model="configForm.httpRequestSetting.url" />
          </el-form-item>
          <!-- Request header and request body settings.-->
          <HttpRequestParamSetting
            :header="configForm.httpRequestSetting.header"
            :body="configForm.httpRequestSetting.body"
            :bind="'httpRequestSetting'"
          />
          <!-- Return value settings.-->
          <el-form-item label="Return Value">
            <el-alert
              title="The values of the process form can be modified based on the return value of the request."
              type="warning"
              show-icon
              :closable="false"
            />
          </el-form-item>
          <el-form-item>
            <div
              class="flex pt-2"
              v-for="(item, index) in configForm.httpRequestSetting.response"
              :key="index"
            >
              <div class="mr-2">
                <el-form-item
                  :prop="`httpRequestSetting.response.${index}.key`"
                  :rules="{
                    required: true,
                    message: 'Form fields cannot be empty.',
                    trigger: 'blur'
                  }"
                >
                  <el-select class="w-160px!" v-model="item.key" placeholder="Please select the form fields">
                    <el-option
                      v-for="(field, fIdx) in formFields"
                      :key="fIdx"
                      :label="field.title"
                      :value="field.field"
                      :disabled="!field.required"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="mr-2">
                <el-form-item
                  :prop="`httpRequestSetting.response.${index}.value`"
                  :rules="{
                    required: true,
                    message: 'The response cannot be empty.',
                    trigger: 'blur'
                  }"
                >
                  <el-input class="w-160px" v-model="item.value" placeholder="Response" />
                </el-form-item>
              </div>
              <div class="mr-1 pt-1 cursor-pointer">
                <Icon
                  icon="ep:delete"
                  :size="18"
                  @click="deleteHttpResponseSetting(configForm.httpRequestSetting.response!, index)"
                />
              </div>
            </div>
            <el-button
              type="primary"
              text
              @click="addHttpResponseSetting(configForm.httpRequestSetting.response!)"
            >
              <Icon icon="ep:plus" class="mr-5px" />Add a Row
            </el-button>
          </el-form-item>
        </div>
        <div
          v-if="
            configForm.type === TriggerTypeEnum.UPDATE_NORMAL_FORM && configForm.normalFormSetting
          "
        >
          <el-divider content-position="left">Modify The Form Settings</el-divider>
          <div
            class="flex items-center"
            v-for="key in Object.keys(configForm.normalFormSetting.updateFormFields!)"
            :key="key"
          >
            <div class="mr-2 flex items-center">
              <el-form-item>
                <el-select
                  class="w-160px!"
                  :model-value="key"
                  @update:model-value="(newKey) => updateFormFieldKey(key, newKey)"
                  placeholder="Please select the form fields"
                  :disabled="key !== ''"
                >
                  <el-option
                    v-for="(field, fIdx) in optionalUpdateFormFields"
                    :key="fIdx"
                    :label="field.title"
                    :value="field.field"
                    :disabled="field.disabled"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="mx-2"><el-form-item> Set the value of </el-form-item></div>
            <div class="mr-2">
              <el-form-item
                :prop="`normalFormSetting.updateFormFields.${key}`"
                :rules="{
                  required: true,
                  message: 'The value cannot be empty.',
                  trigger: 'blur'
                }"
              >
                <el-input
                  class="w-160px"
                  v-model="configForm.normalFormSetting.updateFormFields![key]"
                  placeholder="Please enter"
                  :disabled="!key"
                />
              </el-form-item>
            </div>
            <div class="mr-1 pt-1 cursor-pointer">
              <el-form-item>
                <Icon icon="ep:delete" :size="18" @click="deleteFormFieldSetting(key)" />
              </el-form-item>
            </div>
          </div>
          <el-button type="primary" text @click="addFormFieldSetting()">
            <Icon icon="ep:plus" class="mr-5px" />Add Fields for Modify
          </el-button>
        </div>
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
import { SimpleFlowNode, NodeType, TriggerSetting, TRIGGER_TYPES, TriggerTypeEnum } from '../consts'
import { useWatchNode, useDrawer, useNodeName, useFormFields } from '../node'
import HttpRequestParamSetting from './components/HttpRequestParamSetting.vue'

defineOptions({
  name: 'TriggerNodeConfig'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
const message = useMessage() // Message pop-up window
// Drawer configuration
const { settingVisible, closeDrawer, openDrawer } = useDrawer()
// Current node
const currentNode = useWatchNode(props)
// Node Name
const { nodeName, showInput, clickIcon, blurEvent } = useNodeName(NodeType.TRIGGER_NODE)
// Trigger form configuration
const formRef = ref() // form  Ref
// Form verification rules
const formRules = reactive({
  type: [{ required: true, message: 'The trigger type cannot be empty', trigger: 'change' }],
  'httpRequestSetting.url': [{ required: true, message: 'The request url cannot be empty', trigger: 'blur' }]
})
// Trigger configuration form data
const configForm = ref<TriggerSetting>({
  type: TriggerTypeEnum.HTTP_REQUEST,
  httpRequestSetting: {
    url: '',
    header: [],
    body: [],
    response: []
  },
  normalFormSetting: { updateFormFields: {} }
})
// Process form fields
const formFields = useFormFields()

// Optional form fields that can be modified.
const optionalUpdateFormFields = computed(() => {
  const usedFields = Object.keys(configForm.value.normalFormSetting?.updateFormFields || {})
  return formFields.map((field) => ({
    title: field.title,
    field: field.field,
    disabled: usedFields.includes(field.field)
  }))
})

const updateFormFieldKey = (oldKey: string, newKey: string) => {
  if (!configForm.value.normalFormSetting?.updateFormFields) return
  const value = configForm.value.normalFormSetting.updateFormFields[oldKey]
  delete configForm.value.normalFormSetting.updateFormFields[oldKey]
  configForm.value.normalFormSetting.updateFormFields[newKey] = value
}

/** Add settings for HTTP request return values. */
const addHttpResponseSetting = (responseSetting: Record<string, string>[]) => {
  responseSetting.push({
    key: '',
    value: ''
  })
}

/** Delete the settings for HTTP request return values. */
const deleteHttpResponseSetting = (responseSetting: Record<string, string>[], index: number) => {
  responseSetting.splice(index, 1)
}

/** Add form setting items for modification. */
const addFormFieldSetting = () => {
  if (configForm.value.normalFormSetting!.updateFormFields === undefined) {
    configForm.value.normalFormSetting!.updateFormFields = {}
  }
  configForm.value.normalFormSetting!.updateFormFields[''] = undefined
}
/** Delete the form setting items for modification. */
const deleteFormFieldSetting = (key: string) => {
  if (!configForm.value.normalFormSetting?.updateFormFields) return
  delete configForm.value.normalFormSetting.updateFormFields[key]
}

/** Save the configuration. */
const saveConfig = async () => {
  if (!formRef) return false
  const valid = await formRef.value.validate()
  if (!valid) return false
  const showText = getShowText()
  if (!showText) return false
  currentNode.value.name = nodeName.value!
  currentNode.value.showText = showText
  if (configForm.value.type === TriggerTypeEnum.HTTP_REQUEST) {
    configForm.value.normalFormSetting = undefined
  }
  if (configForm.value.type === TriggerTypeEnum.UPDATE_NORMAL_FORM) {
    configForm.value.httpRequestSetting = undefined
  }
  currentNode.value.triggerSetting = configForm.value
  settingVisible.value = false
  return true
}

/** Get the display content of the node. */
const getShowText = (): string => {
  let showText = ''
  if (configForm.value.type === TriggerTypeEnum.HTTP_REQUEST) {
    showText = `${configForm.value.httpRequestSetting?.url}`
  } else if (configForm.value.type === TriggerTypeEnum.UPDATE_NORMAL_FORM) {
    const updatefields = Object.keys(configForm.value.normalFormSetting?.updateFormFields || {})
    if (updatefields.length === 0) {
      message.warning('Please set the form fields to be modified')
    } else {
      showText = 'Modify the form data'
    }
  }
  return showText
}

/** Display the trigger node configuration passed from the parent component. */
const showTriggerNodeConfig = (node: SimpleFlowNode) => {
  nodeName.value = node.name
  if (node.triggerSetting) {
    configForm.value = {
      type: node.triggerSetting.type,
      httpRequestSetting: node.triggerSetting.httpRequestSetting || {
        url: '',
        header: [],
        body: [],
        response: []
      },
      normalFormSetting: node.triggerSetting.normalFormSetting || { updateFormFields: {} }
    }
  }
}

defineExpose({ openDrawer, showTriggerNodeConfig }) // Expose method to parent component
</script>

<style lang="scss" scoped></style>
