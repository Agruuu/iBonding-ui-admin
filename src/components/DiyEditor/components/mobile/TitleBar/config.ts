import {ComponentStyle, DiyComponent} from '@/components/DiyEditor/util'

/** Title Bar Attributes */
export interface TitleBarProperty {
  // deviation
  marginLeft: number
  // Display location
  textAlign: 'left' | 'center'
  // Main Title
  title: string
  // Subtitle
  description: string
  // Title size
  titleSize: number
  // Describe size
  descriptionSize: number
  // Title Thickness
  titleWeight: number
  // Describe thickness
  descriptionWeight: number
  // Title color
  titleColor: string
  // Describe the color
  descriptionColor: string
  // View more
  more: {
    // Do you want to display 'View More'
    show: false
    // Style selection
    type: 'text' | 'icon' | 'all'
    // Custom Text
    text: string
    // link
    url: string
  }
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'TitleBar',
  name: 'Title bar',
  icon: 'material-symbols:line-start',
  property: {
    title: 'Main Title',
    description: 'Subtitle',
    titleSize: 16,
    descriptionSize: 12,
    titleWeight: 400,
    textAlign: 'left',
    descriptionWeight: 200,
    titleColor: 'rgba(50, 50, 51, 10)',
    descriptionColor: 'rgba(150, 151, 153, 10)',
    more: {
      //View more
      show: false,
      type: 'icon',
      text: 'View More',
      url: ''
    },
    style: {
      bgType: 'color',
      bgColor: '#fff'
    } as ComponentStyle
  }
} as DiyComponent<TitleBarProperty>
