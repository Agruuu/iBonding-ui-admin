import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Carousel attribute */
export interface CarouselProperty {
  // type：default | card
  type: 'default' | 'card'
  // Indicator Style：spot | number
  indicator: 'dot' | 'number'
  // Whether to play automatically
  autoplay: boolean
  // Play interval
  interval: number
  // Rotating content
  items: CarouselItemProperty[]
  // Component Style
  style: ComponentStyle
}
// Rotating content attributes
export interface CarouselItemProperty {
  // type：picture | video
  type: 'img' | 'video'
  // pictures linking
  imgUrl: string
  // Video link
  videoUrl: string
  // Jump link
  url: string
}

// Define components
export const component = {
  id: 'Carousel',
  name: 'Carousel',
  icon: 'system-uicons:carousel',
  property: {
    type: 'default',
    indicator: 'dot',
    autoplay: false,
    interval: 3,
    items: [
      { type: 'img', imgUrl: 'https://i.ibb.co/7NtY1FfL/banner-01.jpg', videoUrl: '' },
      { type: 'img', imgUrl: 'https://i.ibb.co/TM7HnnQY/banner-02.jpg', videoUrl: '' }
    ] as CarouselItemProperty[],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<CarouselProperty>
