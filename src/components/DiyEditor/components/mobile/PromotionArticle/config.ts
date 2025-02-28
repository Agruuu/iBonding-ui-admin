import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'

/** Marketing article attributes */
export interface PromotionArticleProperty {
  // Article Number
  id: number
  // Component Style
  style: ComponentStyle
}

// Define components
export const component = {
  id: 'PromotionArticle',
  name: 'Promotion Article',
  icon: 'ph:article-medium',
  property: {
    style: {
      bgType: 'color',
      bgColor: '',
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 8
    } as ComponentStyle
  }
} as DiyComponent<PromotionArticleProperty>
