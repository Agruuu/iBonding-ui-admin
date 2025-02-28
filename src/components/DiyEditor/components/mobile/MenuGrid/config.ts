import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'
import { cloneDeep } from 'lodash-es'

/** Grid Navigation Properties */
export interface MenuGridProperty {
  // Number of columns
  column: number
  // Navigation menu list
  list: MenuGridItemProperty[]
  // Component Style
  style: ComponentStyle
}

/** Palace grid navigation project attributes */
export interface MenuGridItemProperty {
  // Icon Link
  iconUrl: string
  // title
  title: string
  // Title color
  titleColor: string
  // Subtitle
  subtitle: string
  // Subtitle Color
  subtitleColor: string
  // link
  url: string
  // Corner marker
  badge: {
    // Is it displayed
    show: boolean
    // Corner marker text
    text: string
    // Color of corner marker text
    textColor: string
    // Background color of corner marker
    bgColor: string
  }
}

export const EMPTY_MENU_GRID_ITEM_PROPERTY = {
  title: 'Title',
  titleColor: '#333',
  subtitle: 'Subtitle',
  subtitleColor: '#bbb',
  badge: {
    show: false,
    textColor: '#fff',
    bgColor: '#FF6000'
  }
} as MenuGridItemProperty

// Define components
export const component = {
  id: 'MenuGrid',
  name: 'Menu Grid',
  icon: 'bi:grid-3x3-gap',
  property: {
    column: 3,
    list: [cloneDeep(EMPTY_MENU_GRID_ITEM_PROPERTY)],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8,
      marginLeft: 8,
      marginRight: 8,
      padding: 8,
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      borderRadius: 8,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8
    } as ComponentStyle
  }
} as DiyComponent<MenuGridProperty>
