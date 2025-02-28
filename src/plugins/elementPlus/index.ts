import type { App } from 'vue'
// Some components, such as `ElScrollbar`, need to be globally imported; otherwise, there will be problems with the styles of some dropdown items.
import { ElLoading, ElScrollbar, ElButton } from 'element-plus'

const plugins = [ElLoading]

const components = [ElScrollbar, ElButton]

export const setupElementPlus = (app: App<Element>) => {
  plugins.forEach((plugin) => {
    app.use(plugin)
  })

  components.forEach((component) => {
    app.component(component.name, component)
  })
}
