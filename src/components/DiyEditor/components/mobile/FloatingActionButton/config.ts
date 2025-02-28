import { DiyComponent } from '@/components/DiyEditor/util'

// Suspended button properties
export interface FloatingActionButtonProperty {
  // Expand direction
  direction: 'horizontal' | 'vertical'
  // Whether to display text
  showText: boolean
  // Button List
  list: FloatingActionButtonItemProperty[]
}

// Suspended button item attribute
export interface FloatingActionButtonItemProperty {
  // Image address
  imgUrl: string
  // Jump connection
  url: string
  // written words
  text: string
  // Text color
  textColor: string
}

// Define components
export const component = {
  id: 'FloatingActionButton',
  name: 'Floating Action Button',
  icon: 'tabler:float-right',
  position: 'fixed',
  property: {
    direction: 'vertical',
    showText: true,
    list: [{ textColor: '#fff' }]
  }
} as DiyComponent<FloatingActionButtonProperty>
