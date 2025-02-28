<template>
  <div v-loading="loading" class="overflow-auto">
    <SimpleProcessModel
      ref="simpleProcessModelRef"
      v-if="processNodeTree"
      :flow-node="processNodeTree"
      :readonly="false"
      @save="saveSimpleFlowModel"
    />
    <Dialog v-model="errorDialogVisible" title="Save Failed" width="400" :fullscreen="false">
      <div class="mb-2">The following nodes have incomplete content，Please modify and save</div>
      <div
        class="mb-3 b-rounded-1 bg-gray-100 p-2 line-height-normal"
        v-for="(item, index) in errorNodes"
        :key="index"
      >
        {{ item.name }} : {{ NODE_DEFAULT_TEXT.get(item.type) }}
      </div>
      <template #footer>
        <el-button type="primary" @click="errorDialogVisible = false">Got it</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import SimpleProcessModel from './SimpleProcessModel.vue'
import { SimpleFlowNode, NodeType, NodeId, NODE_DEFAULT_TEXT } from './consts'
import { getModel } from '@/api/bpm/model'
import { getForm, FormVO } from '@/api/bpm/form'
import { handleTree } from '@/utils/tree'
import * as RoleApi from '@/api/system/role'
import * as DeptApi from '@/api/system/dept'
import * as PostApi from '@/api/system/post'
import * as UserApi from '@/api/system/user'
import * as UserGroupApi from '@/api/bpm/userGroup'
import { BpmModelFormType } from '@/utils/constants'

defineOptions({
  name: 'SimpleProcessDesigner'
})

const emits = defineEmits(['success']) // Save successful event

const props = defineProps({
  modelId: {
    type: String,
    required: false
  },
  modelKey: {
    type: String,
    required: false
  },
  modelName: {
    type: String,
    required: false
  },
  // Number of personnel who can initiate the process
  startUserIds: {
    type: Array,
    required: false
  }
})

const processData = inject('processData') as Ref
const loading = ref(false)
const formFields = ref<string[]>([])
const formType = ref(20)
const roleOptions = ref<RoleApi.RoleVO[]>([]) // Role List
const postOptions = ref<PostApi.PostVO[]>([]) // Job List
const userOptions = ref<UserApi.UserVO[]>([]) // User List
const deptOptions = ref<DeptApi.DeptVO[]>([]) // Department List
const deptTreeOptions = ref()
const userGroupOptions = ref<UserGroupApi.UserGroupVO[]>([]) // User group list

provide('formFields', formFields)
provide('formType', formType)
provide('roleList', roleOptions)
provide('postList', postOptions)
provide('userList', userOptions)
provide('deptList', deptOptions)
provide('userGroupList', userGroupOptions)
provide('deptTree', deptTreeOptions)
provide('startUserIds', props.startUserIds)
provide('tasks', [])
provide('processInstance', {})
const message = useMessage() // internationalization
const processNodeTree = ref<SimpleFlowNode | undefined>()
provide('processNodeTree', processNodeTree)
const errorDialogVisible = ref(false)
let errorNodes: SimpleFlowNode[] = []

// Method for adding and updating models
const updateModel = () => {
  if (!processNodeTree.value) {
    processNodeTree.value = {
      name: 'Initiator',
      type: NodeType.START_USER_NODE,
      id: NodeId.START_USER_NODE_ID,
      childNode: {
        id: NodeId.END_EVENT_NODE_ID,
        name: 'End',
        type: NodeType.END_EVENT_NODE
      }
    }
    // Also triggers a save during initialization
    saveSimpleFlowModel(processNodeTree.value)
  }
}

const saveSimpleFlowModel = async (simpleModelNode: SimpleFlowNode) => {
  if (!simpleModelNode) {
    return
  }

  try {
    processData.value = simpleModelNode
    emits('success', simpleModelNode)
  } catch (error) {
    console.error('Save Failed:', error)
  }
}

// Validate the node settings. Temporarily, if `showText` is empty, it is considered an incorrect node configuration.
const validateNode = (node: SimpleFlowNode | undefined, errorNodes: SimpleFlowNode[]) => {
  if (node) {
    const { type, showText, conditionNodes } = node
    if (type == NodeType.END_EVENT_NODE) {
      return
    }
    if (type == NodeType.START_USER_NODE) {
      // The initiator node does not need to be verified temporarily，Directly verify child nodes
      validateNode(node.childNode, errorNodes)
    }

    if (
      type === NodeType.USER_TASK_NODE ||
      type === NodeType.COPY_TASK_NODE ||
      type === NodeType.CONDITION_NODE
    ) {
      if (!showText) {
        errorNodes.push(node)
      }
      validateNode(node.childNode, errorNodes)
    }

    if (
      type == NodeType.CONDITION_BRANCH_NODE ||
      type == NodeType.PARALLEL_BRANCH_NODE ||
      type == NodeType.INCLUSIVE_BRANCH_NODE
    ) {
      // Branch node
      // 1. Verify each branch first
      conditionNodes?.forEach((item) => {
        validateNode(item, errorNodes)
      })
      // 2. Verify child nodes
      validateNode(node.childNode, errorNodes)
    }
  }
}

onMounted(async () => {
  try {
    loading.value = true
    // Get form fields
    if (props.modelId) {
      const bpmnModel = await getModel(props.modelId)
      if (bpmnModel) {
        formType.value = bpmnModel.formType
        if (formType.value === BpmModelFormType.NORMAL && bpmnModel.formId) {
          const bpmnForm = (await getForm(bpmnModel.formId)) as unknown as FormVO
          formFields.value = bpmnForm?.fields
        }
      }
    }
    // Get a list of roles
    roleOptions.value = await RoleApi.getSimpleRoleList()
    // Obtain a list of job positions
    postOptions.value = await PostApi.getSimplePostList()
    // Obtain user list
    userOptions.value = await UserApi.getSimpleUserList()
    // Obtain department list
    deptOptions.value = await DeptApi.getSimpleDeptList()
    deptTreeOptions.value = handleTree(deptOptions.value as DeptApi.DeptVO[], 'id')
    // Get user group list
    userGroupOptions.value = await UserGroupApi.getUserGroupSimpleList()
    // Loading process data
    if (processData.value) {
      processNodeTree.value = processData?.value
    } else {
      updateModel()
    }
  } finally {
    loading.value = false
  }
})

const simpleProcessModelRef = ref()

defineExpose({})
</script>
