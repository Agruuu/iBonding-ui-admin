/*
 * Component registration
 *
 * Component specifications：
 * 1. Each sub directory is an independent component，Each directory includes the following three files：
 * 2. config.ts：Component configuration，Mandatory ，Used to define components、Default properties of components、Define the type of attribute
 * 3. index.vue：Component Display，Used to display the rendering effect of components。May not be provided，as Page（Page Settings），Just need the attribute configuration form
 * 4. property.vue：Component Attribute Form，Used for configuring components，Mandatory ，
 *
 * notes：
 * The component ID shall be based on the ID configured in config.ts and has nothing to do with the name of the component directory. However, it is still recommended that the name of the component directory be consistent with the component ID.
 */

// Import component interface module
const viewModules: Record<string, any> = import.meta.glob('./*/*.vue')
// Import configuration module
const configModules: Record<string, any> = import.meta.glob('./*/config.ts', { eager: true })

// Interface module
const components = {}
// Component Configuration Module
const componentConfigs = {}

// Types of component interfaces
type ViewType = 'index' | 'property'

/**
 * Interface module for registering components
 *
 * @param componentId
 * @param configPath Configure the file path of the module
 * @param viewType Types of component interfaces
 */
const registerComponentViewModule = (
  componentId: string,
  configPath: string,
  viewType: ViewType
) => {
  const viewPath = configPath.replace('config.ts', `${viewType}.vue`)
  const viewModule = viewModules[viewPath]
  if (viewModule) {
    // Define asynchronous components
    components[componentId] = defineAsyncComponent(viewModule)
  }
}

// register
Object.keys(configModules).forEach((modulePath: string) => {
  const component = configModules[modulePath].component
  const componentId = component?.id
  if (componentId) {
    // Register Components
    componentConfigs[componentId] = component
    // Registration Preview Interface
    registerComponentViewModule(componentId, modulePath, 'index')
    // Registration attribute configuration form
    registerComponentViewModule(`${componentId}Property`, modulePath, 'property')
  }
})

export { components, componentConfigs }
