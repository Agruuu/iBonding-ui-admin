import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Hot Zone Attributes */
export interface HotZoneProperty {
  // Image address
  imgUrl: string
  // Navigation menu list
  list: HotZoneItemProperty[]
  // Component Style
  style: ComponentStyle
}

/** Hot Zone Project Attributes */
export interface HotZoneItemProperty {
  // Name of the link
  name: string
  // link
  url: string
  // wide
  width: number
  // high
  height: number
  // upper
  top: number
  // Left
  left: number
}

// Define components
export const component = {
  id: 'HotZone',
  name: 'Hot Zone',
  icon: 'tabler:hand-click',
  property: {
    imgUrl: '',
    list: [] as HotZoneItemProperty[],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<HotZoneProperty>
