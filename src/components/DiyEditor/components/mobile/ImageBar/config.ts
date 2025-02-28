import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Image display properties */
export interface ImageBarProperty {
  // pictures linking
  imgUrl: string
  // Jump link
  url: string
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'ImageBar',
  name: 'Image Bar',
  icon: 'ep:picture',
  property: {
    imgUrl: '',
    url: '',
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<ImageBarProperty>
