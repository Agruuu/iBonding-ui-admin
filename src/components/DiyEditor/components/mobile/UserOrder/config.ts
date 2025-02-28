import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** User order attributes */
export interface UserOrderProperty {
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'UserOrder',
  name: 'User order',
  icon: 'ep:list',
  property: {
    style: {
      bgType: 'color',
      bgColor: '',
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<UserOrderProperty>
