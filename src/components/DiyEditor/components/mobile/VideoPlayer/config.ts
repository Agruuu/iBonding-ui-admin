import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Video playback attributes */
export interface VideoPlayerProperty {
  // Video link
  videoUrl: string
  // Cover link
  posterUrl: string
  // Whether to play automatically
  autoplay: boolean
  // Component Style
  style: VideoPlayerStyle
}

// Video playback style
export interface VideoPlayerStyle extends ComponentStyle {
  // Video height
  height: number
}

// Define components
export const component = {
  id: 'VideoPlayer',
  name: 'Video player',
  icon: 'ep:video-play',
  property: {
    videoUrl: '',
    posterUrl: '',
    autoplay: false,
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8,
      height: 300
    } as VideoPlayerStyle
  }
} as DiyComponent<VideoPlayerProperty>
