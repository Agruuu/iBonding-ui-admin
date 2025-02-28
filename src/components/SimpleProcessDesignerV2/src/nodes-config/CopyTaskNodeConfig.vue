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
    <el-tabs type="border-card" v-model="activeTabName">
      <el-tab-pane label="CC" name="user">
        <div>
          <el-form ref="formRef" :model="configForm" label-position="top" :rules="formRules">
            <el-form-item label="CC Settings" prop="candidateStrategy">
              <el-radio-group
                v-model="configForm.candidateStrategy"
                @change="changeCandidateStrategy"
              >
                <el-radio
                  v-for="(dict, index) in copyUserStrategies"
                  :key="index"
                  :value="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-if="configForm.candidateStrategy == CandidateStrategy.ROLE"
              label="Designated Role"
              prop="roleIds"
            >
              <el-select v-model="configForm.roleIds" clearable multiple style="width: 100%">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                configForm.candidateStrategy == CandidateStrategy.DEPT_MEMBER ||
                configForm.candidateStrategy == CandidateStrategy.DEPT_LEADER ||
                configForm.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER
              "
              label="Designated Department"
              prop="deptIds"
              span="24"
            >
              <el-tree-select
                ref="treeRef"
                v-model="configForm.deptIds"
                :data="deptTreeOptions"
                :props="defaultProps"
                empty-text="Loading in progress，Please wait a moment"
                multiple
                node-key="id"
                style="width: 100%"
                show-checkbox
              />
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy == CandidateStrategy.POST"
              label="Designated Position"
              prop="postIds"
              span="24"
            >
              <el-select v-model="configForm.postIds" clearable multiple style="width: 100%">
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id!"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy == CandidateStrategy.USER"
              label="Designated User"
              prop="userIds"
              span="24"
            >
              <el-select v-model="configForm.userIds" clearable multiple style="width: 100%">
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy === CandidateStrategy.USER_GROUP"
              label="Designated User Group"
              prop="userGroups"
            >
              <el-select v-model="configForm.userGroups" clearable multiple style="width: 100%">
                <el-option
                  v-for="item in userGroupOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy === CandidateStrategy.FORM_USER"
              label="User Field in The Form"
              prop="formUser"
            >
              <el-select v-model="configForm.formUser" clearable style="width: 100%">
                <el-option
                  v-for="(item, idx) in userFieldOnFormOptions"
                  :key="idx"
                  :label="item.title"
                  :value="item.field"
                  :disabled ="!item.required"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy === CandidateStrategy.FORM_DEPT_LEADER"
              label="Department Field in The Form"
              prop="formDept"
            >
              <el-select v-model="configForm.formDept" clearable style="width: 100%">
                <el-option
                  v-for="(item, idx) in deptFieldOnFormOptions"
                  :key="idx"
                  :label="item.title"
                  :value="item.field"
                  :disabled ="!item.required"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                configForm.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER ||
                configForm.candidateStrategy == CandidateStrategy.START_USER_DEPT_LEADER ||
                configForm.candidateStrategy ==
                  CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER ||
                configForm.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER
              "
              :label="deptLevelLabel!"
              prop="deptLevel"
              span="24"
            >
              <el-select v-model="configForm.deptLevel" clearable>
                <el-option
                  v-for="(item, index) in MULTI_LEVEL_DEPT"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy === CandidateStrategy.EXPRESSION"
              label="Process Expression"
              prop="expression"
            >
              <el-input
                type="textarea"
                v-model="configForm.expression"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Form Field Permissions" name="fields" v-if="formType === 10">
        <div class="field-setting-pane">
          <div class="field-setting-desc">Field Permissions</div>
          <div class="field-permit-title">
            <div class="setting-title-label first-title"> Field Name </div>
            <div class="other-titles">
              <span class="setting-title-label">Read-Only</span>
              <span class="setting-title-label">Editable</span>
              <span class="setting-title-label">Hide</span>
            </div>
          </div>
          <div
            class="field-setting-item"
            v-for="(item, index) in fieldsPermissionConfig"
            :key="index"
          >
            <div class="field-setting-item-label"> {{ item.title }} </div>
            <el-radio-group class="field-setting-item-group" v-model="item.permission">
              <div class="item-radio-wrap">
                <el-radio
                  :value="FieldPermissionType.READ"
                  size="large"
                  :label="FieldPermissionType.WRITE"
                  ><span></span
                ></el-radio>
              </div>
              <div class="item-radio-wrap">
                <el-radio
                  :value="FieldPermissionType.WRITE"
                  size="large"
                  :label="FieldPermissionType.WRITE"
                  disabled
                  ><span></span
                ></el-radio>
              </div>
              <div class="item-radio-wrap">
                <el-radio
                  :value="FieldPermissionType.NONE"
                  size="large"
                  :label="FieldPermissionType.NONE"
                  ><span></span
                ></el-radio>
              </div>
            </el-radio-group>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
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
  CandidateStrategy,
  NodeType,
  CANDIDATE_STRATEGY,
  FieldPermissionType,
  MULTI_LEVEL_DEPT
} from '../consts'
import {
  useWatchNode,
  useDrawer,
  useNodeName,
  useFormFieldsPermission,
  useNodeForm,
  CopyTaskFormType
} from '../node'
import { defaultProps } from '@/utils/tree'
defineOptions({
  name: 'CopyTaskNodeConfig'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
const deptLevelLabel = computed(() => {
  let label = 'Department Leader Source'
  if (configForm.value.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER) {
    label = label + '(Designated Department Up)'
  } else {
    label = label + '(Initiator Department Up)'
  }
  return label
})
// Drawer configuration
const { settingVisible, closeDrawer, openDrawer } = useDrawer()
// Current node
const currentNode = useWatchNode(props)
// Node Name
const { nodeName, showInput, clickIcon, blurEvent } = useNodeName(NodeType.COPY_TASK_NODE)
// Activated Tab Tag Page
const activeTabName = ref('user')
// Form field permission configuration
const { formType, fieldsPermissionConfig, formFieldOptions, getNodeConfigFormFields } =
  useFormFieldsPermission(FieldPermissionType.READ)
// User field options within the form, Must be mandatory and user selector
const userFieldOnFormOptions = computed(() => {
  return formFieldOptions.filter((item) => item.type === 'UserSelect')
})
// Form Internal Door Field Options, Must be mandatory and department selector
const deptFieldOnFormOptions = computed(() => {
  return formFieldOptions.filter((item) => item.type === 'DeptSelect')
})
// CC form configuration
const formRef = ref() // form  Ref
// Form verification rules
const formRules = reactive({
  candidateStrategy: [{ required: true, message: 'CC setting cannot be empty', trigger: 'change' }],
  userIds: [{ required: true, message: 'User cannot be empty', trigger: 'change' }],
  roleIds: [{ required: true, message: 'Role cannot be empty', trigger: 'change' }],
  deptIds: [{ required: true, message: 'Department cannot be empty', trigger: 'change' }],
  userGroups: [{ required: true, message: 'User group cannot be empty', trigger: 'change' }],
  postIds: [{ required: true, message: 'Position cannot be empty', trigger: 'change' }],
  formUser: [{ required: true, message: 'The user field in the form cannot be empty', trigger: 'change' }],
  formDept: [{ required: true, message: 'The department field in the form cannot be empty', trigger: 'change' }],
  expression: [{ required: true, message: 'Process expression cannot be empty', trigger: 'blur' }]
})

const {
  configForm: tempConfigForm,
  roleOptions,
  postOptions,
  userOptions,
  userGroupOptions,
  deptTreeOptions,
  getShowText,
  handleCandidateParam,
  parseCandidateParam
} = useNodeForm(NodeType.COPY_TASK_NODE)
const configForm = tempConfigForm as Ref<CopyTaskFormType>
// CC strategy， Remove the initiator's self selection and The initiator themselves
const copyUserStrategies = computed(() => {
  return CANDIDATE_STRATEGY.filter((item) => item.value !== CandidateStrategy.START_USER)
})
// Change CC recipient setting strategy
const changeCandidateStrategy = () => {
  configForm.value.userIds = []
  configForm.value.deptIds = []
  configForm.value.roleIds = []
  configForm.value.postIds = []
  configForm.value.userGroups = []
  configForm.value.deptLevel = 1
  configForm.value.formUser = ''
}
// Save configuration
const saveConfig = async () => {
  activeTabName.value = 'user'
  if (!formRef) return false
  const valid = await formRef.value.validate()
  if (!valid) return false
  const showText = getShowText()
  if (!showText) return false
  currentNode.value.name = nodeName.value!
  currentNode.value.candidateParam = handleCandidateParam()
  currentNode.value.candidateStrategy = configForm.value.candidateStrategy
  currentNode.value.showText = showText
  currentNode.value.fieldsPermission = fieldsPermissionConfig.value
  settingVisible.value = false
  return true
}
// Display node configuration， Transferred from the parent component
const showCopyTaskNodeConfig = (node: SimpleFlowNode) => {
  nodeName.value = node.name
  // recipient settings
  configForm.value.candidateStrategy = node.candidateStrategy!
  parseCandidateParam(node.candidateStrategy!, node?.candidateParam)
  // Form field permissions
  getNodeConfigFormFields(node.fieldsPermission)
}

defineExpose({ openDrawer, showCopyTaskNodeConfig }) // Expose method to parent component
</script>

<style lang="scss" scoped></style>
