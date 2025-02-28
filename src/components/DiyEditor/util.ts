import { PageConfigProperty } from '@/components/DiyEditor/components/mobile/PageConfig/config'
import { NavigationBarProperty } from '@/components/DiyEditor/components/mobile/NavigationBar/config'
import { TabBarProperty } from '@/components/DiyEditor/components/mobile/TabBar/config'

// Page decoration components
export interface DiyComponent<T> {
  // Used to distinguish different instances of the same component
  uid?: number
  // Unique identifier of component
  id: string
  // Component Name
  name: string
  // Component icon
  icon: string
  /*
   Component location：
   top: Fixed on the top of the phone，for example Top navigation bar
   bottom: Fixed at the bottom of the phone，for example Bottom menu navigation bar
   center: Located in the center of the mobile phone，Each component occupies one line，Arrange in descending order
   empty：with center
   fixed: The position is determined by the components themselves，The pop-up window is located in the center of the phone、The floating button is usually located in the bottom right corner of the phone
  */
  position?: 'top' | 'bottom' | 'center' | '' | 'fixed'
  // Component properties
  property: T
}

// Page decoration component library
export interface DiyComponentLibrary {
  // Component library name
  name: string
  // Expand or not
  extended: boolean
  // Component List
  components: string[]
}

// Component Style
export interface ComponentStyle {
  // Background type
  bgType: 'color' | 'img'
  // background color 
  bgColor: string
  // Background image
  bgImg: string
  // Margin 
  margin: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  // padding 
  padding: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  // Rounded border corners
  borderRadius: number
  borderTopLeftRadius: number
  borderTopRightRadius: number
  borderBottomRightRadius: number
  borderBottomLeftRadius: number
}

// Page configuration
export interface PageConfig {
  // Page Properties
  page: PageConfigProperty
  // Top navigation bar properties
  navigationBar: NavigationBarProperty
  // Bottom navigation menu properties
  tabBar?: TabBarProperty
  // Page Component List
  components: PageComponent[]
}
// Page Components，Keep only componentsID，Component properties
export interface PageComponent extends Pick<DiyComponent<any>, 'id' | 'property'> {}

// Page Component Library
export const PAGE_LIBS = [
  {
    name: 'Basic Components',
    extended: true,
    components: [
      'SearchBar',
      'NoticeBar',
      'MenuSwiper',
      'MenuGrid',
      'MenuList',
      'Popover',
      'FloatingActionButton'
    ]
  },
  {
    name: 'Graphic and Text Components',
    extended: true,
    components: [
      'ImageBar',
      'Carousel',
      'TitleBar',
      'VideoPlayer',
      'Divider',
      'MagicCube',
      'HotZone'
    ]
  },
  { name: 'Product Components', extended: true, components: ['ProductCard', 'ProductList'] },
  {
    name: 'User Components',
    extended: true,
    components: ['UserCard', 'UserOrder', 'UserWallet', 'UserCoupon']
  },
  {
    name: 'Marketing Components',
    extended: true,
    components: [
      'PromotionCombination',
      'PromotionSeckill',
      'PromotionPoint',
      'CouponCard',
      'PromotionArticle'
    ]
  }
] as DiyComponentLibrary[]
