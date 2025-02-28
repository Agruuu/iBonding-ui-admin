<template>
  <el-container class="editor">
    <!-- Top：toolbar -->
    <el-header class="editor-header">
      <!-- Left operation area -->
      <slot name="toolBarLeft"></slot>
      <!-- Central operation area -->
      <div class="header-center flex flex-1 items-center justify-center">
        <span>{{ title }}</span>
      </div>
      <!-- Right operation area -->
      <el-button-group class="header-right">
        <el-tooltip content="Reset">
          <el-button @click="handleReset">
            <Icon :size="24" icon="system-uicons:reset-alt" />
          </el-button>
        </el-tooltip>
        <el-tooltip v-if="previewUrl" content="Preview">
          <el-button @click="handlePreview">
            <Icon :size="24" icon="ep:view" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="Save">
          <el-button @click="handleSave">
            <Icon :size="24" icon="ep:check" />
          </el-button>
        </el-tooltip>
      </el-button-group>
    </el-header>

    <!-- Central area -->
    <el-container class="editor-container">
      <!-- left：Component library（ComponentLibrary） -->
      <ComponentLibrary v-if="libs && libs.length > 0" ref="componentLibrary" :list="libs" />
      <!-- core：Design Area（ComponentContainer） -->
      <div class="editor-center page-prop-area" @click="handlePageSelected">
        <!-- Top of the phone -->
        <div class="editor-design-top">
          <!-- Top status bar of mobile phone -->
          <img alt="" class="status-bar" src="@/assets/imgs/diy/statusBar.png" />
          <!-- Top navigation bar on mobile phone -->
          <ComponentContainer
            v-if="showNavigationBar"
            :active="selectedComponent?.id === navigationBarComponent.id"
            :component="navigationBarComponent"
            :show-toolbar="false"
            class="cursor-pointer!"
            @click="handleNavigationBarSelected"
          />
        </div>
        <!-- Absolute positioning components：for example pop-up notification、Floating buttons, etc -->
        <div
          v-for="(component, index) in pageComponents"
          :key="index"
          @click="handleComponentSelected(component, index)"
        >
          <component
            :is="component.id"
            v-if="component.position === 'fixed' && selectedComponent?.uid === component.uid"
            :property="component.property"
          />
        </div>
        <!-- Mobile page editing area -->
        <el-scrollbar
          :view-style="{
            backgroundColor: pageConfigComponent.property.backgroundColor,
            backgroundImage: `url(${pageConfigComponent.property.backgroundImage})`
          }"
          height="100%"
          view-class="phone-container"
          wrap-class="editor-design-center page-prop-area"
        >
          <draggable
            v-model="pageComponents"
            :animation="200"
            :force-fallback="true"
            class="page-prop-area drag-area"
            filter=".component-toolbar"
            ghost-class="draggable-ghost"
            group="component"
            item-key="index"
            @change="handleComponentChange"
          >
            <template #item="{ element, index }">
              <ComponentContainer
                v-if="!element.position || element.position === 'center'"
                :active="selectedComponentIndex === index"
                :can-move-down="index < pageComponents.length - 1"
                :can-move-up="index > 0"
                :component="element"
                @click="handleComponentSelected(element, index)"
                @copy="handleCopyComponent(index)"
                @delete="handleDeleteComponent(index)"
                @move="(direction) => handleMoveComponent(index, direction)"
              />
            </template>
          </draggable>
        </el-scrollbar>
        <!-- Mobile bottom navigation -->
        <div v-if="showTabBar" :class="['editor-design-bottom', 'component', 'cursor-pointer!']">
          <ComponentContainer
            :active="selectedComponent?.id === tabBarComponent.id"
            :component="tabBarComponent"
            :show-toolbar="false"
            @click="handleTabBarSelected"
          />
        </div>
        <!-- Components with fixed layout Operation button area -->
        <div class="fixed-component-action-group">
          <el-tag
            v-if="showPageConfig"
            :effect="selectedComponent?.uid === pageConfigComponent.uid ? 'dark' : 'plain'"
            :type="selectedComponent?.uid === pageConfigComponent.uid ? 'primary' : 'info'"
            size="large"
            @click="handleComponentSelected(pageConfigComponent)"
          >
            <Icon :icon="pageConfigComponent.icon" :size="12" />
            <span>{{ pageConfigComponent.name }}</span>
          </el-tag>
          <template v-for="(component, index) in pageComponents" :key="index">
            <el-tag
              v-if="component.position === 'fixed'"
              :effect="selectedComponent?.uid === component.uid ? 'dark' : 'plain'"
              :type="selectedComponent?.uid === component.uid ? 'primary' : 'info'"
              closable
              size="large"
              @click="handleComponentSelected(component)"
              @close="handleDeleteComponent(index)"
            >
              <Icon :icon="component.icon" :size="12" />
              <span>{{ component.name }}</span>
            </el-tag>
          </template>
        </div>
      </div>
      <!-- right：Attribute Panel（ComponentContainerProperty） -->
      <el-aside v-if="selectedComponent?.property" class="editor-right" width="350px">
        <el-card
          body-class="h-[calc(100%-var(--el-card-padding)-var(--el-card-padding))]"
          class="h-full"
          shadow="never"
        >
          <!-- Component Name -->
          <template #header>
            <div class="flex items-center gap-8px">
              <Icon :icon="selectedComponent?.icon" color="gray" />
              <span>{{ selectedComponent?.name }}</span>
            </div>
          </template>
          <el-scrollbar
            class="m-[calc(0px-var(--el-card-padding))]"
            view-class="p-[var(--el-card-padding)] p-b-[calc(var(--el-card-padding)+var(--el-card-padding))] property"
          >
            <component
              :is="selectedComponent?.id + 'Property'"
              :key="selectedComponent?.uid || selectedComponent?.id"
              v-model="selectedComponent.property"
            />
          </el-scrollbar>
        </el-card>
      </el-aside>
    </el-container>
  </el-container>

  <!-- Preview popup -->
  <Dialog v-model="previewDialogVisible" title="Preview" width="700">
    <div class="flex justify-around">
      <IFrame
        :src="previewUrl"
        class="w-375px border-4px border-rounded-8px border-solid p-2px h-667px!"
      />
      <div class="flex flex-col">
        <el-text>Mobile Scan to Preview</el-text>
        <Qrcode :text="previewUrl" logo="/logo.gif" />
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts">
// Register all components
import { components } from './components/mobile/index'

export default {
  components: { ...components }
}
</script>
<script lang="ts" setup>
import draggable from 'vuedraggable'
import ComponentLibrary from './components/ComponentLibrary.vue'
import { cloneDeep, includes } from 'lodash-es'
import { component as PAGE_CONFIG_COMPONENT } from '@/components/DiyEditor/components/mobile/PageConfig/config'
import { component as NAVIGATION_BAR_COMPONENT } from './components/mobile/NavigationBar/config'
import { component as TAB_BAR_COMPONENT } from './components/mobile/TabBar/config'
import { isEmpty, isString } from '@/utils/is'
import { DiyComponent, DiyComponentLibrary, PageConfig } from '@/components/DiyEditor/util'
import { componentConfigs } from '@/components/DiyEditor/components/mobile'
import { array, oneOfType } from 'vue-types'
import { propTypes } from '@/utils/propTypes'

/** Page decoration details page */
defineOptions({ name: 'DiyPageDetail' })

// Left component library
const componentLibrary = ref()
// Page Settings Component
const pageConfigComponent = ref<DiyComponent<any>>(cloneDeep(PAGE_CONFIG_COMPONENT))
// Top navigation bar
const navigationBarComponent = ref<DiyComponent<any>>(cloneDeep(NAVIGATION_BAR_COMPONENT))
// Bottom navigation menu
const tabBarComponent = ref<DiyComponent<any>>(cloneDeep(TAB_BAR_COMPONENT))

// Selected components，Select the top navigation bar by default
const selectedComponent = ref<DiyComponent<any>>()
// Selected component index
const selectedComponentIndex = ref<number>(-1)
// Component List
const pageComponents = ref<DiyComponent<any>[]>([])
// Define attributes
const props = defineProps({
  // Page configuration supports JSON strings.
  modelValue: oneOfType<string | PageConfig>([String, Object]).isRequired,
  // title
  title: propTypes.string.def(''),
  // Component library
  libs: array<DiyComponentLibrary>(),
  // Do you want to display the top navigation bar
  showNavigationBar: propTypes.bool.def(true),
  // Do you want to display the bottom navigation menu
  showTabBar: propTypes.bool.def(false),
  // Whether to display page configuration
  showPageConfig: propTypes.bool.def(true),
  // Preview address：Provided preview address，Only then will the preview button be displayed
  previewUrl: propTypes.string.def('')
})

// Monitor incoming page configuration
// Analyze out pageConfigComponent Overall configuration of the page，navigationBarComponent、pageComponents、tabBarComponent On the page、in、The configuration below
watch(
  () => props.modelValue,
  () => {
    const modelValue =
      isString(props.modelValue) && !isEmpty(props.modelValue)
        ? (JSON.parse(props.modelValue) as PageConfig)
        : props.modelValue
    pageConfigComponent.value.property =
      (typeof modelValue !== 'string' && modelValue?.page) || PAGE_CONFIG_COMPONENT.property
    navigationBarComponent.value.property =
      (typeof modelValue !== 'string' && modelValue?.navigationBar) ||
      NAVIGATION_BAR_COMPONENT.property
    tabBarComponent.value.property =
      (typeof modelValue !== 'string' && modelValue?.tabBar) || TAB_BAR_COMPONENT.property
    // Find the corresponding page component
    pageComponents.value = ((typeof modelValue !== 'string' && modelValue?.components) || []).map(
      (item) => {
        const component = componentConfigs[item.id]
        return { ...component, property: item.property }
      }
    )
  },
  {
    immediate: true
  }
)

/** Select a component to modify its properties and update its configuration */
watch(
  selectedComponent,
  (val: any) => {
    if (!val || selectedComponentIndex.value === -1) {
      return
    }
    pageComponents.value[selectedComponentIndex.value] = selectedComponent.value!
  },
  { deep: true }
)

// preservation
const handleSave = () => {
  // Send save notification
  emits('save')
}
// Monitoring configuration modification
const pageConfigChange = () => {
  const pageConfig = {
    page: pageConfigComponent.value.property,
    navigationBar: navigationBarComponent.value.property,
    tabBar: tabBarComponent.value.property,
    components: pageComponents.value.map((component) => {
      // Only keep the useful fields for the APP.
      return { id: component.id, property: component.property }
    })
  } as PageConfig
  if (!props.showTabBar) {
    delete pageConfig.tabBar
  }
  // Send data update notifications
  const modelValue = isString(props.modelValue) ? JSON.stringify(pageConfig) : pageConfig
  emits('update:modelValue', modelValue)
}
watch(
  () => [
    pageConfigComponent.value.property,
    navigationBarComponent.value.property,
    tabBarComponent.value.property,
    pageComponents.value
  ],
  () => {
    pageConfigChange()
  },
  { deep: true }
)
// Select the processing page：Display attribute form
const handlePageSelected = (event: any) => {
  if (!props.showPageConfig) return

  // Style configured page-prop-area The elements，Only display page settings
  if (includes(event?.target?.classList, 'page-prop-area')) {
    handleComponentSelected(unref(pageConfigComponent))
  }
}

/**
 * Select components
 *
 * @param component
 * @param index Index of components
 */
const handleComponentSelected = (component: DiyComponent<any>, index: number = -1) => {
  selectedComponent.value = component
  selectedComponentIndex.value = index
}

// Select the top navigation bar
const handleNavigationBarSelected = () => {
  handleComponentSelected(unref(navigationBarComponent))
}

// Select the bottom navigation menu
const handleTabBarSelected = () => {
  handleComponentSelected(unref(tabBarComponent))
}

// Component changes（Drag and drop）
const handleComponentChange = (dragEvent: any) => {
  // newly added，Drag and drop to add components from the component library
  if (dragEvent.added) {
    const { element, newIndex } = dragEvent.added
    handleComponentSelected(element, newIndex)
  } else if (dragEvent.moved) {
    // Drag and drop sorting
    const { newIndex } = dragEvent.moved
    // Keep selected
    selectedComponentIndex.value = newIndex
  }
}

// Exchange components
const swapComponent = (oldIndex: number, newIndex: number) => {
  ;[pageComponents.value[oldIndex], pageComponents.value[newIndex]] = [
    pageComponents.value[newIndex],
    pageComponents.value[oldIndex]
  ]
  // Keep selected
  selectedComponentIndex.value = newIndex
}

/** Mobile components（Move up、Move down） */
const handleMoveComponent = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= pageComponents.value.length) return

  swapComponent(index, newIndex)
}

/** Copy components */
const handleCopyComponent = (index: number) => {
  const component = cloneDeep(pageComponents.value[index])
  component.uid = new Date().getTime()
  pageComponents.value.splice(index + 1, 0, component)
}

/**
 * remove component
 * @param index Current component index
 */
const handleDeleteComponent = (index: number) => {
  // remove component
  pageComponents.value.splice(index, 1)
  if (index < pageComponents.value.length) {
    // 1. When it's not the last component，After deletion, select the components below
    let bottomIndex = index
    handleComponentSelected(pageComponents.value[bottomIndex], bottomIndex)
  } else if (pageComponents.value.length > 0) {
    // 2. When it's not the first component，After deletion, select the component above
    let topIndex = index - 1
    handleComponentSelected(pageComponents.value[topIndex], topIndex)
  } else {
    // 3. After deleting all components，Display page settings
    handleComponentSelected(unref(pageConfigComponent))
  }
}

// Toolbar operation
const emits = defineEmits(['reset', 'preview', 'save', 'update:modelValue'])

// Inject the function of refreshing the page without sensation
const reload = inject<() => void>('reload')
// Reset
const handleReset = () => {
  if (reload) reload()
  emits('reset')
}

// preview
const previewDialogVisible = ref(false)
const handlePreview = () => {
  previewDialogVisible.value = true
  emits('preview')
}

// Set default selected components
const setDefaultSelectedComponent = () => {
  if (props.showPageConfig) {
    selectedComponent.value = unref(pageConfigComponent)
  } else if (props.showNavigationBar) {
    selectedComponent.value = unref(navigationBarComponent)
  } else if (props.showTabBar) {
    selectedComponent.value = unref(tabBarComponent)
  }
}

watch(
  () => [props.showPageConfig, props.showNavigationBar, props.showTabBar],
  () => setDefaultSelectedComponent()
)

onMounted(() => setDefaultSelectedComponent())
</script>
<style lang="scss" scoped>
/* Mobile phone width */
$phone-width: 375px;
$toolbar-height: 42px;

/* Root node style */
.editor {
  display: flex;
  height: 100%;
  margin: calc(0px - var(--app-content-padding));
  flex-direction: column;

  /* Top：toolbar */
  .editor-header {
    display: flex;
    height: $toolbar-height;
    padding: 0;
    background-color: var(--el-bg-color);
    border-bottom: solid 1px var(--el-border-color);
    align-items: center;
    justify-content: space-between;

    /* toolbar：Right button */
    .header-right {
      height: 100%;

      .el-button {
        height: 100%;
      }
    }

    /* Hide the border of toolbar buttons */
    :deep(.el-radio-button__inner),
    :deep(.el-button) {
      border-top: none !important;
      border-bottom: none !important;
      border-radius: 0 !important;
    }
  }

  /* Central operation area */
  .editor-container {
    height: calc(
      100vh - var(--top-tool-height) - var(--tags-view-height) - var(--app-footer-height) -
        $toolbar-height
    );

    /* Right attribute panel */
    .editor-right {
      overflow: hidden;
      box-shadow: -8px 0 8px -8px rgb(0 0 0 / 12%);
      flex-shrink: 0;

      /* Top of attribute panel：Reduce the inner margin */
      :deep(.el-card__header) {
        padding: 8px 16px;
      }

      /* Attribute Panel Grouping */
      :deep(.property-group) {
        margin: 0 -20px;

        &.el-card {
          border: none;
        }

        /* Attribute Group Name */
        .el-card__header {
          padding: 8px 32px;
          background: var(--el-bg-color-page);
          border: none;
        }

        .el-card__body {
          border: none;
        }
      }
    }

    /* Central area */
    .editor-center {
      position: relative;
      display: flex;
      width: 100%;
      margin: 16px 0 0;
      overflow: hidden;
      background-color: var(--app-content-bg-color);
      flex: 1 1 0;
      flex-direction: column;
      justify-content: center;

      /* Top of the phone */
      .editor-design-top {
        display: flex;
        width: $phone-width;
        margin: 0 auto;
        flex-direction: column;

        /* Top status bar of mobile phone */
        .status-bar {
          width: $phone-width;
          height: 20px;
          background-color: #fff;
        }
      }

      /* Mobile bottom navigation */
      .editor-design-bottom {
        width: $phone-width;
        margin: 0 auto;
      }

      /* Mobile page editing area */
      :deep(.editor-design-center) {
        width: 100%;

        /* Main content */
        .phone-container {
          position: relative;
          width: $phone-width;
          height: 100%;
          margin: 0 auto;
          background-repeat: no-repeat;
          background-size: 100% 100%;

          .drag-area {
            width: 100%;
            height: 100%;
          }
        }
      }

      /* Components with fixed layout Operation button area */
      .fixed-component-action-group {
        position: absolute;
        top: 0;
        right: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        :deep(.el-tag) {
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
          border: none;

          .el-tag__content {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .el-icon {
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
