<template>
  <el-form label-width="120px">
    <el-form-item label="Rule Type" prop="candidateStrategy">
      <el-select
        v-model="userTaskForm.candidateStrategy"
        clearable
        style="width: 100%"
        @change="changeCandidateStrategy"
      >
        <el-option
          v-for="(dict, index) in CANDIDATE_STRATEGY"
          :key="index"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == CandidateStrategy.ROLE"
      label="Designated Role"
      prop="candidateParam"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        multiple
        style="width: 100%"
        @change="updateElementTask"
      >
        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="
        userTaskForm.candidateStrategy == CandidateStrategy.DEPT_MEMBER ||
        userTaskForm.candidateStrategy == CandidateStrategy.DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER
      "
      label="Designated Department"
      prop="candidateParam"
      span="24"
    >
      <el-tree-select
        ref="treeRef"
        v-model="userTaskForm.candidateParam"
        :data="deptTreeOptions"
        :props="defaultProps"
        empty-text="Loading in progress，Please wait a moment"
        multiple
        node-key="id"
        show-checkbox
        @change="updateElementTask"
      />
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == CandidateStrategy.POST"
      label="Designated Position"
      prop="candidateParam"
      span="24"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        multiple
        style="width: 100%"
        @change="updateElementTask"
      >
        <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == CandidateStrategy.USER"
      label="Designated User"
      prop="candidateParam"
      span="24"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        multiple
        style="width: 100%"
        @change="updateElementTask"
      >
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="item.nickname"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.USER_GROUP"
      label="Specify User Group"
      prop="candidateParam"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        multiple
        style="width: 100%"
        @change="updateElementTask"
      >
        <el-option
          v-for="item in userGroupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.FORM_USER"
      label="User Fields in The Form"
      prop="formUser"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        style="width: 100%"
        @change="handleFormUserChange"
      >
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
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.FORM_DEPT_LEADER"
      label="Department Fields in The Form"
      prop="formDept"
    >
      <el-select
        v-model="userTaskForm.candidateParam"
        clearable
        style="width: 100%"
        @change="updateElementTask"
      >
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
        userTaskForm.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.START_USER_DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER ||
        userTaskForm.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER
      "
      :label="deptLevelLabel!"
      prop="deptLevel"
      span="24"
    >
      <el-select v-model="deptLevel" clearable @change="updateElementTask">
        <el-option
          v-for="(item, index) in MULTI_LEVEL_DEPT"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy === CandidateStrategy.EXPRESSION"
      label="Process Expression"
      prop="candidateParam"
    >
      <el-input
        type="textarea"
        v-model="userTaskForm.candidateParam[0]"
        clearable
        style="width: 100%"
        @change="updateElementTask"
      />
      <XButton
        class="!w-1/1 mt-5px"
        type="success"
        preIcon="ep:select"
        title="Select Expression"
        size="small"
        @click="openProcessExpressionDialog"
      />
      <!-- Select pop-up window -->
      <ProcessExpressionDialog ref="processExpressionDialogRef" @select="selectProcessExpression" />
    </el-form-item>

    <el-form-item label="Skip Expression" prop="skipExpression">
      <el-input
        type="textarea"
        v-model="userTaskForm.skipExpression"
        clearable
        style="width: 100%"
        @change="updateSkipExpression"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  CANDIDATE_STRATEGY,
  CandidateStrategy,
  FieldPermissionType,
  MULTI_LEVEL_DEPT
} from '@/components/SimpleProcessDesignerV2/src/consts'
import { defaultProps, handleTree } from '@/utils/tree'
import * as RoleApi from '@/api/system/role'
import * as DeptApi from '@/api/system/dept'
import * as PostApi from '@/api/system/post'
import * as UserApi from '@/api/system/user'
import * as UserGroupApi from '@/api/bpm/userGroup'
import ProcessExpressionDialog from './ProcessExpressionDialog.vue'
import { ProcessExpressionVO } from '@/api/bpm/processExpression'
import { useFormFieldsPermission } from '@/components/SimpleProcessDesignerV2/src/node'

defineOptions({ name: 'UserTask' })
const props = defineProps({
  id: String,
  type: String
})
const prefix = inject('prefix')
const userTaskForm = ref({
  candidateStrategy: undefined, // Allocation rules
  candidateParam: [], // Allocation options
  skipExpression: '' // Skip expression
})
const bpmnElement = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances

const roleOptions = ref<RoleApi.RoleVO[]>([]) // Role List
const deptTreeOptions = ref() // Department Tree
const postOptions = ref<PostApi.PostVO[]>([]) // Job List
const userOptions = ref<UserApi.UserVO[]>([]) // User List
const userGroupOptions = ref<UserGroupApi.UserGroupVO[]>([]) // User group list

const { formFieldOptions } = useFormFieldsPermission(FieldPermissionType.READ)
// User field options within the form, Must be mandatory and user selector
const userFieldOnFormOptions = computed(() => {
  return formFieldOptions.filter((item) => item.type === 'UserSelect')
})
// Form Internal Door Field Options, Must be mandatory and department selector
const deptFieldOnFormOptions = computed(() => {
  return formFieldOptions.filter((item) => item.type === 'DeptSelect')
})

const deptLevel = ref(1)
const deptLevelLabel = computed(() => {
  let label = 'Department Leader Source'
  if (userTaskForm.value.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER) {
    label = label + '(Designated Department Up)'
  } else if (userTaskForm.value.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER) {
    label = label + '(The Department of The Form Upwards)'
  } else {
    label = label + '(The Initiator's Department Upward)'
  }
  return label
})

const otherExtensions = ref()

const resetTaskForm = () => {
  const businessObject = bpmnElement.value.businessObject
  if (!businessObject) {
    return
  }

  const extensionElements =
    businessObject?.extensionElements ??
    bpmnInstances().moddle.create('bpmn:ExtensionElements', { values: [] })
  userTaskForm.value.candidateStrategy = extensionElements.values?.filter(
    (ex) => ex.$type === `${prefix}:CandidateStrategy`
  )?.[0]?.value
  const candidateParamStr = extensionElements.values?.filter(
    (ex) => ex.$type === `${prefix}:CandidateParam`
  )?.[0]?.value
  if (candidateParamStr && candidateParamStr.length > 0) {
    if (userTaskForm.value.candidateStrategy === CandidateStrategy.EXPRESSION) {
      // Special: For the process expression, there is only one input box.
      userTaskForm.value.candidateParam = [candidateParamStr]
    } else if (userTaskForm.value.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER) {
      // Special: For multi - level department heads, they need to be separated by '|'.
      userTaskForm.value.candidateParam = candidateParamStr
        .split('|')[0]
        .split(',')
        .map((item) => {
          // If the number exceeds the maximum safe integer range，Treat it as a string
          let num = Number(item)
          return num > Number.MAX_SAFE_INTEGER || num < -Number.MAX_SAFE_INTEGER ? item : num
        })
      deptLevel.value = +candidateParamStr.split('|')[1]
    } else if (
      userTaskForm.value.candidateStrategy == CandidateStrategy.START_USER_DEPT_LEADER ||
      userTaskForm.value.candidateStrategy == CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER
    ) {
      userTaskForm.value.candidateParam = +candidateParamStr
      deptLevel.value = +candidateParamStr
    } else if (userTaskForm.value.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER) {
      userTaskForm.value.candidateParam = candidateParamStr.split('|')[0]
      deptLevel.value = +candidateParamStr.split('|')[1]
    } else {
      userTaskForm.value.candidateParam = candidateParamStr.split(',').map((item) => {
        // If the number exceeds the maximum safe integer range，Treat it as a string
        let num = Number(item)
        return num > Number.MAX_SAFE_INTEGER || num < -Number.MAX_SAFE_INTEGER ? item : num
      })
    }
  } else {
    userTaskForm.value.candidateParam = []
  }

  otherExtensions.value =
    extensionElements.values?.filter(
      (ex) => ex.$type !== `${prefix}:CandidateStrategy` && ex.$type !== `${prefix}:CandidateParam`
    ) ?? []

  // Skip expression
  if (businessObject.skipExpression != undefined) {
    userTaskForm.value.skipExpression = businessObject.skipExpression
  } else {
    userTaskForm.value.skipExpression = ''
  }

  // Use instead throughextensionElementsTo store data
  return
  if (businessObject.candidateStrategy != undefined) {
    userTaskForm.value.candidateStrategy = parseInt(businessObject.candidateStrategy) as any
  } else {
    userTaskForm.value.candidateStrategy = undefined
  }
  if (businessObject.candidateParam && businessObject.candidateParam.length > 0) {
    if (userTaskForm.value.candidateStrategy === 60) {
      // Special: For the process expression, there is only one input box.
      userTaskForm.value.candidateParam = [businessObject.candidateParam]
    } else {
      userTaskForm.value.candidateParam = businessObject.candidateParam
        .split(',')
        .map((item) => item)
    }
  } else {
    userTaskForm.value.candidateParam = []
  }
}

/** When updating the `candidateStrategy` field, you need to clear the `candidateParam` and trigger the update of the BPMN diagram. */
const changeCandidateStrategy = () => {
  userTaskForm.value.candidateParam = []
  deptLevel.value = 1
  if (userTaskForm.value.candidateStrategy === CandidateStrategy.FORM_USER) {
    // User fields in special processing forms，When only the initiator option is available, the initiator should be selected
    if (!userFieldOnFormOptions.value || userFieldOnFormOptions.value.length <= 1) {
      userTaskForm.value.candidateStrategy = CandidateStrategy.START_USER
    }
  }
  updateElementTask()
}

/** When an option is selected, update the BPMN diagram.  */
const updateElementTask = () => {
  let candidateParam =
    userTaskForm.value.candidateParam instanceof Array
      ? userTaskForm.value.candidateParam.join(',')
      : userTaskForm.value.candidateParam

  // Special handling of multi-level departmental situations
  if (
    userTaskForm.value.candidateStrategy == CandidateStrategy.MULTI_LEVEL_DEPT_LEADER ||
    userTaskForm.value.candidateStrategy == CandidateStrategy.FORM_DEPT_LEADER
  ) {
    candidateParam += '|' + deptLevel.value
  }
  // Special handling initiator department head、Initiator Continuous Department Head
  if (
    userTaskForm.value.candidateStrategy == CandidateStrategy.START_USER_DEPT_LEADER ||
    userTaskForm.value.candidateStrategy == CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER
  ) {
    candidateParam = deptLevel.value + ''
  }

  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: [
      ...otherExtensions.value,
      bpmnInstances().moddle.create(`${prefix}:CandidateStrategy`, {
        value: userTaskForm.value.candidateStrategy
      }),
      bpmnInstances().moddle.create(`${prefix}:CandidateParam`, {
        value: candidateParam
      })
    ]
  })
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions
  })

  // Switch to storing data via extensionElements.
  return
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    candidateStrategy: userTaskForm.value.candidateStrategy,
    candidateParam: userTaskForm.value.candidateParam.join(',')
  })
}

const updateSkipExpression = () => {
  if (userTaskForm.value.skipExpression && userTaskForm.value.skipExpression !== '') {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      skipExpression: userTaskForm.value.skipExpression
    })
  } else {
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      skipExpression: null
    })
  }
}

// Open the listener pop-up window
const processExpressionDialogRef = ref()
const openProcessExpressionDialog = async () => {
  processExpressionDialogRef.value.open()
}
const selectProcessExpression = (expression: ProcessExpressionVO) => {
  userTaskForm.value.candidateParam = [expression.expression]
  updateElementTask()
}

const handleFormUserChange = (e) => {
  if (e === 'PROCESS_START_USER_ID') {
    userTaskForm.value.candidateParam = []
    userTaskForm.value.candidateStrategy = CandidateStrategy.START_USER
  }
  updateElementTask()
}

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

onMounted(async () => {
  // Get a list of roles
  roleOptions.value = await RoleApi.getSimpleRoleList()
  // Get department list
  const deptOptions = await DeptApi.getSimpleDeptList()
  deptTreeOptions.value = handleTree(deptOptions, 'id')
  // Get a list of job positions
  postOptions.value = await PostApi.getSimplePostList()
  // Get user list
  userOptions.value = await UserApi.getSimpleUserList()
  // Get a list of user groups
  userGroupOptions.value = await UserGroupApi.getUserGroupSimpleList()
})

onBeforeUnmount(() => {
  bpmnElement.value = null
})
</script>
