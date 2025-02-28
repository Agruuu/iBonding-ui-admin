import { DiyComponent } from '@/components/DiyEditor/util'

/** Pop up ad attributes */
export interface PopoverProperty {
  list: PopoverItemProperty[]
}

export interface PopoverItemProperty {
  // Image address
  imgUrl: string
  // Jump connection
  url: string
  // Display type：Display only once、It will display every time it starts
  showType: 'once' | 'always'
}

// Define components
export const component = {
  id: 'Popover',
  name: 'Popover',
  icon: 'carbon:popup',
  position: 'fixed',
  property: {
    list: [{ showType: 'once' }]
  }
} as DiyComponent<PopoverProperty>
