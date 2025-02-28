import { DiyComponent } from '@/components/DiyEditor/util'

/** Partition line attribute */
export interface DividerProperty {
  // height
  height: number
  // line width
  lineWidth: number
  // Margin type
  paddingType: 'none' | 'horizontal'
  // colour
  lineColor: string
  // type
  borderType: 'solid' | 'dashed' | 'dotted' | 'none'
}

// Define components
export const component = {
  id: 'Divider',
  name: 'Divider',
  icon: 'tdesign:component-divider-vertical',
  property: {
    height: 30,
    lineWidth: 1,
    paddingType: 'none',
    lineColor: '#dcdfe6',
    borderType: 'solid'
  }
} as DiyComponent<DividerProperty>
