import { toRaw } from 'vue'
const bpmnInstances = () => (window as any)?.bpmnInstances
// Create listener instance
export function createListenerObject(options, isTask, prefix) {
  debugger
  const listenerObj = Object.create(null)
  listenerObj.event = options.event
  isTask && (listenerObj.id = options.id) // Unique to task listeners id field
  switch (options.listenerType) {
    case 'scriptListener':
      listenerObj.script = createScriptObject(options, prefix)
      break
    case 'expressionListener':
      listenerObj.expression = options.expression
      break
    case 'delegateExpressionListener':
      listenerObj.delegateExpression = options.delegateExpression
      break
    default:
      listenerObj.class = options.class
  }
  // Inject fields
  if (options.fields) {
    listenerObj.fields = options.fields.map((field) => {
      return createFieldObject(field, prefix)
    })
  }
  // The task listener timer set up
  if (isTask && options.event === 'timeout' && !!options.eventDefinitionType) {
    const timeDefinition = bpmnInstances().moddle.create('bpmn:FormalExpression', {
      body: options.eventTimeDefinitions
    })
    const TimerEventDefinition = bpmnInstances().moddle.create('bpmn:TimerEventDefinition', {
      id: `TimerEventDefinition_${uuid(8)}`,
      [`time${options.eventDefinitionType.replace(/^\S/, (s) => s.toUpperCase())}`]: timeDefinition
    })
    listenerObj.eventDefinitions = [TimerEventDefinition]
  }
  return bpmnInstances().moddle.create(
    `${prefix}:${isTask ? 'TaskListener' : 'ExecutionListener'}`,
    listenerObj
  )
}

// establish The injection field of the listener example
export function createFieldObject(option, prefix) {
  const { name, fieldType, string, expression } = option
  const fieldConfig = fieldType === 'string' ? { name, string } : { name, expression }
  return bpmnInstances().moddle.create(`${prefix}:Field`, fieldConfig)
}

// Create script instance
export function createScriptObject(options, prefix) {
  const { scriptType, scriptFormat, value, resource } = options
  const scriptConfig =
    scriptType === 'inlineScript' ? { scriptFormat, value } : { scriptFormat, resource }
  return bpmnInstances().moddle.create(`${prefix}:Script`, scriptConfig)
}

// Update element extension properties
export function updateElementExtensions(element, extensionList) {
  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: extensionList
  })
  bpmnInstances().modeling.updateProperties(toRaw(element), {
    extensionElements: extensions
  })
}

// Create a id
export function uuid(length = 8, chars?) {
  let result = ''
  const charsString = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)]
  }
  return result
}
