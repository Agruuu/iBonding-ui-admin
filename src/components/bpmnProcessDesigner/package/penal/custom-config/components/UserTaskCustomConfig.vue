<!-- UserTask Custom configuration：
     1. When the approver and submitter are the same person
     2. When the approver refuses
     3. The approver is empty time
     4. Operation button
     5. Field permissions
     6. Approval type
     7. Do you need a signature
-->
<template>
  <div>
    <el-divider content-position="left">Approval Type</el-divider>
    <el-form-item prop="approveType">
      <el-radio-group v-model="approveType.value">
        <el-radio
          v-for="(item, index) in APPROVE_TYPE"
          :key="index"
          :value="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-divider content-position="left">When The Approver Refuses</el-divider>
    <el-form-item prop="rejectHandlerType">
      <el-radio-group
        v-model="rejectHandlerType"
        :disabled="returnTaskList.length === 0"
        @change="updateRejectHandlerType"
      >
        <div class="flex-col">
          <div v-for="(item, index) in REJECT_HANDLER_TYPES" :key="index">
            <el-radio :key="item.value" :value="item.value" :label="item.label" />
          </div>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="rejectHandlerType == RejectHandlerType.RETURN_USER_TASK"
      label="Reject Node"
      prop="returnNodeId"
    >
      <el-select v-model="returnNodeId" clearable style="width: 100%" @change="updateReturnNodeId">
        <el-option
          v-for="item in returnTaskList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-divider content-position="left">When The Approver is Empty</el-divider>
    <el-form-item prop="assignEmptyHandlerType">
      <el-radio-group v-model="assignEmptyHandlerType" @change="updateAssignEmptyHandlerType">
        <div class="flex-col">
          <div v-for="(item, index) in ASSIGN_EMPTY_HANDLER_TYPES" :key="index">
            <el-radio :key="item.value" :value="item.value" :label="item.label" />
          </div>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="assignEmptyHandlerType == AssignEmptyHandlerType.ASSIGN_USER"
      label="Designated User"
      prop="assignEmptyHandlerUserIds"
      span="24"
    >
      <el-select
        v-model="assignEmptyUserIds"
        clearable
        multiple
        style="width: 100%"
        @change="updateAssignEmptyUserIds"
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
    <el-radio-group v-model="assignStartUserHandlerType" @change="updateAssignStartUserHandlerType">
      <div class="flex-col">
        <div v-for="(item, index) in ASSIGN_START_USER_HANDLER_TYPES" :key="index">
          <el-radio :key="item.value" :value="item.value" :label="item.label" />
        </div>
      </div>
    </el-radio-group>

    <el-divider content-position="left">Operation Button</el-divider>
    <div class="button-setting-pane">
      <div class="button-setting-title">
        <div class="button-title-label">Operation Button</div>
        <div class="pl-4 button-title-label">Display Name</div>
        <div class="button-title-label">Enable</div>
      </div>
      <div class="button-setting-item" v-for="(item, index) in buttonsSettingEl" :key="index">
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

    <el-divider content-position="left">Field Permissions</el-divider>
    <div class="field-setting-pane" v-if="formType === 10">
      <div class="field-permit-title">
        <div class="setting-title-label first-title"> Field Name </div>
        <div class="other-titles">
          <span class="setting-title-label">Read-Only</span>
          <span class="setting-title-label">Editable</span>
          <span class="setting-title-label">Hide</span>
        </div>
      </div>
      <div class="field-setting-item" v-for="(item, index) in fieldsPermissionEl" :key="index">
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

    <el-divider content-position="left">Sign Enable</el-divider>
    <el-form-item prop="signEnable">
      <el-switch v-model="signEnable.value" active-text="Yes" inactive-text="No" />
    </el-form-item>

    <el-divider content-position="left">Approval Opinion</el-divider>
    <el-form-item prop="reasonRequire">
      <el-switch v-model="reasonRequire.value" active-text="Required" inactive-text="Not Required" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import {
  ASSIGN_START_USER_HANDLER_TYPES,
  RejectHandlerType,
  REJECT_HANDLER_TYPES,
  ASSIGN_EMPTY_HANDLER_TYPES,
  AssignEmptyHandlerType,
  OPERATION_BUTTON_NAME,
  DEFAULT_BUTTON_SETTING,
  FieldPermissionType,
  APPROVE_TYPE,
  ApproveType,
  ButtonSetting
} from '@/components/SimpleProcessDesignerV2/src/consts'
import * as UserApi from '@/api/system/user'
import { useFormFieldsPermission } from '@/components/SimpleProcessDesignerV2/src/node'

defineOptions({ name: 'ElementCustomConfig4UserTask' })
const props = defineProps({
  id: String,
  type: String
})
const prefix = inject('prefix')

// When the approver and submitter are the same person
const assignStartUserHandlerTypeEl = ref()
const assignStartUserHandlerType = ref()

// When the approver refuses
const rejectHandlerTypeEl = ref()
const rejectHandlerType = ref()
const returnNodeIdEl = ref()
const returnNodeId = ref()
const returnTaskList = ref([])

// The approver is empty time
const assignEmptyHandlerTypeEl = ref()
const assignEmptyHandlerType = ref()
const assignEmptyUserIdsEl = ref()
const assignEmptyUserIds = ref()

// Operation button
const buttonsSettingEl = ref()
const { btnDisplayNameEdit, changeBtnDisplayName, btnDisplayNameBlurEvent } = useButtonsSetting()

// Field permissions
const fieldsPermissionEl = ref([])
const { formType, fieldsPermissionConfig, getNodeConfigFormFields } = useFormFieldsPermission(
  FieldPermissionType.READ
)

// Approval type
const approveType = ref({ value: ApproveType.USER })

// Do you need a signature
const signEnable = ref({ value: false })

// Approval Opinion
const reasonRequire = ref({ value: false })

const elExtensionElements = ref()
const otherExtensions = ref()
const bpmnElement = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances

const resetCustomConfigList = () => {
  bpmnElement.value = bpmnInstances().bpmnElement

  // Get a list of rollback options
  returnTaskList.value = findAllPredecessorsExcludingStart(
    bpmnElement.value.id,
    bpmnInstances().modeler
  )

  // Get element extension properties perhaps Create extended attributes
  elExtensionElements.value =
    bpmnElement.value.businessObject?.extensionElements ??
    bpmnInstances().moddle.create('bpmn:ExtensionElements', { values: [] })

  // Approval type
  approveType.value =
    elExtensionElements.value.values?.filter((ex) => ex.$type === `${prefix}:ApproveType`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:ApproveType`, { value: ApproveType.USER })

  // When the approver and submitter are the same person
  assignStartUserHandlerTypeEl.value =
    elExtensionElements.value.values?.filter(
      (ex) => ex.$type === `${prefix}:AssignStartUserHandlerType`
    )?.[0] || bpmnInstances().moddle.create(`${prefix}:AssignStartUserHandlerType`, { value: 1 })
  assignStartUserHandlerType.value = assignStartUserHandlerTypeEl.value.value

  // When the approver refuses
  rejectHandlerTypeEl.value =
    elExtensionElements.value.values?.filter(
      (ex) => ex.$type === `${prefix}:RejectHandlerType`
    )?.[0] || bpmnInstances().moddle.create(`${prefix}:RejectHandlerType`, { value: 1 })
  rejectHandlerType.value = rejectHandlerTypeEl.value.value
  returnNodeIdEl.value =
    elExtensionElements.value.values?.filter(
      (ex) => ex.$type === `${prefix}:RejectReturnTaskId`
    )?.[0] || bpmnInstances().moddle.create(`${prefix}:RejectReturnTaskId`, { value: '' })
  returnNodeId.value = returnNodeIdEl.value.value

  // The approver is empty time
  assignEmptyHandlerTypeEl.value =
    elExtensionElements.value.values?.filter(
      (ex) => ex.$type === `${prefix}:AssignEmptyHandlerType`
    )?.[0] || bpmnInstances().moddle.create(`${prefix}:AssignEmptyHandlerType`, { value: 1 })
  assignEmptyHandlerType.value = assignEmptyHandlerTypeEl.value.value
  assignEmptyUserIdsEl.value =
    elExtensionElements.value.values?.filter(
      (ex) => ex.$type === `${prefix}:AssignEmptyUserIds`
    )?.[0] || bpmnInstances().moddle.create(`${prefix}:AssignEmptyUserIds`, { value: '' })
  assignEmptyUserIds.value = assignEmptyUserIdsEl.value.value?.split(',').map((item) => {
    // If the number exceeds the maximum safe integer range，Treat it as a string
    let num = Number(item)
    return num > Number.MAX_SAFE_INTEGER || num < -Number.MAX_SAFE_INTEGER ? item : num
  })

  // Operation button
  buttonsSettingEl.value = elExtensionElements.value.values?.filter(
    (ex) => ex.$type === `${prefix}:ButtonsSetting`
  )
  if (buttonsSettingEl.value.length === 0) {
    DEFAULT_BUTTON_SETTING.forEach((item) => {
      buttonsSettingEl.value.push(
        bpmnInstances().moddle.create(`${prefix}:ButtonsSetting`, {
          'flowable:id': item.id,
          'flowable:displayName': item.displayName,
          'flowable:enable': item.enable
        })
      )
    })
  }

  // Field permissions
  if (formType.value === 10) {
    const fieldsPermissionList = elExtensionElements.value.values?.filter(
      (ex) => ex.$type === `${prefix}:FieldsPermission`
    )
    fieldsPermissionEl.value = []
    getNodeConfigFormFields()
    // Due to the default addition of the initiator element，This needs to be deleted
    fieldsPermissionConfig.value = fieldsPermissionConfig.value.slice(1)
    fieldsPermissionConfig.value.forEach((element) => {
      element.permission =
        fieldsPermissionList?.find((obj) => obj.field === element.field)?.permission ?? '1'
      fieldsPermissionEl.value.push(
        bpmnInstances().moddle.create(`${prefix}:FieldsPermission`, element)
      )
    })
  }

  // Do you need a signature
  signEnable.value =
    elExtensionElements.value.values?.filter((ex) => ex.$type === `${prefix}:SignEnable`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:SignEnable`, { value: false })

  // Approval Opinion
  reasonRequire.value =
    elExtensionElements.value.values?.filter((ex) => ex.$type === `${prefix}:ReasonRequire`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:ReasonRequire`, { value: false })

  // Keep the remaining extension elements，Easy to update the corresponding attribute of the element later
  otherExtensions.value =
    elExtensionElements.value.values?.filter(
      (ex) =>
        ex.$type !== `${prefix}:AssignStartUserHandlerType` &&
        ex.$type !== `${prefix}:RejectHandlerType` &&
        ex.$type !== `${prefix}:RejectReturnTaskId` &&
        ex.$type !== `${prefix}:AssignEmptyHandlerType` &&
        ex.$type !== `${prefix}:AssignEmptyUserIds` &&
        ex.$type !== `${prefix}:ButtonsSetting` &&
        ex.$type !== `${prefix}:FieldsPermission` &&
        ex.$type !== `${prefix}:ApproveType` &&
        ex.$type !== `${prefix}:SignEnable` &&
        ex.$type !== `${prefix}:ReasonRequire`
    ) ?? []

  // Update element extension properties，Avoid subsequent errors
  updateElementExtensions()
}

const updateAssignStartUserHandlerType = () => {
  assignStartUserHandlerTypeEl.value.value = assignStartUserHandlerType.value

  updateElementExtensions()
}

const updateRejectHandlerType = () => {
  rejectHandlerTypeEl.value.value = rejectHandlerType.value

  returnNodeId.value = returnTaskList.value[0].id
  returnNodeIdEl.value.value = returnNodeId.value

  updateElementExtensions()
}

const updateReturnNodeId = () => {
  returnNodeIdEl.value.value = returnNodeId.value

  updateElementExtensions()
}

const updateAssignEmptyHandlerType = () => {
  assignEmptyHandlerTypeEl.value.value = assignEmptyHandlerType.value

  updateElementExtensions()
}

const updateAssignEmptyUserIds = () => {
  assignEmptyUserIdsEl.value.value = assignEmptyUserIds.value.toString()

  updateElementExtensions()
}

const updateElementExtensions = () => {
  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: [
      ...otherExtensions.value,
      assignStartUserHandlerTypeEl.value,
      rejectHandlerTypeEl.value,
      returnNodeIdEl.value,
      assignEmptyHandlerTypeEl.value,
      assignEmptyUserIdsEl.value,
      approveType.value,
      ...buttonsSettingEl.value,
      ...fieldsPermissionEl.value,
      signEnable.value,
      reasonRequire.value
    ]
  })
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions
  })
}

watch(
  () => props.id,
  (val) => {
    val &&
      val.length &&
      nextTick(() => {
        resetCustomConfigList()
      })
  },
  { immediate: true }
)

function findAllPredecessorsExcludingStart(elementId, modeler) {
  const elementRegistry = modeler.get('elementRegistry')
  const allConnections = elementRegistry.filter((element) => element.type === 'bpmn:SequenceFlow')
  const predecessors = new Set() // use Set to avoid duplicate nodes
  const visited = new Set() // Used to record visited nodes

  // Check if it is the starting event node
  function isStartEvent(element) {
    return element.type === 'bpmn:StartEvent'
  }

  function findPredecessorsRecursively(element) {
    // If the node has already been accessed，Return directly，Avoiding loops
    if (visited.has(element)) {
      return
    }

    // Mark the current node as visited
    visited.add(element)

    // Get all connections connected to the current node
    const incomingConnections = allConnections.filter((connection) => connection.target === element)

    incomingConnections.forEach((connection) => {
      const source = connection.source // Obtain pre nodes

      // Only add predecessor nodes that are not the starting event
      if (!isStartEvent(source)) {
        predecessors.add(source.businessObject)
        // Recursive search for predecessor nodes
        findPredecessorsRecursively(source)
      }
    })
  }

  const targetElement = elementRegistry.get(elementId)
  if (targetElement) {
    findPredecessorsRecursively(targetElement)
  }

  return Array.from(predecessors) // Return the predecessor node array
}

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

const userOptions = ref<UserApi.UserVO[]>([]) // User List
onMounted(async () => {
  // Obtain user list
  userOptions.value = await UserApi.getSimpleUserList()
})
</script>

<style lang="scss" scoped>
.button-setting-pane {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-top: 8px;

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

.field-setting-pane {
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .field-setting-desc {
    padding-right: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
  }

  .field-permit-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding-left: 12px;
    line-height: 45px;
    background-color: #f8fafc0a;
    border: 1px solid #1f38581a;

    .first-title {
      text-align: left !important;
    }

    .other-titles {
      display: flex;
      justify-content: space-between;
    }

    .setting-title-label {
      display: inline-block;
      width: 100px;
      padding: 5px 0;
      font-size: 13px;
      font-weight: 700;
      color: #000;
      text-align: center;
    }
  }

  .field-setting-item {
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 38px;
    padding-left: 12px;
    border: 1px solid #1f38581a;
    border-top: 0;

    .field-setting-item-label {
      display: inline-block;
      width: 100px;
      min-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: text;
    }

    .field-setting-item-group {
      display: flex;
      justify-content: space-between;

      .item-radio-wrap {
        display: inline-block;
        width: 100px;
        text-align: center;
      }
    }
  }
}
</style>
