import { DiyComponent } from '@/components/DiyEditor/util'

/** Top navigation bar properties */
export interface NavigationBarProperty {
  // Background type
  bgType: 'color' | 'img'
  // background color 
  bgColor: string
  // pictures linking
  bgImg: string
  // style type：default | immersive 
  styleType: 'normal' | 'inner'
  // Resident Display
  alwaysShow: boolean
  // Mini program cell list
  mpCells: NavigationBarCellProperty[]
  // Other platform cell list
  otherCells: NavigationBarCellProperty[]
  // Local variables
  _local: {
    // Preview Top Navigation（Mini program）
    previewMp: boolean
    // Preview Top Navigation（Non mini program）
    previewOther: boolean
  }
}

/** Top navigation bar - Cell attribute */
export interface NavigationBarCellProperty {
  // type：text | picture | Search box
  type: 'text' | 'image' | 'search'
  // width
  width: number
  // height
  height: number
  // Top position
  top: number
  // Left position
  left: number
  // Text Content
  text: string
  // Text color
  textColor: string
  // Image address
  imgUrl: string
  // pictures linking
  url: string
  // Search box：Prompt Text
  placeholder: string
  // Search box：Border corner radius
  borderRadius: number
}

// Define components
export const component = {
  id: 'NavigationBar',
  name: 'Top Navigation Bar',
  icon: 'tabler:layout-navbar',
  property: {
    bgType: 'color',
    bgColor: '#fff',
    bgImg: '',
    styleType: 'normal',
    alwaysShow: true,
    mpCells: [
      {
        type: 'text',
        textColor: '#111111'
      }
    ],
    otherCells: [
      {
        type: 'text',
        textColor: '#111111'
      }
    ],
    _local: {
      previewMp: true,
      previewOther: false
    }
  }
} as DiyComponent<NavigationBarProperty>
