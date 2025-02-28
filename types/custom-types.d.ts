import { SlateDescendant } from '@wangeditor/editor'

declare module 'slate' {
  interface CustomTypes {
    // extend text
    Text: {
      text: string
      bold?: boolean
      italic?: boolean
      code?: boolean
      through?: boolean
      underline?: boolean
      sup?: boolean
      sub?: boolean
      color?: string
      bgColor?: string
      fontSize?: string
      fontFamily?: string
    }

    // Extend the `type` attribute of Element.
    Element: {
      type: string
      children: SlateDescendant[]
    }
  }
}
