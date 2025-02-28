import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Group attributes */
export interface PromotionCombinationProperty {
  // Layout type：Single column | Three columns
  layoutType: 'oneColBigImg' | 'oneColSmallImg' | 'twoCol'
  // Product field
  fields: {
    // Product Name
    name: PromotionCombinationFieldProperty
    // Product Introduction
    introduction: PromotionCombinationFieldProperty
    // commodity price
    price: PromotionCombinationFieldProperty
    // market value
    marketPrice: PromotionCombinationFieldProperty
    // Product sales volume
    salesCount: PromotionCombinationFieldProperty
    // Product inventory
    stock: PromotionCombinationFieldProperty
  }
  // Corner marker
  badge: {
    // Is it displayed
    show: boolean
    // Corner label image
    imgUrl: string
  }
  // Button
  btnBuy: {
    // type：text | picture
    type: 'text' | 'img'
    // written words
    text: string
    // text button：Background gradient starting color
    bgBeginColor: string
    // text button：Background gradient end color
    bgEndColor: string
    // Image button：Image address
    imgUrl: string
  }
  // Top rounded corner
  borderRadiusTop: number
  // Bottom rounded corner
  borderRadiusBottom: number
  // spacing
  space: number
  // Group activity number
  activityIds: number[]
  // Component Style
  style: ComponentStyle
}

// Product field
export interface PromotionCombinationFieldProperty {
  // Is it displayed
  show: boolean
  // colour
  color: string
}

// Define components
export const component = {
  id: 'PromotionCombination',
  name: 'Promotion Combination',
  icon: 'mdi:account-group',
  property: {
    layoutType: 'oneColBigImg',
    fields: {
      name: { show: true, color: '#000' },
      introduction: { show: true, color: '#999' },
      price: { show: true, color: '#ff3000' },
      marketPrice: { show: true, color: '#c4c4c4' },
      salesCount: { show: true, color: '#c4c4c4' },
      stock: { show: false, color: '#c4c4c4' }
    },
    badge: { show: false, imgUrl: '' },
    btnBuy: {
      type: 'text',
      text: ' Go for group-buying',
      bgBeginColor: '#FF6000',
      bgEndColor: '#FE832A',
      imgUrl: ''
    },
    borderRadiusTop: 8,
    borderRadiusBottom: 8,
    space: 8,
    style: {
      bgType: 'color',
      bgColor: '',
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<PromotionCombinationProperty>
