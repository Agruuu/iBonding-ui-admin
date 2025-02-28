import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Advertising Magic Cube Attributes */
export interface MagicCubeProperty {
  // Top rounded corner
  borderRadiusTop: number
  // Bottom rounded corner
  borderRadiusBottom: number
  // interval
  space: number
  // Navigation menu list
  list: MagicCubeItemProperty[]
  // Component Style
  style: ComponentStyle
}

/** Advertising Magic Cube Project Attributes */
export interface MagicCubeItemProperty {
  // Icon Link
  imgUrl: string
  // link
  url: string
  // wide
  width: number
  // high
  height: number
  // upper
  top: number
  // Left
  left: number
}

// Define components
export const component = {
  id: 'MagicCube',
  name: 'Magic Cube',
  icon: 'bi:columns',
  property: {
    borderRadiusTop: 0,
    borderRadiusBottom: 0,
    space: 0,
    list: [],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<MagicCubeProperty>
