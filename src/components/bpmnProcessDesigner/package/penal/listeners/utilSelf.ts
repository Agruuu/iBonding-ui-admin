// Initialize form data
export function initListenerForm(listener) {
  let self = {
    ...listener
  }
  if (listener.script) {
    self = {
      ...listener,
      ...listener.script,
      scriptType: listener.script.resource ? 'externalScript' : 'inlineScript'
    }
  }
  if (listener.event === 'timeout' && listener.eventDefinitions) {
    if (listener.eventDefinitions.length) {
      let k = ''
      for (const key in listener.eventDefinitions[0]) {
        console.log(listener.eventDefinitions, key)
        if (key.indexOf('time') !== -1) {
          k = key
          self.eventDefinitionType = key.replace('time', '').toLowerCase()
        }
      }
      console.log(k)
      self.eventTimeDefinitions = listener.eventDefinitions[0][k].body
    }
  }
  return self
}

export function initListenerType(listener) {
  let listenerType
  if (listener.class) listenerType = 'classListener'
  if (listener.expression) listenerType = 'expressionListener'
  if (listener.delegateExpression) listenerType = 'delegateExpressionListener'
  if (listener.script) listenerType = 'scriptListener'
  return {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType: listenerType
  }
}

/** Convert the ProcessListenerDO into a Form object that is the same as the initListenerForm. */
export function initListenerForm2(processListener) {
  if (processListener.valueType === 'class') {
    return {
      listenerType: 'classListener',
      class: processListener.value,
      event: processListener.event,
      fields: []
    }
  } else if (processListener.valueType === 'expression') {
    return {
      listenerType: 'expressionListener',
      expression: processListener.value,
      event: processListener.event,
      fields: []
    }
  } else if (processListener.valueType === 'delegateExpression') {
    return {
      listenerType: 'delegateExpressionListener',
      delegateExpression: processListener.value,
      event: processListener.event,
      fields: []
    }
  }
  throw new Error('Unknown Listener Type')
}

export const listenerType = {
  classListener: 'Java Class',
  expressionListener: 'Expression',
  delegateExpressionListener: 'Proxy Expression',
  scriptListener: 'Script'
}

export const eventType = {
  create: 'Create',
  assignment: 'Assign',
  complete: 'Complete',
  delete: 'Delete',
  update: 'Update',
  timeout: 'Overtime'
}

export const fieldType = {
  string: 'String',
  expression: 'Expression'
}
