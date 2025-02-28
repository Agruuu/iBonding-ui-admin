import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Product column attributes */
export interface ProductListProperty {
  // Layout type：Double row | Three columns | Horizontal sliding
  layoutType: 'twoCol' | 'threeCol' | 'horizSwiper'
  // Product field
  fields: {
    // Product Name
    name: ProductListFieldProperty
    // commodity price
    price: ProductListFieldProperty
  }
  // Corner marker
  badge: {
    // Is it displayed
    show: boolean
    // Corner label image
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
export interface ProductListFieldProperty {
  // Is it displayed
  show: boolean
  // colour
  color: string
}

// Define components
export const component = {
  id: 'ProductList',
  name: 'Product List',
  icon: 'fluent:text-column-two-24-filled',
  property: {
    layoutType: 'twoCol',
    fields: {
      name: { show: true, color: '#000' },
      price: { show: true, color: '#ff3000' }
    },
    badge: { show: false, imgUrl: '' },
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
} as DiyComponent<ProductListProperty>
