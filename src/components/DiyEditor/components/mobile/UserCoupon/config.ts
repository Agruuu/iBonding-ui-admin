import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** User coupon attributes */
export interface UserCouponProperty {
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'UserCoupon',
  name: 'User coupon',
  icon: 'ep:ticket',
  property: {
    style: {
      bgType: 'color',
      bgColor: '',
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<UserCouponProperty>
