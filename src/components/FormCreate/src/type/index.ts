import { Rule } from '@form-create/element-ui' //Left drag button

// Left drag button
export interface MenuItem {
  label: string
  name: string
  icon: string
}

// Left drag button classification
export interface Menu {
  title: string
  name: string
  list: MenuItem[]
}

export interface MenuList extends Array<Menu> {}

// Rules for Dragging Components
export interface DragRule {
  icon: string
  name: string
  label: string
  children?: string
  inside?: true
  drag?: true | String
  dragBtn?: false
  mask?: false

  rule(): Rule

  props(v: any, v1: any): Rule[]
}

// Universal dropdown component Props type
export interface ApiSelectProps {
  name: string // Component Name
  labelField?: string // Option label
  valueField?: string // The value of the option
  url?: string // url Interface
  isDict?: boolean // Is it a dictionary selector
}

// Select component rule configuration type
export interface SelectRuleOption {
  label: string // label name
  name: string // Component Name
  icon: string // Component icon
  props?: any[] // Component rules
}
