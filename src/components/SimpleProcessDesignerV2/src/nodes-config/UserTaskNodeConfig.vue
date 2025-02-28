<template>
  <el-drawer
    :append-to-body="true"
    v-model="settingVisible"
    :show-close="false"
    :size="580"
    :before-close="saveConfig"
    class="justify-start"
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
          {{ nodeName }}
          <Icon class="ml-1" icon="ep:edit-pen" :size="16" @click="clickIcon()" />
        </div>
        <div class="divide-line"></div>
      </div>
    </template>
    <div class="flex flex-items-center mb-3">
      <span class="font-size-16px mr-3">Approval Type :</span>
      <el-radio-group v-model="approveType">
        <el-radio
          v-for="(item, index) in APPROVE_TYPE"
          :key="index"
          :value="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </div>
    <el-tabs type="border-card" v-model="activeTabName" v-if="approveType === ApproveType.USER">
      <el-tab-pane label="Approver" name="user">
        <div>
          <el-form ref="formRef" :model="configForm" label-position="top" :rules="formRules">
            <el-form-item label="Approver Setting" prop="candidateStrategy">
              <el-radio-group
                v-model="configForm.candidateStrategy"
                @change="changeCandidateStrategy"
              >
                <el-row>
                  <el-col v-for="(dict, index) in CANDIDATE_STRATEGY" :key="index" :span="8">
                    <el-radio :value="dict.value" :label="dict.value">
                      {{ dict.label }}
                    </el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy == CandidateStrategy.ROLE"
              label="Designated Role"
              prop="roleIds"
            >
              <el-select filterable v-model="configForm.roleIds" clearable multiple style="width: 100%">
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
                :check-strictly="true"
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
              <el-select filterable v-model="configForm.postIds" clearable multiple style="width: 100%">
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
              <el-select filterable v-model="configForm.userIds" clearable multiple style="width: 100%">
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
              <el-select filterable v-model="configForm.userGroups" clearable multiple style="width: 100%">
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
              label="User fields in the form"
              prop="formUser"
            >
              <el-select filterable v-model="configForm.formUser" clearable style="width: 100%">
                <el-option
                  v-for="(item, idx) in userFieldOnFormOptions"
                  :key="idx"
                  :label="item.title"
                  :value="item.field"
                  :disabled="!item.required"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="configForm.candidateStrategy === CandidateStrategy.FORM_DEPT_LEADER"
              label="Department fields in the form."
              prop="formDept"
            >
              <el-select filterable v-model="configForm.formDept" clearable style="width: 100%">
                <el-option
                  v-for="(item, idx) in deptFieldOnFormOptions"
                  :key="idx"
                  :label="item.title"
                  :value="item.field"
                  :disabled="!item.required"
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
              <el-select filterable v-model="configForm.deptLevel" clearable>
                <el-option
                  v-for="(item, index) in MULTI_LEVEL_DEPT"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- TODO @Agruuu：In the future, support should be provided for selecting expressions that have already been saved -->
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
            <el-form-item label="Multi Person Approval Method" prop="approveMethod">
              <el-radio-group v-model="configForm.approveMethod" @change="approveMethodChanged">
                <div class="flex-col">
                  <div
                    v-for="(item, index) in APPROVE_METHODS"
                    :key="index"
                    class="flex items-center"
                  >
                    <el-radio :value="item.value" :label="item.value">
                      {{ item.label }}
                    </el-radio>
                    <el-form-item prop="approveRatio">
                      <el-input-number
                        v-model="configForm.approveRatio"
                        :min="10"
                        :max="100"
                        :step="10"
                        size="small"
                        v-if="
                          item.value === ApproveMethodType.APPROVE_BY_RATIO &&
                          configForm.approveMethod === ApproveMethodType.APPROVE_BY_RATIO
                        "
                      />
                    </el-form-item>
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>

            <el-divider content-position="left">When The Approver Refuse</el-divider>
            <el-form-item prop="rejectHandlerType">
              <el-radio-group v-model="configForm.rejectHandlerType">
                <div class="flex-col">
                  <div v-for="(item, index) in REJECT_HANDLER_TYPES" :key="index">
                    <el-radio :key="item.value" :value="item.value" :label="item.label" />
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="configForm.rejectHandlerType == RejectHandlerType.RETURN_USER_TASK"
              label="Reject Node"
              prop="returnNodeId"
            >
              <el-select filterable v-model="configForm.returnNodeId" clearable style="width: 100%">
                <el-option
                  v-for="item in returnTaskList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-divider content-position="left">When the approver exceeds the time limit and fails to process it</el-divider>
            <el-form-item label="Enable" prop="timeoutHandlerEnable">
              <el-switch
                v-model="configForm.timeoutHandlerEnable"
                active-text="Open"
                inactive-text="Close"
                @change="timeoutHandlerChange"
              />
            </el-form-item>
            <el-form-item
              label="Execute Action"
              prop="timeoutHandlerType"
              v-if="configForm.timeoutHandlerEnable"
            >
              <el-radio-group
                v-model="configForm.timeoutHandlerType"
                @change="timeoutHandlerTypeChanged"
              >
                <el-radio-button
                  v-for="item in TIMEOUT_HANDLER_TYPES"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Timeout Setting" v-if="configForm.timeoutHandlerEnable">
              <span class="mr-2">When Exceeding</span>
              <el-form-item prop="timeDuration">
                <el-input-number
                  class="mr-2"
                  :style="{ width: '100px' }"
                  v-model="configForm.timeDuration"
                  :min="1"
                  controls-position="right"
                />
              </el-form-item>
              <el-select
                filterable
                v-model="timeUnit"
                class="mr-2"
                :style="{ width: '100px' }"
                @change="timeUnitChange"
              >
                <el-option
                  v-for="item in TIME_UNIT_TYPES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              Unprocessed
            </el-form-item>
            <el-form-item
              label="Maximum Number of Reminders"
              prop="maxRemindCount"
              v-if="configForm.timeoutHandlerEnable && configForm.timeoutHandlerType === 1"
            >
              <el-input-number v-model="configForm.maxRemindCount" :min="1" :max="10" />
            </el-form-item>

            <el-divider content-position="left">When The Approver is Empty</el-divider>
            <el-form-item prop="assignEmptyHandlerType">
              <el-radio-group v-model="configForm.assignEmptyHandlerType">
                <div class="flex-col">
                  <div v-for="(item, index) in ASSIGN_EMPTY_HANDLER_TYPES" :key="index">
                    <el-radio :key="item.value" :value="item.value" :label="item.label" />
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="configForm.assignEmptyHandlerType == AssignEmptyHandlerType.ASSIGN_USER"
              label="Designated User"
              prop="assignEmptyHandlerUserIds"
              span="24"
            >
              <el-select
                filterable
                v-model="configForm.assignEmptyHandlerUserIds"
                clearable
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-divider content-position="left">When the approver and submitter are the same person</el-divider>
            <el-form-item prop="assignStartUserHandlerType">
              <el-radio-group v-model="configForm.assignStartUserHandlerType">
                <div class="flex-col">
                  <div v-for="(item, index) in ASSIGN_START_USER_HANDLER_TYPES" :key="index">
                    <el-radio :key="item.value" :value="item.value" :label="item.label" />
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>

            <el-divider content-position="left">Sign Enable</el-divider>
            <el-form-item prop="signEnable">
              <el-switch v-model="configForm.signEnable" active-text="Yes" inactive-text="No" />
            </el-form-item>

            <el-divider content-position="left">Approval Opinion</el-divider>
            <el-form-item prop="reasonRequire">
              <el-switch v-model="configForm.reasonRequire" active-text="Required" inactive-text="Not required" />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Operation Button Settings" name="buttons">
        <div class="button-setting-pane">
          <div class="button-setting-desc">Operation Button</div>
          <div class="button-setting-title">
            <div class="button-title-label">Operation Button</div>
            <div class="pl-4 button-title-label">Display Name</div>
            <div class="button-title-label">Enable</div>
          </div>
          <div class="button-setting-item" v-for="(item, index) in buttonsSetting" :key="index">
            <div class="button-setting-item-label"> {{ OPERATION_BUTTON_NAME.get(item.id) }} </div>
            <div class="button-setting-item-label">
              <input
                type="text"
                class="editable-title-input"
                @blur="btnDisplayNameBlurEvent(index)"
                v-mountedFocus
                v-model="item.displayName"
                :placeholder="item.displayName"
                v-if="btnDisplayNameEdit[index]"
              />
              <el-button v-else text @click="changeBtnDisplayName(index)"
                >{{ item.displayName }} &nbsp;<Icon icon="ep:edit"
              /></el-button>
            </div>
            <div class="button-setting-item-label">
              <el-switch v-model="item.enable" />
            </div>
          </div>
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
                  :label="FieldPermissionType.READ"
                  ><span></span
                ></el-radio>
              </div>
              <div class="item-radio-wrap">
                <el-radio
                  :value="FieldPermissionType.WRITE"
                  size="large"
                  :label="FieldPermissionType.WRITE"
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
      <el-tab-pane label="Listener" name="listener">
        <UserTaskListener ref="userTaskListenerRef" v-model="configForm" :form-field-options="formFieldOptions" />
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
  APPROVE_TYPE,
  ApproveType,
  APPROVE_METHODS,
  CandidateStrategy,
  NodeType,
  ApproveMethodType,
  TimeUnitType,
  RejectHandlerType,
  TIMEOUT_HANDLER_TYPES,
  TIME_UNIT_TYPES,
  REJECT_HANDLER_TYPES,
  DEFAULT_BUTTON_SETTING,
  OPERATION_BUTTON_NAME,
  ButtonSetting,
  MULTI_LEVEL_DEPT,
  CANDIDATE_STRATEGY,
  ASSIGN_START_USER_HANDLER_TYPES,
  TimeoutHandlerType,
  ASSIGN_EMPTY_HANDLER_TYPES,
  AssignEmptyHandlerType,
  FieldPermissionType,
  ProcessVariableEnum
} from '../consts'

import {
  useWatchNode,
  useNodeName,
  useFormFieldsPermission,
  useNodeForm,
  UserTaskFormType,
  useDrawer
} from '../node'
import { defaultProps } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import { convertTimeUnit, getApproveTypeText } from '../utils'
import UserTaskListener from './components/UserTaskListener.vue'
defineOptions({
  name: 'UserTaskNodeConfig'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
const emits = defineEmits<{
  'find:returnTaskNodes': [nodeList: SimpleFlowNode[]]
}>()
const deptLevelLabel = computed(() => {
  let label = 'Department Leader Source'
  if (configForm.value.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER) {
    label = label + '(Designated Department Up)'
  } else if (configForm.value.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER) {
    label = label + '(Department in The Form Upwards)'
  } else {
    label = label + '(Initiator Department Upwards)'
  }
  return label
})
// Changes in monitoring nodes
const currentNode = useWatchNode(props)
// Drawer configuration
const { settingVisible, closeDrawer, openDrawer } = useDrawer()
// Node name configuration
const { nodeName, showInput, clickIcon, blurEvent } = useNodeName(NodeType.USER_TASK_NODE)
// Activated Tab Tag Page
const activeTabName = ref('user')
// Form field permission settings
const { formType, fieldsPermissionConfig, formFieldOptions, getNodeConfigFormFields } =
  useFormFieldsPermission(FieldPermissionType.READ)
// User field options within the form, Must be mandatory and user selector
const userFieldOnFormOptions = computed(() => {
  // Fixed addition initiator ID field
  formFieldOptions.unshift({
    field: ProcessVariableEnum.START_USER_ID,
    title: 'Initiator',
    type: 'UserSelect',
    required: true
  })
  return formFieldOptions.filter((item) => item.type === 'UserSelect')
})
// Form Internal Door Field Options, Must be mandatory and department selector
const deptFieldOnFormOptions = computed(() => {
  return formFieldOptions.filter((item) => item.type === 'DeptSelect')
})
// Operation button settings
const { buttonsSetting, btnDisplayNameEdit, changeBtnDisplayName, btnDisplayNameBlurEvent } =
  useButtonsSetting()
const approveType = ref(ApproveType.USER)
// Approver Form Settings
const formRef = ref() // form  Ref
// Form verification rules
const formRules = reactive({
  candidateStrategy: [{ required: true, message: 'The approver setting cannot be empty', trigger: 'change' }],
  userIds: [{ required: true, message: 'User cannot be empty', trigger: 'change' }],
  roleIds: [{ required: true, message: 'Role cannot be empty', trigger: 'change' }],
  deptIds: [{ required: true, message: 'Department cannot be empty', trigger: 'change' }],
  userGroups: [{ required: true, message: 'User group cannot be empty', trigger: 'change' }],
  formUser: [{ required: true, message: 'The user field in the form cannot be empty', trigger: 'change' }],
  formDept: [{ required: true, message: 'The department field in the form cannot be empty', trigger: 'change' }],
  postIds: [{ required: true, message: 'Position cannot be empty', trigger: 'change' }],
  expression: [{ required: true, message: 'Process expression cannot be empty', trigger: 'blur' }],
  approveMethod: [{ required: true, message: 'The approval method for multiple people cannot be empty', trigger: 'change' }],
  approveRatio: [{ required: true, message: 'The proportion cannot be empty', trigger: 'blur' }],
  returnNodeId: [{ required: true, message: 'Reject node cannot be empty', trigger: 'change' }],
  timeoutHandlerEnable: [{ required: true }],
  timeoutHandlerType: [{ required: true }],
  timeDuration: [{ required: true, message: 'The timeout cannot be empty', trigger: 'blur' }],
  maxRemindCount: [{ required: true, message: 'Reminder frequency cannot be empty', trigger: 'blur' }],
  assignEmptyHandlerType: [{ required: true }],
  assignEmptyHandlerUserIds: [{ required: true, message: 'User cannot be empty', trigger: 'change' }],
  assignStartUserHandlerType: [{ required: true }]
})

const {
  configForm: tempConfigForm,
  roleOptions,
  postOptions,
  userOptions,
  userGroupOptions,
  deptTreeOptions,
  handleCandidateParam,
  parseCandidateParam,
  getShowText
} = useNodeForm(NodeType.USER_TASK_NODE)
const configForm = tempConfigForm as Ref<UserTaskFormType>

// Change approver setting strategy
const changeCandidateStrategy = () => {
  configForm.value.userIds = []
  configForm.value.deptIds = []
  configForm.value.roleIds = []
  configForm.value.postIds = []
  configForm.value.userGroups = []
  configForm.value.deptLevel = 1
  configForm.value.formUser = ''
  configForm.value.formDept = ''
  configForm.value.approveMethod = ApproveMethodType.SEQUENTIAL_APPROVE
}

// Change in approval method
const approveMethodChanged = () => {
  configForm.value.rejectHandlerType = RejectHandlerType.FINISH_PROCESS
  if (configForm.value.approveMethod === ApproveMethodType.APPROVE_BY_RATIO) {
    configForm.value.approveRatio = 100
  }
  formRef.value.clearValidate('approveRatio')
}
// Approval Rejected Returnable nodes
const returnTaskList = ref<SimpleFlowNode[]>([])
// The approver exceeded the time limit and did not process the settings
const {
  timeoutHandlerChange,
  cTimeoutType,
  timeoutHandlerTypeChanged,
  timeUnit,
  timeUnitChange,
  isoTimeDuration,
  cTimeoutMaxRemindCount
} = useTimeoutHandler()

const userTaskListenerRef = ref()

// Save configuration
const saveConfig = async () => {
  // activeTabName.value = 'user'
  // Set approval node name
  currentNode.value.name = nodeName.value!
  // Set approval type
  currentNode.value.approveType = approveType.value
  // If it weren't for manual approval。return
  if (approveType.value !== ApproveType.USER) {
    currentNode.value.showText = getApproveTypeText(approveType.value)
    settingVisible.value = false
    return true
  }

  if (!formRef) return false
  if (!userTaskListenerRef) return false
  const valid = (await formRef.value.validate()) && (await userTaskListenerRef.value.validate())
  if (!valid) return false
  const showText = getShowText()
  if (!showText) return false

  currentNode.value.candidateStrategy = configForm.value.candidateStrategy
  // handle candidateParam parameter
  currentNode.value.candidateParam = handleCandidateParam()
  // Set approval method
  currentNode.value.approveMethod = configForm.value.approveMethod
  if (configForm.value.approveMethod === ApproveMethodType.APPROVE_BY_RATIO) {
    currentNode.value.approveRatio = configForm.value.approveRatio
  }
  // Set rejection processing
  currentNode.value.rejectHandler = {
    type: configForm.value.rejectHandlerType!,
    returnNodeId: configForm.value.returnNodeId
  }
  // Set timeout handling
  currentNode.value.timeoutHandler = {
    enable: configForm.value.timeoutHandlerEnable!,
    type: cTimeoutType.value,
    timeDuration: isoTimeDuration.value,
    maxRemindCount: cTimeoutMaxRemindCount.value
  }
  // Set approver to empty time
  currentNode.value.assignEmptyHandler = {
    type: configForm.value.assignEmptyHandlerType!,
    userIds:
      configForm.value.assignEmptyHandlerType === AssignEmptyHandlerType.ASSIGN_USER
        ? configForm.value.assignEmptyHandlerUserIds
        : undefined
  }
  // Set approver and initiator to be the same
  currentNode.value.assignStartUserHandlerType = configForm.value.assignStartUserHandlerType
  // Set form permissions
  currentNode.value.fieldsPermission = fieldsPermissionConfig.value
  // Set button permissions
  currentNode.value.buttonsSetting = buttonsSetting.value
  // Create task listener
  currentNode.value.taskCreateListener = {
    enable: configForm.value.taskCreateListenerEnable ?? false,
    path: configForm.value.taskCreateListenerPath,
    header: configForm.value.taskCreateListener?.header,
    body: configForm.value.taskCreateListener?.body
  }
  // Assign task listener
  currentNode.value.taskAssignListener = {
    enable: configForm.value.taskAssignListenerEnable ?? false,
    path: configForm.value.taskAssignListenerPath,
    header: configForm.value.taskAssignListener?.header,
    body: configForm.value.taskAssignListener?.body
  }
  // Task completion listener
  currentNode.value.taskCompleteListener = {
    enable: configForm.value.taskCompleteListenerEnable ?? false,
    path: configForm.value.taskCompleteListenerPath,
    header: configForm.value.taskCompleteListener?.header,
    body: configForm.value.taskCompleteListener?.body
  }
  // autograph
  currentNode.value.signEnable = configForm.value.signEnable
  // Approval Opinion
  currentNode.value.reasonRequire = configForm.value.reasonRequire

  currentNode.value.showText = showText
  settingVisible.value = false
  return true
}

// Display approval node configuration， Transferred from the parent component
const showUserTaskNodeConfig = (node: SimpleFlowNode) => {
  nodeName.value = node.name
  // 1 Approval type
  approveType.value = node.approveType ? node.approveType : ApproveType.USER
  // If the approval type is not manual approval, return
  if (approveType.value !== ApproveType.USER) {
    return
  }

  //2.1 Approver setting
  configForm.value.candidateStrategy = node.candidateStrategy!
  // Analyze candidate parameters
  parseCandidateParam(node.candidateStrategy!, node?.candidateParam)
  // 2.2 Set approval method
  configForm.value.approveMethod = node.approveMethod!
  if (node.approveMethod == ApproveMethodType.APPROVE_BY_RATIO) {
    configForm.value.approveRatio = node.approveRatio!
  }
  // 2.3 Set approval rejection processing
  configForm.value.rejectHandlerType = node.rejectHandler!.type
  configForm.value.returnNodeId = node.rejectHandler?.returnNodeId
  const matchNodeList = []
  emits('find:returnTaskNodes', matchNodeList)
  returnTaskList.value = matchNodeList
  // 2.4 Set approval timeout handling
  configForm.value.timeoutHandlerEnable = node.timeoutHandler!.enable
  if (node.timeoutHandler?.enable && node.timeoutHandler?.timeDuration) {
    const strTimeDuration = node.timeoutHandler.timeDuration
    let parseTime = strTimeDuration.slice(2, strTimeDuration.length - 1)
    let parseTimeUnit = strTimeDuration.slice(strTimeDuration.length - 1)
    configForm.value.timeDuration = parseInt(parseTime)
    timeUnit.value = convertTimeUnit(parseTimeUnit)
  }
  configForm.value.timeoutHandlerType = node.timeoutHandler?.type
  configForm.value.maxRemindCount = node.timeoutHandler?.maxRemindCount
  // 2.5 Set approver to empty time
  configForm.value.assignEmptyHandlerType = node.assignEmptyHandler?.type
  configForm.value.assignEmptyHandlerUserIds = node.assignEmptyHandler?.userIds
  // 2.6 Set the approver and initiator of the user task to be the same
  configForm.value.assignStartUserHandlerType = node.assignStartUserHandlerType
  // 3. Operation button settings
  buttonsSetting.value = cloneDeep(node.buttonsSetting) || DEFAULT_BUTTON_SETTING
  // 4. Form field permission configuration
  getNodeConfigFormFields(node.fieldsPermission)
  // 5. monitor
  // 5.1 Create Task
  configForm.value.taskCreateListenerEnable = node.taskCreateListener?.enable
  configForm.value.taskCreateListenerPath = node.taskCreateListener?.path
  configForm.value.taskCreateListener = {
    header: node.taskCreateListener?.header ?? [],
    body: node.taskCreateListener?.body ?? []
  }
  // 5.2 appointed task
  configForm.value.taskAssignListenerEnable = node.taskAssignListener?.enable
  configForm.value.taskAssignListenerPath = node.taskAssignListener?.path
  configForm.value.taskAssignListener = {
    header: node.taskAssignListener?.header ?? [],
    body: node.taskAssignListener?.body ?? []
  }
 // 5.3 Complete the task
  configForm.value.taskCompleteListenerEnable = node.taskCompleteListener?.enable
  configForm.value.taskCompleteListenerPath = node.taskCompleteListener?.path
  configForm.value.taskCompleteListener = {
    header: node.taskCompleteListener?.header ?? [],
    body: node.taskCompleteListener?.body ?? []
  }
  // 6. autograph
  configForm.value.signEnable = node?.signEnable ?? false
  // 7. Approval Opinion
  configForm.value.reasonRequire = node?.reasonRequire ?? false
}

defineExpose({ openDrawer, showUserTaskNodeConfig }) // Expose method to parent component

/**
 * @description Operation button settings
 */
function useButtonsSetting() {
  const buttonsSetting = ref<ButtonSetting[]>()
  // The display name of the operation button can be edited
  const btnDisplayNameEdit = ref<boolean[]>([])
  const changeBtnDisplayName = (index: number) => {
    btnDisplayNameEdit.value[index] = true
  }
  const btnDisplayNameBlurEvent = (index: number) => {
    btnDisplayNameEdit.value[index] = false
    const buttonItem = buttonsSetting.value![index]
    buttonItem.displayName = buttonItem.displayName || OPERATION_BUTTON_NAME.get(buttonItem.id)!
  }
  return {
    buttonsSetting,
    btnDisplayNameEdit,
    changeBtnDisplayName,
    btnDisplayNameBlurEvent
  }
}

/**
 * @description The approver exceeded the time limit and did not process the configuration
 */
function useTimeoutHandler() {
  // Time unit
  const timeUnit = ref(TimeUnitType.HOUR)

  // Timeout switch change
  const timeoutHandlerChange = () => {
    if (configForm.value.timeoutHandlerEnable) {
      timeUnit.value = 2
      configForm.value.timeDuration = 6
      configForm.value.timeoutHandlerType = 1
      configForm.value.maxRemindCount = 1
    }
  }
  // Action executed after timeout
  const cTimeoutType = computed(() => {
    if (!configForm.value.timeoutHandlerEnable) {
      return undefined
    }
    return configForm.value.timeoutHandlerType
  })

  // Change of timeout handling action
  const timeoutHandlerTypeChanged = () => {
    if (configForm.value.timeoutHandlerType === TimeoutHandlerType.REMINDER) {
      configForm.value.maxRemindCount = 1 // Number of timeout reminders，Default is 1
    }
  }

  // Change in time unit
  const timeUnitChange = () => {
    // minute，The default is 60 minute
    if (timeUnit.value === TimeUnitType.MINUTE) {
      configForm.value.timeDuration = 60
    }
    // hour，The default is 6 An hour
    if (timeUnit.value === TimeUnitType.HOUR) {
      configForm.value.timeDuration = 6
    }
    // day， default 1day
    if (timeUnit.value === TimeUnitType.DAY) {
      configForm.value.timeDuration = 1
    }
  }
  // The timeout period ISO express
  const isoTimeDuration = computed(() => {
    if (!configForm.value.timeoutHandlerEnable) {
      return undefined
    }
    let strTimeDuration = 'PT'
    if (timeUnit.value === TimeUnitType.MINUTE) {
      strTimeDuration += configForm.value.timeDuration + 'M'
    }
    if (timeUnit.value === TimeUnitType.HOUR) {
      strTimeDuration += configForm.value.timeDuration + 'H'
    }
    if (timeUnit.value === TimeUnitType.DAY) {
      strTimeDuration += configForm.value.timeDuration + 'D'
    }
    return strTimeDuration
  })

  // Maximum number of timeout reminders
  const cTimeoutMaxRemindCount = computed(() => {
    if (!configForm.value.timeoutHandlerEnable) {
      return undefined
    }
    if (configForm.value.timeoutHandlerType !== TimeoutHandlerType.REMINDER) {
      return undefined
    }
    return configForm.value.maxRemindCount
  })

  return {
    timeoutHandlerChange,
    cTimeoutType,
    timeoutHandlerTypeChanged,
    timeUnit,
    timeUnitChange,
    isoTimeDuration,
    cTimeoutMaxRemindCount
  }
}
</script>

<style lang="scss" scoped>
.button-setting-pane {
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .button-setting-desc {
    padding-right: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
  }

  .button-setting-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding-left: 12px;
    background-color: #f8fafc0a;
    border: 1px solid #1f38581a;

    & > :first-child {
      width: 100px !important;
      text-align: left !important;
    }

    & > :last-child {
      text-align: center !important;
    }

    .button-title-label {
      width: 150px;
      font-size: 13px;
      font-weight: 700;
      color: #000;
      text-align: left;
    }
  }

  .button-setting-item {
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 38px;
    padding-left: 12px;
    border: 1px solid #1f38581a;
    border-top: 0;

    & > :first-child {
      width: 100px !important;
    }

    & > :last-child {
      text-align: center !important;
    }

    .button-setting-item-label {
      width: 150px;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .editable-title-input {
      height: 24px;
      max-width: 130px;
      margin-left: 4px;
      line-height: 24px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      transition: all 0.3s;

      &:focus {
        border-color: #40a9ff;
        outline: 0;
        box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
      }
    }
  }
}
</style>
