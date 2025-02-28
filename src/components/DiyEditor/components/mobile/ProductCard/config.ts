import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Product card attributes */
export interface ProductCardProperty {
  // Layout type：Single column large image | Single column diagram | Double row
  layoutType: 'oneColBigImg' | 'oneColSmallImg' | 'twoCol'
  // Product field
  fields: {
    // Product Name
    name: ProductCardFieldProperty
    // Product Introduction
    introduction: ProductCardFieldProperty
    // commodity price
    price: ProductCardFieldProperty
    // Market price of goods
    marketPrice: ProductCardFieldProperty
    // Product sales volume
    salesCount: ProductCardFieldProperty
    // Product inventory
    stock: ProductCardFieldProperty
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
  // Product Number List
  spuIds: number[]
  // Component Style
  style: ComponentStyle
}
// Product field
export interface ProductCardFieldProperty {
  // Is it displayed
  show: boolean
  // colour
  color: string
}

// Define components
export const component = {
  id: 'ProductCard',
  name: 'Product Card',
  icon: 'fluent:text-column-two-left-24-filled',
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
      text: 'Buy Now',
      // todo: @Agruuu According to the theme color configuration
      bgBeginColor: '#FF6000',
      bgEndColor: '#FE832A',
      imgUrl: ''
    },
    borderRadiusTop: 8,
    borderRadiusBottom: 8,
    space: 8,
    spuIds: [],
    style: {
      bgType: 'color',
      bgColor: '',
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<ProductCardProperty>
