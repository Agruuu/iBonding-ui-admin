import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Search box properties */
export interface SearchProperty {
  height: number // Search bar height
  showScan: boolean // Display Scan
  borderRadius: number // Frame style
  placeholder: string // Placeholder text
  placeholderPosition: PlaceholderPosition // Position of placeholder text
  backgroundColor: string // Frame color
  textColor: string // Font color
  hotKeywords: string[] // Hot words
  style: ComponentStyle
}

// Text position
export type PlaceholderPosition = 'left' | 'center'

// Define components
export const component = {
  id: 'SearchBar',
  name: 'Search Bar',
  icon: 'ep:search',
  property: {
    height: 28,
    showScan: false,
    borderRadius: 0,
    placeholder: 'Search Products',
    placeholderPosition: 'left',
    backgroundColor: 'rgb(238, 238, 238)',
    textColor: 'rgb(150, 151, 153)',
    hotKeywords: [],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8,
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8
    } as ComponentStyle
  }
} as DiyComponent<SearchProperty>
