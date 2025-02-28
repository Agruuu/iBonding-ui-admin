import { DiyComponent } from '@/components/DiyEditor/util'

/** Page setting properties */
export interface PageConfigProperty {
  // Page Description
  description: string
  // Page background color
  backgroundColor: string
  // Page background image
  backgroundImage: string
}

// Define page components
export const component = {
  id: 'PageConfig',
  name: 'Page Settings',
  icon: 'ep:document',
  property: {
    description: '',
    backgroundColor: '#f5f5f5',
    backgroundImage: ''
  }
} as DiyComponent<PageConfigProperty>
