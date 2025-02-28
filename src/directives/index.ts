import type { App } from 'vue'
import { hasRole } from './permission/hasRole'
import { hasPermi } from './permission/hasPermi'

/**
 * Export command：v-xxx
 * @methods hasRole User Permissions，usage: v-hasRole
 * @methods hasPermi Button permissions，usage: v-hasPermi
 */
export const setupAuth = (app: App<Element>) => {
  hasRole(app)
  hasPermi(app)
}

/**
 * Export command：v-mountedFocus
 */
export const setupMountedFocus = (app: App<Element>) => {
  app.directive('mountedFocus', {
    mounted(el) {
      el.focus()
    }
  })
}
