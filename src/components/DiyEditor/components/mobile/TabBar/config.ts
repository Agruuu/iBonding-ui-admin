import { DiyComponent } from '@/components/DiyEditor/util'

/** Bottom navigation menu properties */
export interface TabBarProperty {
  // Option List
  items: TabBarItemProperty[]
  // theme
  theme: string
  // style
  style: TabBarStyle
}

// Option Properties
export interface TabBarItemProperty {
  // Label Text
  text: string
  // link
  url: string
  // Default icon link
  iconUrl: string
  // Selected icon link
  activeIconUrl: string
}

// style
export interface TabBarStyle {
  // Background type
  bgType: 'color' | 'img'
  // background color 
  bgColor: string
  // pictures linking
  bgImg: string
  // Default color
  color: string
  // Selected color
  activeColor: string
}

// Define components
export const component = {
  id: 'TabBar',
  name: 'Bottom Navigation',
  icon: 'fluent:table-bottom-row-16-filled',
  property: {
    theme: 'red',
    style: {
      bgType: 'color',
      bgColor: '#fff',
      color: '#282828',
      activeColor: '#fc4141'
    },
    items: [
      {
        text: 'Home Page',
        url: '/pages/index/index',
        iconUrl: 'https://i.ibb.co/chXXwJ58/1-001.png',
        activeIconUrl: 'https://i.ibb.co/BVYJXtMG/1-002.png'
      },
      {
        text: 'Category',
        url: '/pages/index/category?id=3',
        iconUrl: 'https://i.ibb.co/mVk13ZNK/2-001.png',
        activeIconUrl: 'https://i.ibb.co/HLqg0Lmx/2-002.png'
      },
      {
        text: 'Shopping Cart',
        url: '/pages/index/cart',
        iconUrl: 'https://i.ibb.co/qYFhZbmG/3-001.png',
        activeIconUrl: 'https://i.ibb.co/gLRHp37d/3-002.png'
      },
      {
        text: 'My',
        url: '/pages/index/user',
        iconUrl: 'https://i.ibb.co/Q7BTJ9Bn/4-001.png',
        activeIconUrl: 'https://i.ibb.co/S4kF1b2w/4-002.png'
      }
    ]
  }
} as DiyComponent<TabBarProperty>

export const THEME_LIST = [
  { id: 'red', name: 'Red', icon: 'icon-park-twotone:theme', color: '#d10019' },
  { id: 'orange', name: 'Orange ', icon: 'icon-park-twotone:theme', color: '#f37b1d' },
  { id: 'gold', name: 'Gold', icon: 'icon-park-twotone:theme', color: '#fbbd08' },
  { id: 'green', name: 'Green', icon: 'icon-park-twotone:theme', color: '#8dc63f' },
  { id: 'cyan', name: 'Cyan', icon: 'icon-park-twotone:theme', color: '#1cbbb4' },
  { id: 'blue', name: 'Blue', icon: 'icon-park-twotone:theme', color: '#0081ff' },
  { id: 'purple', name: 'Purple', icon: 'icon-park-twotone:theme', color: '#6739b6' },
  { id: 'brightRed', name: 'BrightRed', icon: 'icon-park-twotone:theme', color: '#e54d42' },
  { id: 'forestGreen', name: 'ForestGreen', icon: 'icon-park-twotone:theme', color: '#39b54a' },
  { id: 'mauve', name: 'Mauve', icon: 'icon-park-twotone:theme', color: '#9c26b0' },
  { id: 'pink', name: 'Pink', icon: 'icon-park-twotone:theme', color: '#e03997' },
  { id: 'brown', name: 'Brown', icon: 'icon-park-twotone:theme', color: '#a5673f' },
  { id: 'grey', name: 'Grey', icon: 'icon-park-twotone:theme', color: '#8799a3' },
  { id: 'gray', name: 'Gray', icon: 'icon-park-twotone:theme', color: '#aaaaaa' },
  { id: 'black', name: 'Black', icon: 'icon-park-twotone:theme', color: '#333333' }
]
