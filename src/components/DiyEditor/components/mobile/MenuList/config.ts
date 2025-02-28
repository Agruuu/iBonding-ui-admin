import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'
import { cloneDeep } from 'lodash-es'

/** List Navigation Properties */
export interface MenuListProperty {
  // Navigation menu list
  list: MenuListItemProperty[]
  // Component Style
  style: ComponentStyle
}

/** List Navigation Item Attributes */
export interface MenuListItemProperty {
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
}

export const EMPTY_MENU_LIST_ITEM_PROPERTY = {
  title: 'Title',
  titleColor: '#333',
  subtitle: 'Subtitle',
  subtitleColor: '#bbb'
}

// Define components
export const component = {
  id: 'MenuList',
  name: 'Menu List',
  icon: 'fa-solid:list',
  property: {
    list: [cloneDeep(EMPTY_MENU_LIST_ITEM_PROPERTY)],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<MenuListProperty>
