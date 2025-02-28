import { TaskStatusEnum } from '@/api/bpm/task'
import * as RoleApi from '@/api/system/role'
import * as DeptApi from '@/api/system/dept'
import * as PostApi from '@/api/system/post'
import * as UserApi from '@/api/system/user'
import * as UserGroupApi from '@/api/bpm/userGroup'
import {
  SimpleFlowNode,
  CandidateStrategy,
  NodeType,
  ApproveMethodType,
  RejectHandlerType,
  NODE_DEFAULT_NAME,
  AssignStartUserHandlerType,
  AssignEmptyHandlerType,
  FieldPermissionType,
  HttpRequestParam,
  ProcessVariableEnum
} from './consts'
import { parseFormFields } from '@/components/FormCreate/src/utils'

export function useWatchNode(props: { flowNode: SimpleFlowNode }): Ref<SimpleFlowNode> {
  const node = ref<SimpleFlowNode>(props.flowNode)
  watch(
    () => props.flowNode,
    (newValue) => {
      node.value = newValue
    }
  )
  return node
}

// analysis formCreate all form fields, And return
const parseFormCreateFields = (formFields?: string[]) => {
  const result: Array<Record<string, any>> = []
  if (formFields) {
    formFields.forEach((fieldStr: string) => {
      parseFormFields(JSON.parse(fieldStr), result)
    })
  }
  return result
}

/**
 * @description Form data permission configuration，Used for initiator nodes 、Approval Node、CC Node
 */
export function useFormFieldsPermission(defaultPermission: FieldPermissionType) {
  // Field permission configuration. Need to have field, title,  permissioin attribute
  const fieldsPermissionConfig = ref<Array<Record<string, any>>>([])

  const formType = inject<Ref<number | undefined>>('formType', ref()) // form types 

  const formFields = inject<Ref<string[]>>('formFields', ref([])) // Process form fields

  const getNodeConfigFormFields = (nodeFormFields?: Array<Record<string, string>>) => {
    nodeFormFields = toRaw(nodeFormFields)
    if (!nodeFormFields || nodeFormFields.length === 0) {
      fieldsPermissionConfig.value = getDefaultFieldsPermission(unref(formFields))
    } else {
      fieldsPermissionConfig.value = mergeFieldsPermission(nodeFormFields, unref(formFields))
    }
  }
  // Merge the set form field permissions，Current process form fields (Possible addition，Or deleted the field)
  const mergeFieldsPermission = (
    formFieldsPermisson: Array<Record<string, string>>,
    formFields?: string[]
  ) => {
    let mergedFieldsPermission: Array<Record<string, any>> = []
    if (formFields) {
      mergedFieldsPermission = parseFormCreateFields(formFields).map((item) => {
        const found = formFieldsPermisson.find(
          (fieldPermission) => fieldPermission.field == item.field
        )
        return {
          field: item.field,
          title: item.title,
          permission: found ? found.permission : defaultPermission
        }
      })
    }
    return mergedFieldsPermission
  }

  // Default form permissions： Get all fields of the form，Set the default field permission to read-only
  const getDefaultFieldsPermission = (formFields?: string[]) => {
    let defaultFieldsPermission: Array<Record<string, any>> = []
    if (formFields) {
      defaultFieldsPermission = parseFormCreateFields(formFields).map((item) => {
        return {
          field: item.field,
          title: item.title,
          permission: defaultPermission
        }
      })
    }
    return defaultFieldsPermission
  }

  // Get all fields of the form，As a dropdown option
  const formFieldOptions = parseFormCreateFields(unref(formFields))

  return {
    formType,
    fieldsPermissionConfig,
    formFieldOptions,
    getNodeConfigFormFields
  }
}
/**
 * @description Retrieve the fields of the form
 */
export function useFormFields() {
  const formFields = inject<Ref<string[]>>('formFields', ref([])) // Process form fields
  return parseFormCreateFields(unref(formFields))
}

// TODO @Agruuu：In the future, similar logic like `useFormFieldsPermission` needs to be extracted into a common method.
/**
 * @description Get the fields of the process form and the fields of the initiator.
 */
export function useFormFieldsAndStartUser() {
  const injectFormFields = inject<Ref<string[]>>('formFields', ref([])) // Process form fields.
  const formFields = parseFormCreateFields(unref(injectFormFields))
  // Add the initiator.
  formFields.unshift({
    field: ProcessVariableEnum.START_USER_ID,
    title: 'Initiator',
    required: true
  })
  return formFields
}

export type UserTaskFormType = {
  candidateStrategy: CandidateStrategy
  approveMethod: ApproveMethodType
  roleIds?: number[] // role
  deptIds?: number[] // department
  deptLevel?: number // Department level
  userIds?: number[] // user
  userGroups?: number[] // User group
  postIds?: number[] // post
  expression?: string // Process expression
  formUser?: string // User fields within the form
  formDept?: string // Internal door fields in the form
  approveRatio?: number
  rejectHandlerType?: RejectHandlerType
  returnNodeId?: string
  timeoutHandlerEnable?: boolean
  timeoutHandlerType?: number
  assignEmptyHandlerType?: AssignEmptyHandlerType
  assignEmptyHandlerUserIds?: number[]
  assignStartUserHandlerType?: AssignStartUserHandlerType
  timeDuration?: number
  maxRemindCount?: number
  buttonsSetting: any[]
  taskCreateListenerEnable?: boolean
  taskCreateListenerPath?: string
  taskCreateListener?: {
    header: HttpRequestParam[]
    body: HttpRequestParam[]
  }
  taskAssignListenerEnable?: boolean
  taskAssignListenerPath?: string
  taskAssignListener?: {
    header: HttpRequestParam[]
    body: HttpRequestParam[]
  }
  taskCompleteListenerEnable?: boolean
  taskCompleteListenerPath?: string
  taskCompleteListener?: {
    header: HttpRequestParam[]
    body: HttpRequestParam[]
  }
  signEnable: boolean
  reasonRequire: boolean
}

export type CopyTaskFormType = {
  candidateStrategy: CandidateStrategy
  roleIds?: number[] // role
  deptIds?: number[] // department
  deptLevel?: number // Department level
  userIds?: number[] // user
  userGroups?: number[] // User group
  postIds?: number[] // post
  formUser?: string // User fields within the form
  formDept?: string // Internal door fields in the form
  expression?: string // Process expression
}

/**
 * @description Node Form Data。 Used for approval nodes、CC Node
 */
export function useNodeForm(nodeType: NodeType) {
  const roleOptions = inject<Ref<RoleApi.RoleVO[]>>('roleList', ref([])) // Role List
  const postOptions = inject<Ref<PostApi.PostVO[]>>('postList', ref([])) // Job List
  const userOptions = inject<Ref<UserApi.UserVO[]>>('userList', ref([])) // User List
  const deptOptions = inject<Ref<DeptApi.DeptVO[]>>('deptList', ref([])) // Department List
  const userGroupOptions = inject<Ref<UserGroupApi.UserGroupVO[]>>('userGroupList', ref([])) // User group list
  const deptTreeOptions = inject('deptTree', ref()) // Department Tree
  const formFields = inject<Ref<string[]>>('formFields', ref([])) // Process form fields
  const configForm = ref<UserTaskFormType | CopyTaskFormType>()
  if (nodeType === NodeType.USER_TASK_NODE) {
    configForm.value = {
      candidateStrategy: CandidateStrategy.USER,
      approveMethod: ApproveMethodType.SEQUENTIAL_APPROVE,
      approveRatio: 100,
      rejectHandlerType: RejectHandlerType.FINISH_PROCESS,
      assignStartUserHandlerType: AssignStartUserHandlerType.START_USER_AUDIT,
      returnNodeId: '',
      timeoutHandlerEnable: false,
      timeoutHandlerType: 1,
      timeDuration: 6, // default 6 hour
      maxRemindCount: 1, // default remind 1 second
      buttonsSetting: []
    }
  } else {
    configForm.value = {
      candidateStrategy: CandidateStrategy.USER
    }
  }

  const getShowText = (): string => {
    let showText = ''
    // Designated members
    if (configForm.value?.candidateStrategy === CandidateStrategy.USER) {
      if (configForm.value?.userIds!.length > 0) {
        const candidateNames: string[] = []
        userOptions?.value.forEach((item) => {
          if (configForm.value?.userIds!.includes(item.id)) {
            candidateNames.push(item.nickname)
          }
        })
        showText = `Designated Users: ${candidateNames.join(',')}`
      }
    }
    // Designated role
    if (configForm.value?.candidateStrategy === CandidateStrategy.ROLE) {
      if (configForm.value.roleIds!.length > 0) {
        const candidateNames: string[] = []
        roleOptions?.value.forEach((item) => {
          if (configForm.value?.roleIds!.includes(item.id)) {
            candidateNames.push(item.name)
          }
        })
        showText = `Designated Role: ${candidateNames.join(',')}`
      }
    }
    // Designated department
    if (
      configForm.value?.candidateStrategy === CandidateStrategy.DEPT_MEMBER ||
      configForm.value?.candidateStrategy === CandidateStrategy.DEPT_LEADER ||
      configForm.value?.candidateStrategy === CandidateStrategy.MULTI_LEVEL_DEPT_LEADER
    ) {
      if (configForm.value?.deptIds!.length > 0) {
        const candidateNames: string[] = []
        deptOptions?.value.forEach((item) => {
          if (configForm.value?.deptIds!.includes(item.id!)) {
            candidateNames.push(item.name)
          }
        })
        if (configForm.value.candidateStrategy === CandidateStrategy.DEPT_MEMBER) {
          showText = `Department Users: ${candidateNames.join(',')}`
        } else if (configForm.value.candidateStrategy === CandidateStrategy.DEPT_LEADER) {
          showText = `Department Leader: ${candidateNames.join(',')}`
        } else {
          showText = `Leader of Multi-level Departments: ${candidateNames.join(',')}`
        }
      }
    }

    // Designated position
    if (configForm.value?.candidateStrategy === CandidateStrategy.POST) {
      if (configForm.value.postIds!.length > 0) {
        const candidateNames: string[] = []
        postOptions?.value.forEach((item) => {
          if (configForm.value?.postIds!.includes(item.id!)) {
            candidateNames.push(item.name)
          }
        })
        showText = `Designated Position: ${candidateNames.join(',')}`
      }
    }
    // Specify user group
    if (configForm.value?.candidateStrategy === CandidateStrategy.USER_GROUP) {
      if (configForm.value?.userGroups!.length > 0) {
        const candidateNames: string[] = []
        userGroupOptions?.value.forEach((item) => {
          if (configForm.value?.userGroups!.includes(item.id)) {
            candidateNames.push(item.name)
          }
        })
        showText = `Specify User Group:  ${candidateNames.join(',')}`
      }
    }

    // User fields within the form
    if (configForm.value?.candidateStrategy === CandidateStrategy.FORM_USER) {
      const formFieldOptions = parseFormCreateFields(unref(formFields))
      const item = formFieldOptions.find((item) => item.field === configForm.value?.formUser)
      showText = `Form user: ${item?.title}`
    }

    // Internal door manager of the form
    if (configForm.value?.candidateStrategy === CandidateStrategy.FORM_DEPT_LEADER) {
      showText = `Department Manager of The Form`
    }

    // Initiator's Choice
    if (configForm.value?.candidateStrategy === CandidateStrategy.START_USER_SELECT) {
      showText = `Initiator Choice`
    }
    // The initiator themselves
    if (configForm.value?.candidateStrategy === CandidateStrategy.START_USER) {
      showText = `The Initiator Themselves`
    }
    // The department head of the initiator
    if (configForm.value?.candidateStrategy === CandidateStrategy.START_USER_DEPT_LEADER) {
      showText = `The Department Leader of The Initiator`
    }
    // The department head of the initiator
    if (
      configForm.value?.candidateStrategy === CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER
    ) {
      showText = `Initiator Continuous Department Leader`
    }
    // Process expression
    if (configForm.value?.candidateStrategy === CandidateStrategy.EXPRESSION) {
      showText = `Process Expression：${configForm.value.expression}`
    }
    return showText
  }

  /**
   *  Assign values to candidate parameters
   */
  const handleCandidateParam = () => {
    let candidateParam: undefined | string = undefined
    if (!configForm.value) {
      return candidateParam
    }
    switch (configForm.value.candidateStrategy) {
      case CandidateStrategy.USER:
        candidateParam = configForm.value.userIds!.join(',')
        break
      case CandidateStrategy.ROLE:
        candidateParam = configForm.value.roleIds!.join(',')
        break
      case CandidateStrategy.POST:
        candidateParam = configForm.value.postIds!.join(',')
        break
      case CandidateStrategy.USER_GROUP:
        candidateParam = configForm.value.userGroups!.join(',')
        break
      case CandidateStrategy.FORM_USER:
        candidateParam = configForm.value.formUser!
        break
      case CandidateStrategy.EXPRESSION:
        candidateParam = configForm.value.expression!
        break
      case CandidateStrategy.DEPT_MEMBER:
      case CandidateStrategy.DEPT_LEADER:
        candidateParam = configForm.value.deptIds!.join(',')
        break
      // Department Head of Initiator
      case CandidateStrategy.START_USER_DEPT_LEADER:
      case CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER:
        candidateParam = configForm.value.deptLevel + ''
        break
      // Designate the heads of consecutive multi-level departments
      case CandidateStrategy.MULTI_LEVEL_DEPT_LEADER: {
        // The format of the candidate parameters: separated by `|`. The part on the left represents the department field within the form, and the part on the right represents the department level.
        const deptIds = configForm.value.deptIds!.join(',')
        candidateParam = deptIds.concat('|' + configForm.value.deptLevel + '')
        break
      }
      // The person in charge of the internal door of the form
      case CandidateStrategy.FORM_DEPT_LEADER: {
        // Candidate parameter format: | separate 。On the left is the internal door field of the form。 On the right is the department hierarchy
        const deptFieldOnForm = configForm.value.formDept!
        candidateParam = deptFieldOnForm.concat('|' + configForm.value.deptLevel + '')
        break
      }
      default:
        break
    }
    return candidateParam
  }
  /**
   *  Analyze candidate parameters
   */
  const parseCandidateParam = (
    candidateStrategy: CandidateStrategy,
    candidateParam: string | undefined
  ) => {
    if (!configForm.value || !candidateParam) {
      return
    }
    switch (candidateStrategy) {
      case CandidateStrategy.USER: {
        configForm.value.userIds = candidateParam.split(',').map((item) => +item)
        break
      }
      case CandidateStrategy.ROLE:
        configForm.value.roleIds = candidateParam.split(',').map((item) => +item)
        break
      case CandidateStrategy.POST:
        configForm.value.postIds = candidateParam.split(',').map((item) => +item)
        break
      case CandidateStrategy.USER_GROUP:
        configForm.value.userGroups = candidateParam.split(',').map((item) => +item)
        break
      case CandidateStrategy.FORM_USER:
        configForm.value.formUser = candidateParam
        break
      case CandidateStrategy.EXPRESSION:
        configForm.value.expression = candidateParam
        break
      case CandidateStrategy.DEPT_MEMBER:
      case CandidateStrategy.DEPT_LEADER:
        configForm.value.deptIds = candidateParam.split(',').map((item) => +item)
        break
      // Department Head of Initiator
      case CandidateStrategy.START_USER_DEPT_LEADER:
      case CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER:
        configForm.value.deptLevel = +candidateParam
        break
      // Designate the heads of consecutive multi-level departments
      case CandidateStrategy.MULTI_LEVEL_DEPT_LEADER: {
        // Candidate parameter format: | separate 。On the left is the department（Multiple departments use , separate）。 On the right is the department hierarchy
        const paramArray = candidateParam.split('|')
        configForm.value.deptIds = paramArray[0].split(',').map((item) => +item)
        configForm.value.deptLevel = +paramArray[1]
        break
      }
      // The department head in the form
      case CandidateStrategy.FORM_DEPT_LEADER: {
        // Candidate parameter format: | separate 。On the left is the department field in the form。 On the right is the department hierarchy
        const paramArray = candidateParam.split('|')
        configForm.value.formDept = paramArray[0]
        configForm.value.deptLevel = +paramArray[1]
        break
      }
      default:
        break
    }
  }
  return {
    configForm,
    roleOptions,
    postOptions,
    userOptions,
    userGroupOptions,
    deptTreeOptions,
    handleCandidateParam,
    parseCandidateParam,
    getShowText
  }
}

/**
 * @description Drawer configuration
 */
export function useDrawer() {
  // Is the drawer configuration visible
  const settingVisible = ref(false)
  // Close the configuration drawer
  const closeDrawer = () => {
    settingVisible.value = false
  }
  // Open the configuration drawer
  const openDrawer = () => {
    settingVisible.value = true
  }
  return {
    settingVisible,
    closeDrawer,
    openDrawer
  }
}

/**
 * @description Node name configuration
 */
export function useNodeName(nodeType: NodeType) {
  // Node Name
  const nodeName = ref<string>()
  // Node Name Input Box
  const showInput = ref(false)
  // Click on the node name editing icon
  const clickIcon = () => {
    showInput.value = true
  }
  // Node name input box loses focus
  const blurEvent = () => {
    showInput.value = false
    nodeName.value = nodeName.value || (NODE_DEFAULT_NAME.get(nodeType) as string)
  }
  return {
    nodeName,
    showInput,
    clickIcon,
    blurEvent
  }
}

export function useNodeName2(node: Ref<SimpleFlowNode>, nodeType: NodeType) {
  // Display node name input box
  const showInput = ref(false)
  // Node name input box loses focus
  const blurEvent = () => {
    showInput.value = false
    node.value.name = node.value.name || (NODE_DEFAULT_NAME.get(nodeType) as string)
  }
  // Click on the node title to enter
  const clickTitle = () => {
    showInput.value = true
  }
  return {
    showInput,
    clickTitle,
    blurEvent
  }
}

/**
 * @description According to the node task status，Get node task status style
 */
export function useTaskStatusClass(taskStatus: TaskStatusEnum | undefined): string {
  if (!taskStatus) {
    return ''
  }
  if (taskStatus === TaskStatusEnum.APPROVE) {
    return 'status-pass'
  }
  if (taskStatus === TaskStatusEnum.RUNNING) {
    return 'status-running'
  }
  if (taskStatus === TaskStatusEnum.REJECT) {
    return 'status-reject'
  }
  if (taskStatus === TaskStatusEnum.CANCEL) {
    return 'status-cancel'
  }

  return ''
}
