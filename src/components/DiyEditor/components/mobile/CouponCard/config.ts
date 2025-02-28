import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Product card attributes */
export interface CouponCardProperty {
  // Number of columns
  columns: number
  // Background image
  bgImg: string
  // Text color
  textColor: string
  // Button Style
  button: {
    // colour
    color: string
    // background color 
    bgColor: string
  }
  // spacing
  space: number
  // Coupon Number List
  couponIds: number[]
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'CouponCard',
  name: 'Coupon',
  icon: 'ep:ticket',
  property: {
    columns: 1,
    bgImg: '',
    textColor: '#E9B461',
    button: {
      color: '#434343',
      bgColor: ''
    },
    space: 0,
    couponIds: [],
    style: {
      bgType: 'color',
      bgColor: '',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<CouponCardProperty>
