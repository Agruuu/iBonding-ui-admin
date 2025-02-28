import {
  useDictSelectRule,
  useEditorRule,
  useSelectRule,
  useUploadFileRule,
  useUploadImgRule,
  useUploadImgsRule
} from './config'
import { Ref } from 'vue'
import { Menu } from '@/components/FormCreate/src/type'
import { apiSelectRule } from '@/components/FormCreate/src/config/selectRule'

/**
 * Form Designer Enhancement hook
 * newly added
 * - File upload
 * - Single image upload
 * - Upload multiple images
 * - Dictionary selector
 * - User selector
 * - Department selector
 * - Rich Text
 */
export const useFormCreateDesigner = async (designer: Ref) => {
  const editorRule = useEditorRule()
  const uploadFileRule = useUploadFileRule()
  const uploadImgRule = useUploadImgRule()
  const uploadImgsRule = useUploadImgsRule()

  /**
   * Building Form Components
   */
  const buildFormComponents = () => {
    // Remove the built-in upload component rules，use uploadFileRule、uploadImgRule、uploadImgsRule replace
    designer.value?.removeMenuItem('upload')
    // Remove the built-in rich text component rules，use editorRule replace
    designer.value?.removeMenuItem('fc-editor')
    const components = [editorRule, uploadFileRule, uploadImgRule, uploadImgsRule]
    components.forEach((component) => {
      // Insert Component Rules
      designer.value?.addComponent(component)
      // Insert the drag - and - drop button under the `main` category.
      designer.value?.appendMenuItem('main', {
        icon: component.icon,
        name: component.name,
        label: component.label
      })
    })
  }

  const userSelectRule = useSelectRule({
    name: 'UserSelect',
    label: 'User Selector',
    icon: 'icon-user-o'
  })
  const deptSelectRule = useSelectRule({
    name: 'DeptSelect',
    label: 'Department Selector',
    icon: 'icon-address-card-o'
  })
  const dictSelectRule = useDictSelectRule()
  const apiSelectRule0 = useSelectRule({
    name: 'ApiSelect',
    label: 'API Selector',
    icon: 'icon-server',
    props: [...apiSelectRule]
  })

  /**
   * Build system field menu
   */
  const buildSystemMenu = () => {
    // Remove the built-in dropdown selector component，use currencySelectRule replace
    // designer.value?.removeMenuItem('select')
    // designer.value?.removeMenuItem('radio')
    // designer.value?.removeMenuItem('checkbox')
    const components = [userSelectRule, deptSelectRule, dictSelectRule, apiSelectRule0]
    const menu: Menu = {
      name: 'system',
      title: 'System Fields',
      list: components.map((component) => {
        // Insert Component Rules
        designer.value?.addComponent(component)
        // Insert the drag-and-drop button under the `system` category.
        return {
          icon: component.icon,
          name: component.name,
          label: component.label
        }
      })
    }
    designer.value?.addMenu(menu)
  }

  onMounted(async () => {
    await nextTick()
    buildFormComponents()
    buildSystemMenu()
  })
}
