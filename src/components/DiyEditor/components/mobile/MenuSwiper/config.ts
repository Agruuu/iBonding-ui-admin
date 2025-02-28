import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'
import { cloneDeep } from 'lodash-es'

/** Menu Navigation Properties */
export interface MenuSwiperProperty {
  // layout： Icon+text | Icon
  layout: 'iconText' | 'icon'
  // Number of rows
  row: number
  // Number of columns
  column: number
  // Navigation menu list
  list: MenuSwiperItemProperty[]
  // Component Style
  style: ComponentStyle
}
/** Menu Navigation Item Properties */
export interface MenuSwiperItemProperty {
  // Icon Link
  iconUrl: string
  // title
  title: string
  // Title color
  titleColor: string
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

export const EMPTY_MENU_SWIPER_ITEM_PROPERTY = {
  title: 'title',
  titleColor: '#333',
  badge: {
    show: false,
    textColor: '#fff',
    bgColor: '#FF6000'
  }
} as MenuSwiperItemProperty

// Define components
export const component = {
  id: 'MenuSwiper',
  name: 'Menu navigation',
  icon: 'bi:grid-3x2-gap',
  property: {
    layout: 'iconText',
    row: 1,
    column: 3,
    list: [cloneDeep(EMPTY_MENU_SWIPER_ITEM_PROPERTY)],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<MenuSwiperProperty>
