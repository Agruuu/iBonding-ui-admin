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
      <el-tab-pane label="Permission" name="user">
        <el-text v-if="!startUserIds || startUserIds.length === 0"> All members can initiate the process </el-text>
        <el-text v-else-if="startUserIds.length == 1">
          {{ getUserNicknames(startUserIds) }} Initiate a Process
        </el-text>
        <el-text v-else>
          <el-tooltip
            class="box-item"
            effect="dark"
            placement="top"
            :content="getUserNicknames(startUserIds)"
          >
            {{ getUserNicknames(startUserIds.slice(0,2)) }} etc. {{ startUserIds.length }} people can initiate processes
          </el-tooltip>
        </el-text>
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
import { SimpleFlowNode, NodeType, FieldPermissionType, START_USER_BUTTON_SETTING } from '../consts'
import { useWatchNode, useDrawer, useNodeName, useFormFieldsPermission } from '../node'
import * as UserApi from '@/api/system/user'
defineOptions({
  name: 'StartUserNodeConfig'
})
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
// User ID that can initiate the process
const startUserIds = inject<Ref<any[]>>('startUserIds')
// User List
const userOptions = inject<Ref<UserApi.UserVO[]>>('userList')
// Drawer configuration
const { settingVisible, closeDrawer, openDrawer } = useDrawer()
// Current node
const currentNode = useWatchNode(props)
// Node Name
const { nodeName, showInput, clickIcon, blurEvent } = useNodeName(NodeType.COPY_TASK_NODE)
// Activated Tab Tag Page
const activeTabName = ref('user')
// Form field permission configuration
const { formType, fieldsPermissionConfig, getNodeConfigFormFields } = useFormFieldsPermission(
  FieldPermissionType.WRITE
)
const getUserNicknames = (userIds: number[]): string => {
  if (!userIds || userIds.length === 0) {
    return ''
  }
  const nicknames: string[] = []
  userIds.forEach((userId) => {
    const found = userOptions?.value.find((item) => item.id === userId)
    if (found && found.nickname) {
      nicknames.push(found.nickname)
    }
  })
  return nicknames.join(',')
}
// Save configuration
const saveConfig = async () => {
  activeTabName.value = 'user'
  currentNode.value.name = nodeName.value!
  currentNode.value.showText = 'Already Set'
  // Set form permissions
  currentNode.value.fieldsPermission = fieldsPermissionConfig.value
  // Set button permissions for the initiator
  currentNode.value.buttonsSetting = START_USER_BUTTON_SETTING
  settingVisible.value = false
  return true
}
// Display initiator node configuration， Transferred from the parent component
const showStartUserNodeConfig = (node: SimpleFlowNode) => {
  nodeName.value = node.name
  // Form field permissions
  getNodeConfigFormFields(node.fieldsPermission)
}

defineExpose({ openDrawer, showStartUserNodeConfig }) // Expose method to parent component
</script>

<style lang="scss" scoped></style>
