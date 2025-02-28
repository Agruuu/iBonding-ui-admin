import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** User asset attributes */
export interface UserWalletProperty {
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'UserWallet',
  name: 'User Wallet',
  icon: 'ep:wallet-filled',
  property: {
    style: {
      bgType: 'color',
      bgColor: '',
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<UserWalletProperty>
