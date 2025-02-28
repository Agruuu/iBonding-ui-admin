import {ComponentStyle, DiyComponent} from '@/components/DiyEditor/util'

/** Points Mall Attributes */
export interface PromotionPointProperty {
  // Layout type：Single column | Three columns
  layoutType: 'oneColBigImg' | 'oneColSmallImg' | 'twoCol'
  // Product field
  fields: {
    // Product Name
    name: PromotionPointFieldProperty
    // Product Introduction
    introduction: PromotionPointFieldProperty
    // commodity price
    price: PromotionPointFieldProperty
    // market value
    marketPrice: PromotionPointFieldProperty
    // Product sales volume
    salesCount: PromotionPointFieldProperty
    // Product inventory
    stock: PromotionPointFieldProperty
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
  // Flash sale activity number
  activityIds: number[]
  // Component Style
  style: ComponentStyle
}

// Product field
export interface PromotionPointFieldProperty {
  // Is it displayed
  show: boolean
  // colour
  color: string
}

// Define components
export const component = {
  id: 'PromotionPoint',
  name: 'Point Mall',
  icon: 'ep:present',
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
      text: 'Redeem Now ',
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
} as DiyComponent<PromotionPointProperty>
