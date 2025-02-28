import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** User card attributes */
export interface UserCardProperty {
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'UserCard',
  name: 'User Card',
  icon: 'mdi:user-card-details',
  property: {
    style: {
      bgType: 'color',
      bgColor: '',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<UserCardProperty>
