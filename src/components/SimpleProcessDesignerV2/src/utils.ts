import { TimeUnitType, ApproveType, APPROVE_TYPE } from './consts'

// Get the default name of the conditional node
export const getDefaultConditionNodeName = (index: number, defaultFlow: boolean | undefined): string => {
  if (defaultFlow) {
    return 'Other Situations'
  }
  return 'Condition ' + (index + 1)
}

// Get the default name of the inclusive branch condition node
export const getDefaultInclusiveConditionNodeName = (index: number, defaultFlow: boolean | undefined): string => {
  if (defaultFlow) {
    return 'Other Situations'
  }
  return 'Material Condition ' + (index + 1)
}

export const convertTimeUnit = (strTimeUnit: string) => {
  if (strTimeUnit === 'M') {
    return TimeUnitType.MINUTE
  }
  if (strTimeUnit === 'H') {
    return TimeUnitType.HOUR
  }
  if (strTimeUnit === 'D') {
    return TimeUnitType.DAY
  }
  return TimeUnitType.HOUR
}

export const getApproveTypeText = (approveType: ApproveType): string => {
  let approveTypeText = ''
  APPROVE_TYPE.forEach((item) => {
    if (item.value === approveType) {
      approveTypeText = item.label
      return
    }
  })
  return approveTypeText
}
