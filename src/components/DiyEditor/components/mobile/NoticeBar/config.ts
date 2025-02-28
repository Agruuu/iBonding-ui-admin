import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Bulletin Board Properties */
export interface NoticeBarProperty {
  // Icon address
  iconUrl: string
  // Announcement Content List
  contents: NoticeContentProperty[]
  // background color 
  backgroundColor: string
  // Text color
  textColor: string
  // Component Style
  style: ComponentStyle
}

/** Content attributes */
export interface NoticeContentProperty {
  // Content Text
  text: string
  // Link address
  url: string
}

// Define components
export const component = {
  id: 'NoticeBar',
  name: 'Notice Bar',
  icon: 'ep:bell',
  property: {
    iconUrl: 'https://i.ibb.co/7d0c3fjg/xinjian.png',
    contents: [
      {
        text: '',
        url: ''
      }
    ],
    backgroundColor: '#fff',
    textColor: '#333',
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<NoticeBarProperty>
