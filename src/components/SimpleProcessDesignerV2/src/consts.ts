// @ts-ignore
import { DictDataVO } from '@/api/system/dict/types'
import { TaskStatusEnum } from '@/api/bpm/task'
/**
 * Node type
 */
export enum NodeType {
  /**
   * End Node
   */
  END_EVENT_NODE = 1,
  /**
   * Initiator Node
   */
  START_USER_NODE = 10,
  /**
   * Approver node
   */
  USER_TASK_NODE = 11,

  /**
   * CC node
   */
  COPY_TASK_NODE = 12,

  /**
   * Delay node
   */
  DELAY_TIMER_NODE = 14,

  /**
   * Trigger node
   */
  TRIGGER_NODE = 15,

  /**
   * Conditional nodes
   */
  CONDITION_NODE = 50,
  /**
   * Conditional branch node (Corresponding exclusive gateway)
   */
  CONDITION_BRANCH_NODE = 51,
  /**
   * Parallel branch node (Corresponding parallel gateway)
   */
  PARALLEL_BRANCH_NODE = 52,

  /**
   * Inclusive branch nodes (Corresponding inclusive gateway)
   */
  INCLUSIVE_BRANCH_NODE = 53,
  /**
   * Routing branch node
   */
  ROUTER_BRANCH_NODE = 54
}

export enum NodeId {
  /**
   * Initiator Node Id
   */
  START_USER_NODE_ID = 'StartUserNode',

  /**
   * Initiator Node Id
   */
  END_EVENT_NODE_ID = 'EndEvent'
}

/**
 *  Node structure definition
 */
export interface SimpleFlowNode {
  id: string
  type: NodeType
  name: string
  showText?: string
  // Child Node
  childNode?: SimpleFlowNode
  // Conditional nodes
  conditionNodes?: SimpleFlowNode[]
  // Approval type
  approveType?: ApproveType
  // Candidate Strategy
  candidateStrategy?: number
  // Candidate Parameters
  candidateParam?: string
  // Multi person approval method
  approveMethod?: ApproveMethodType
  //By proportion
  approveRatio?: number
  // Approval button settings
  buttonsSetting?: any[]
  // Form permissions
  fieldsPermission?: Array<Record<string, any>>
  // Approval task timeout processing
  timeoutHandler?: TimeoutHandler
  // Refusal to handle approval tasks
  rejectHandler?: RejectHandler
  // Processing of blank approvers
  assignEmptyHandler?: AssignEmptyHandler
  // The approver and initiator of the approval node are the same，Corresponding processing type
  assignStartUserHandlerType?: number
  // Create task listener
  taskCreateListener?: ListenerHandler
  // Create task listener
  taskAssignListener?: ListenerHandler
  // Create task listener
  taskCompleteListener?: ListenerHandler
  // Condition setting
  conditionSetting?: ConditionSetting
  // The status of the activity，Used for displaying the status of front-end nodes
  activityStatus?: TaskStatusEnum
  // Delay setting
  delaySetting?: DelaySetting
  // Routing branch
  routerGroups?: RouterSetting[]
  defaultFlowId?: string
  // autograph
  signEnable?: boolean
  // Approval Opinion
  reasonRequire?: boolean
  // Trigger settings
  triggerSetting?: TriggerSetting
}
// Candidate strategy enumeration （ Used for approval nodes。CC Node )
export enum CandidateStrategy {
  /**
   * Designated role
   */
  ROLE = 10,
  /**
   * Department members
   */
  DEPT_MEMBER = 20,
  /**
   * Department head
   */
  DEPT_LEADER = 21,
  /**
   * Leaders of consecutive multi-level departments
   */
  MULTI_LEVEL_DEPT_LEADER = 23,
  /**
   * Designated position
   */
  POST = 22,
  /**
   * Designated user
   */
  USER = 30,
  /**
   * Initiator's Choice
   */
  START_USER_SELECT = 35,
  /**
   * The initiator themselves
   */
  START_USER = 36,
  /**
   * Department Head of Initiator
   */
  START_USER_DEPT_LEADER = 37,
  /**
   * The initiator is the person in charge of multiple levels of departments
   */
  START_USER_MULTI_LEVEL_DEPT_LEADER = 38,
  /**
   * Specify user group
   */
  USER_GROUP = 40,
  /**
   * User fields within the form
   */
  FORM_USER = 50,
  /**
   * Internal door manager of the form
   */
  FORM_DEPT_LEADER = 51,
  /**
   * Process expression
   */
  EXPRESSION = 60
}

// Enumeration of Multiple Approval Method Types （ Used for approval nodes ）
export enum ApproveMethodType {
  /**
   * Randomly select one person for approval
   */
  RANDOM_SELECT_ONE_APPROVE = 1,

  /**
   * Multiple people will sign(According to the passing ratio)
   */
  APPROVE_BY_RATIO = 2,

  /**
   * Multiple people or signatures(By using only one person，Refuse only requires one person)
   */
  ANY_APPROVE = 3,
  /**
   * Multiple people approve in sequence
   */
  SEQUENTIAL_APPROVE = 4
}

/**
 * Approval rejection structure definition
 */
export type RejectHandler = {
  // Approval rejection type
  type: RejectHandlerType
  // Return Node Id
  returnNodeId?: string
}

/**
 * Approval timeout structure definition
 */
export type TimeoutHandler = {
  // Do you want to enable timeout handling
  enable: boolean
  // Action executed after timeout
  type?: number
  // Timeout setting
  timeDuration?: string
  // The execution action is an automatic reminder, Maximum number of reminders
  maxRemindCount?: number
}

/**
 * Structure definition with blank approver
 */
export type AssignEmptyHandler = {
  // Processing type with blank approver
  type: AssignEmptyHandlerType
  // Specify the user's numbered array
  userIds?: number[]
}

/**
 * Definition of the structure of the listener
 */
export type ListenerHandler = {
  enable: boolean
  path?: string
  header?: HttpRequestParam[]
  body?: HttpRequestParam[]
}
export type HttpRequestParam = {
  key: string
  type: number
  value: string
}
export enum BpmHttpRequestParamTypeEnum {
  /**
   * Fixed value
   */
  FIXED_VALUE = 1,
  /**
   * form 
   */
  FROM_FORM = 2
}
export const BPM_HTTP_REQUEST_PARAM_TYPES = [
  {
    value: 1,
    label: 'Fixed value'
  },
  {
    value: 2,
    label: 'form '
  }
]

// List of approval rejection types
export enum RejectHandlerType {
  /**
   * End process
   */
  FINISH_PROCESS = 1,
  /**
   * Return to the designated node
   */
  RETURN_USER_TASK = 2
}
// User task timeout processing type enumeration
export enum TimeoutHandlerType {
  /**
   * Automatic reminder
   */
  REMINDER = 1,
  /**
   * Automatic agreement
   */
  APPROVE = 2,
  /**
   * Automatic Refusal
   */
  REJECT = 3
}
// The approver of the user task is empty time，Processing type enumeration
export enum AssignEmptyHandlerType {
  /**
   * Automatic Pass
   */
  APPROVE = 1,
  /**
   * Automatic Refusal
   */
  REJECT = 2,
  /**
   * Designated personnel approval
   */
  ASSIGN_USER,
  /**
   * Hand it over to the process administrator
   */
  ASSIGN_ADMIN = 4
}
// The approver and initiator of the user task are the same，Processing type enumeration
export enum AssignStartUserHandlerType {
  /**
   * Approved by the initiator themselves
   */
  START_USER_AUDIT = 1,
  /**
   * Automatically skip【Reference Feishu】：1）If there are other approvers at the current node，Then hand it over to other approvers for approval；2）If there are no other approvers at the current node，Then the node automatically passes through
   */
  SKIP = 2,
  /**
   * Hand it over to the department head for approval
   */
  ASSIGN_DEPT_LEADER = 3
}

// Approval type of user task。 【Reference Feishu】
export enum ApproveType {
  /**
   * Manual approval
   */
  USER = 1,
  /**
   * Automatic Pass
   */
  AUTO_APPROVE = 2,
  /**
   * Automatic Refusal
   */
  AUTO_REJECT = 3
}

// Enumeration of time units
export enum TimeUnitType {
  /**
   * minute
   */
  MINUTE = 1,
  /**
   * hour
   */
  HOUR = 2,
  /**
   * day
   */
  DAY = 3
}

/**
 * Definition of conditional node setting structure，Used for conditional nodes
 */
export type ConditionSetting =  {
  // Condition type
  conditionType?: ConditionType,
  // Conditional expression
  conditionExpression?: string,
  // Condition group
  conditionGroups?: ConditionGroup,
  // Is it a default condition
  defaultFlow?: boolean
}

// Type of conditional configuration （ Used for configuring conditional nodes ）
export enum ConditionType {
  /**
   * Conditional expression
   */
  EXPRESSION = 1,

  /**
   * Conditional rules
   */
  RULE = 2
}
/**
 * Enumeration of form permissions
 */
export enum FieldPermissionType {
  /**
   * read-only
   */
  READ = '1',
  /**
   * edit
   */
  WRITE = '2',
  /**
   * hide
   */
  NONE = '3'
}
/**
 * Definition of operation button permission structure
 */
export type ButtonSetting = {
  id: OperationButtonType
  displayName: string
  enable: boolean
}

// List of operation button types (Used for approval nodes)
export enum OperationButtonType {
  /**
   * adopt
   */
  APPROVE = 1,
  /**
   * refuse
   */
  REJECT = 2,
  /**
   * Transfer Office
   */
  TRANSFER = 3,
  /**
   * delegate
   */
  DELEGATE = 4,
  /**
   * Add signature
   */
  ADD_SIGN = 5,
  /**
   * return
   */
  RETURN = 6,
  /**
   * CC (Copy)
   */
  COPY = 7
}

/**
 * Definition of Conditional Rule Structure
 */
export type ConditionRule = {
  opCode: string
  leftSide: string
  rightSide: string
}

/**
 * Definition of conditional group structure
 */
export type ConditionGroup = {
  // Is the logical relationship of the condition group and
  and: boolean
  // Conditional array
  conditions: Condition[]
}
/**
 * Default values for condition groups
 */
export const DEFAULT_CONDITION_GROUP_VALUE = {
  and: true,
  conditions: [
    {
      and: true,
      rules: [
        {
          opCode: '==',
          leftSide: '',
          rightSide: ''
        }
      ]
    }
  ]
}

/**
 * Definition of conditional structure
 */
export type Condition = {
  // Is the logical relationship of conditional rules and
  and: boolean
  rules: ConditionRule[]
}

export const NODE_DEFAULT_TEXT = new Map<number, string>()
NODE_DEFAULT_TEXT.set(NodeType.USER_TASK_NODE, 'Please configure approver')
NODE_DEFAULT_TEXT.set(NodeType.COPY_TASK_NODE, 'Please configure the CC recipient')
NODE_DEFAULT_TEXT.set(NodeType.CONDITION_NODE, 'Please set conditions')
NODE_DEFAULT_TEXT.set(NodeType.START_USER_NODE, 'Please set the initiator')
NODE_DEFAULT_TEXT.set(NodeType.DELAY_TIMER_NODE, 'Please set a delay device')
NODE_DEFAULT_TEXT.set(NodeType.ROUTER_BRANCH_NODE, 'Please set up routing nodes')
NODE_DEFAULT_TEXT.set(NodeType.TRIGGER_NODE, 'Please set a trigger')

export const NODE_DEFAULT_NAME = new Map<number, string>()
NODE_DEFAULT_NAME.set(NodeType.USER_TASK_NODE, 'Approver')
NODE_DEFAULT_NAME.set(NodeType.COPY_TASK_NODE, 'CC recipient')
NODE_DEFAULT_NAME.set(NodeType.CONDITION_NODE, 'Condition')
NODE_DEFAULT_NAME.set(NodeType.START_USER_NODE, 'Initiator')
NODE_DEFAULT_NAME.set(NodeType.DELAY_TIMER_NODE, 'Delay generator')
NODE_DEFAULT_NAME.set(NodeType.ROUTER_BRANCH_NODE, 'Routing branch')
NODE_DEFAULT_NAME.set(NodeType.TRIGGER_NODE, 'Trigger')

// Candidate Strategy。Temporarily not taking from the dictionary。 Possible adjustments in the future。Control display order
export const CANDIDATE_STRATEGY: DictDataVO[] = [
  { label: 'Designated members', value: CandidateStrategy.USER },
  { label: 'Designated role', value: CandidateStrategy.ROLE },
  { label: 'Department members', value: CandidateStrategy.DEPT_MEMBER },
  { label: 'Department Head', value: CandidateStrategy.DEPT_LEADER },
  { label: 'Continuous multi-level department heads', value: CandidateStrategy.MULTI_LEVEL_DEPT_LEADER },
  { label: 'Initiator's Choice', value: CandidateStrategy.START_USER_SELECT },
  { label: 'The initiator himself/herself', value: CandidateStrategy.START_USER },
  { label: 'Department Head of Initiator', value: CandidateStrategy.START_USER_DEPT_LEADER },
  { label: 'Initiator Continuous Department Head', value: CandidateStrategy.START_USER_MULTI_LEVEL_DEPT_LEADER },
  { label: 'User group', value: CandidateStrategy.USER_GROUP },
  { label: 'User fields within the form', value: CandidateStrategy.FORM_USER },
  { label: 'Internal door manager of the form', value: CandidateStrategy.FORM_DEPT_LEADER },
  { label: 'Process expression', value: CandidateStrategy.EXPRESSION }
]
// Approval Node Approval type
export const APPROVE_TYPE: DictDataVO[] = [
  { label: 'Manual approval', value: ApproveType.USER },
  { label: 'Automatic Pass', value: ApproveType.AUTO_APPROVE },
  { label: 'Automatic Refusal', value: ApproveType.AUTO_REJECT }
]

export const APPROVE_METHODS: DictDataVO[] = [
  { label: 'Approve in order', value: ApproveMethodType.SEQUENTIAL_APPROVE },
  { label: 'jointly sign（Can be approved simultaneously，at least % People must be approved）', value: ApproveMethodType.APPROVE_BY_RATIO },
  { label: 'Or sign(Can be approved simultaneously，Just one person can pass)', value: ApproveMethodType.ANY_APPROVE },
  { label: 'Randomly select one person for approval', value: ApproveMethodType.RANDOM_SELECT_ONE_APPROVE }
]

export const CONDITION_CONFIG_TYPES: DictDataVO[] = [
  { label: 'Conditional rules', value: ConditionType.RULE },
  { label: 'Conditional expression', value: ConditionType.EXPRESSION }
]

// Type of time unit
export const TIME_UNIT_TYPES: DictDataVO[] = [
  { label: 'minute', value: TimeUnitType.MINUTE },
  { label: 'hour', value: TimeUnitType.HOUR },
  { label: 'day', value: TimeUnitType.DAY }
]
// Timeout processing execution action type
export const TIMEOUT_HANDLER_TYPES: DictDataVO[] = [
  { label: 'Automatic reminder', value: 1 },
  { label: 'Automatic agreement', value: 2 },
  { label: 'Automatic Refusal', value: 3 }
]
export const REJECT_HANDLER_TYPES: DictDataVO[] = [
  { label: 'Termination process', value: RejectHandlerType.FINISH_PROCESS },
  { label: 'Return to the designated node', value: RejectHandlerType.RETURN_USER_TASK }
  // { label: 'End task', value: RejectHandlerType.FINISH_TASK }
]
export const ASSIGN_EMPTY_HANDLER_TYPES: DictDataVO[] = [
  { label: 'Automatic Pass', value: 1 },
  { label: 'Automatic Refusal', value: 2 },
  { label: 'Designated member approval', value: 3 },
  { label: 'Hand it over to the process administrator', value: 4 }
]
export const ASSIGN_START_USER_HANDLER_TYPES: DictDataVO[] = [
  { label: 'Approved by the initiator themselves', value: 1 },
  { label: 'Automatically skip', value: 2 },
  { label: 'Hand it over to the department head for approval', value: 3 }
]

// Comparison operator
export const COMPARISON_OPERATORS: DictDataVO = [
  {
    value: '==',
    label: 'be equal to'
  },
  {
    value: '!=',
    label: 'Not equal to'
  },
  {
    value: '>',
    label: 'greater than'
  },
  {
    value: '>=',
    label: 'Greater than or equal to'
  },
  {
    value: '<',
    label: 'less than'
  },
  {
    value: '<=',
    label: 'Less than or equal to'
  }
]
// Approval operation button name
export const OPERATION_BUTTON_NAME = new Map<number, string>()
OPERATION_BUTTON_NAME.set(OperationButtonType.APPROVE, 'adopt')
OPERATION_BUTTON_NAME.set(OperationButtonType.REJECT, 'refuse')
OPERATION_BUTTON_NAME.set(OperationButtonType.TRANSFER, 'transfer Office')
OPERATION_BUTTON_NAME.set(OperationButtonType.DELEGATE, 'delegate')
OPERATION_BUTTON_NAME.set(OperationButtonType.ADD_SIGN, 'add signature')
OPERATION_BUTTON_NAME.set(OperationButtonType.RETURN, 'return')
OPERATION_BUTTON_NAME.set(OperationButtonType.COPY, 'CC (Copy)')

// Default button permission settings
export const DEFAULT_BUTTON_SETTING: ButtonSetting[] = [
  { id: OperationButtonType.APPROVE, displayName: 'adopt', enable: true },
  { id: OperationButtonType.REJECT, displayName: 'refuse', enable: true },
  { id: OperationButtonType.TRANSFER, displayName: 'transfer Office', enable: true },
  { id: OperationButtonType.DELEGATE, displayName: 'delegate', enable: true },
  { id: OperationButtonType.ADD_SIGN, displayName: 'add signature', enable: true },
  { id: OperationButtonType.RETURN, displayName: 'return', enable: true }
]

// Initiator's button permissions。Temporarily dead，Cannot edit
export const START_USER_BUTTON_SETTING: ButtonSetting[] = [
  { id: OperationButtonType.APPROVE, displayName: 'submit', enable: true },
  { id: OperationButtonType.REJECT, displayName: 'refuse', enable: false },
  { id: OperationButtonType.TRANSFER, displayName: 'transfer office', enable: false },
  { id: OperationButtonType.DELEGATE, displayName: 'delegate', enable: false },
  { id: OperationButtonType.ADD_SIGN, displayName: 'add signature', enable: false },
  { id: OperationButtonType.RETURN, displayName: 'return', enable: false }
]

export const MULTI_LEVEL_DEPT: DictDataVO = [
  { label: 'The 1 Level Department', value: 1 },
  { label: 'The 2 Level Department', value: 2 },
  { label: 'The 3 Level Department', value: 3 },
  { label: 'The 4 Level Department', value: 4 },
  { label: 'The 5 Level Department', value: 5 },
  { label: 'The 6 Level Department', value: 6 },
  { label: 'The 7 Level Department', value: 7 },
  { label: 'The 8 Level Department', value: 8 },
  { label: 'The 9 Level Department', value: 9 },
  { label: 'The 10 Level Department', value: 10 },
  { label: 'The 11 Level Department', value: 11 },
  { label: 'The 12 Level Department', value: 12 },
  { label: 'The 13 Level Department', value: 13 },
  { label: 'The 14 Level Department', value: 14 },
  { label: 'The 15 Level Department', value: 15 }
]

/**
 * Variable enumeration of process instances
 */
export enum ProcessVariableEnum {
  /**
   * Initiate user ID
   */
  START_USER_ID = 'PROCESS_START_USER_ID',
  /**
   * Initiation time
   */
  START_TIME = 'PROCESS_START_TIME',
  /**
   * Process Definition Name
   */
  PROCESS_DEFINITION_NAME = 'PROCESS_DEFINITION_NAME'
}

/**
 * Delay setting
 */
export type DelaySetting = {
  // Delay type
  delayType: number
  // Delay time expression
  delayTime: string
}
/**
 * Delay type
 */
export enum DelayTypeEnum {
  /**
   * Fixed duration
   */
  FIXED_TIME_DURATION = 1,
  /**
   * Fixed date and time
   */
  FIXED_DATE_TIME = 2
}
export const DELAY_TYPE = [
  { label: 'Fixed duration', value: DelayTypeEnum.FIXED_TIME_DURATION },
  { label: 'Fixed date', value: DelayTypeEnum.FIXED_DATE_TIME }
]

/**
 * Definition of Routing Branch Structure
 */
export type RouterSetting = {
  nodeId: string
  conditionType: ConditionType
  conditionExpression: string
  conditionGroups: ConditionGroup
}

// ==================== Trigger related definitions ==================== 
/**
 * Trigger Node Structure Definition
 */
export type TriggerSetting = {
  type: TriggerTypeEnum
  httpRequestSetting?: HttpRequestTriggerSetting
  normalFormSetting?: NormalFormTriggerSetting
}

/**
 * Trigger type enumeration
 */
export enum TriggerTypeEnum {
  /**
   * send out HTTP request trigger 
   */
  HTTP_REQUEST = 1,
  /**
   * Update the process form trigger.
   */
  UPDATE_NORMAL_FORM = 2 // TODO @Agruuu：FORM_UPDATE？
}

/**
 * HTTP Request trigger structure definition
 */
export type HttpRequestTriggerSetting = {
  // request URL
  url: string
  // Request header parameter settings.
  header?: HttpRequestParam[]
  // Request body parameter settings.
  body?: HttpRequestParam[]
  // Request response settings.
  response?: Record<string, string>[]
}

/**
 * Process form trigger configuration structure definition.
 */
export type NormalFormTriggerSetting = {
  // Update the form fields.
  updateFormFields?: Record<string, any>
}

export const TRIGGER_TYPES: DictDataVO[] = [
  { label: 'HTTP request', value: TriggerTypeEnum.HTTP_REQUEST },
  { label: 'update the form data.', value: TriggerTypeEnum.UPDATE_NORMAL_FORM }
]
