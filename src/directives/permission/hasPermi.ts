import type { App } from 'vue'
import { useUserStore } from '@/store/modules/user'

const { t } = useI18n() // internationalization

/** Instructions for determining permissions directive */
export function hasPermi(app: App<Element>) {
  app.directive('hasPermi', (el, binding) => {
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
      const hasPermissions = hasPermission(value)

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(t('permission.hasPermission'))
    }
  })
}

/** Methods for determining permissions function */
const userStore = useUserStore()
const all_permission = '*:*:*'
export const hasPermission = (permission: string[]) => {
  return (
    userStore.permissions.has(all_permission) ||
    permission.some((permission) => userStore.permissions.has(permission))
  )
}
