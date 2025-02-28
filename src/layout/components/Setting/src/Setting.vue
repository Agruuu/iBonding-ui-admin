<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useClipboard, useCssVar } from '@vueuse/core'

import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useDesign } from '@/hooks/web/useDesign'

import { setCssVar, trim } from '@/utils'
import { colorIsDark, hexToRGB, lighten } from '@/utils/color'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import ColorRadioPicker from './components/ColorRadioPicker.vue'
import InterfaceDisplay from './components/InterfaceDisplay.vue'
import LayoutRadioPicker from './components/LayoutRadioPicker.vue'

defineOptions({ name: 'Setting' })

const { t } = useI18n()
const appStore = useAppStore()

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('setting')
const layout = computed(() => appStore.getLayout)
const drawer = ref(false)

// Theme color related
const systemTheme = ref(appStore.getTheme.elColorPrimary)

const setSystemTheme = (color: string) => {
  setCssVar('--el-color-primary', color)
  appStore.setTheme({ elColorPrimary: color })
  const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
  setMenuTheme(trim(unref(leftMenuBgColor)))
}

// Head theme related
const headerTheme = ref(appStore.getTheme.topHeaderBgColor || '')

const setHeaderTheme = (color: string) => {
  const isDarkColor = colorIsDark(color)
  const textColor = isDarkColor ? '#fff' : 'inherit'
  const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
  const topToolBorderColor = isDarkColor ? color : '#eee'
  setCssVar('--top-header-bg-color', color)
  setCssVar('--top-header-text-color', textColor)
  setCssVar('--top-header-hover-color', textHoverColor)
  appStore.setTheme({
    topHeaderBgColor: color,
    topHeaderTextColor: textColor,
    topHeaderHoverColor: textHoverColor,
    topToolBorderColor
  })
  if (unref(layout) === 'top') {
    setMenuTheme(color)
  }
}

// Menu theme related
const menuTheme = ref(appStore.getTheme.leftMenuBgColor || '')

const setMenuTheme = (color: string) => {
  const primaryColor = useCssVar('--el-color-primary', document.documentElement)
  const isDarkColor = colorIsDark(color)
  const theme: Recordable = {
    // Left menu border color
    leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
    // Left menu background color
    leftMenuBgColor: color,
    // Left menu light background color
    leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
    // Select the background color from the left menu
    leftMenuBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // Collapse the selected background color in the left menu
    leftMenuCollapseBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // Left menu font color
    leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
    // Select font color from the left menu
    leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
    // logoFont color
    logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
    // logoBorder color
    logoBorderColor: isDarkColor ? color : '#eee'
  }
  appStore.setTheme(theme)
  appStore.setCssVarTheme()
}
if (layout.value === 'top' && !appStore.getIsDark) {
  headerTheme.value = '#fff'
  setHeaderTheme('#fff')
}

// monitor layout change，Reset some theme colors
watch(
  () => layout.value,
  (n) => {
    if (n === 'top' && !appStore.getIsDark) {
      headerTheme.value = '#fff'
      setHeaderTheme('#fff')
    } else {
      setMenuTheme(unref(menuTheme))
    }
  }
)

// Copy
const copyConfig = async () => {
  const { copy, copied, isSupported } = useClipboard({
    source: `
      // crumbs
      breadcrumb: ${appStore.getBreadcrumb},
      // Breadcrumb icon
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // Folding icon
      hamburger: ${appStore.getHamburger},
      // Full screen icon
      screenfull: ${appStore.getScreenfull},
      // Size icon
      size: ${appStore.getSize},
      // Multilingual icons
      locale: ${appStore.getLocale},
      // Message icon
      message: ${appStore.getMessage},
      // Tag Page
      tagsView: ${appStore.getTagsView},
      // Tag Page
      tagsViewImmerse: ${appStore.getTagsViewImmerse},
      // Tab icon
      tagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // Menu accordion
      uniqueOpened: ${appStore.getUniqueOpened},
      // fixedheader
      fixedHeader: ${appStore.getFixedHeader},
      // footer
      footer: ${appStore.getFooter},
      // Grey mode
      greyMode: ${appStore.getGreyMode},
      // layoutlayout
      layout: '${appStore.getLayout}',
      // Dark mode
      isDark: ${appStore.getIsDark},
      // Component size
      currentSize: '${appStore.getCurrentSize}',
      // Theme related
      theme: {
        // Theme color
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // Left menu border color
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // Left menu background color
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // Left menu light background color
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // Select the background color from the left menu
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // Collapse the selected background color in the left menu
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // Left menu font color
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // Select font color from the left menu
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logoFont color
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // logoBorder color
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // Head background color
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // Head font color
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // Head hover color
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // Head border color
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `
  })
  if (!isSupported) {
    ElMessage.error(t('setting.copyFailed'))
  } else {
    await copy()
    if (unref(copied)) {
      ElMessage.success(t('setting.copySuccess'))
    }
  }
}

// wipe cache 
const clear = () => {
  const { wsCache } = useCache()
  wsCache.delete(CACHE_KEY.LAYOUT)
  wsCache.delete(CACHE_KEY.THEME)
  wsCache.delete(CACHE_KEY.IS_DARK)
  window.location.reload()
}
</script>

<template>
  <div
    :class="prefixCls"
    class="fixed right-0 top-[45%] h-40px w-40px cursor-pointer bg-[var(--el-color-primary)] text-center leading-40px"
    @click="drawer = true"
  >
    <Icon color="#fff" icon="ep:setting" />
  </div>

  <ElDrawer v-model="drawer" :z-index="4000" direction="rtl" size="350px">
    <template #header>
      <span class="text-16px font-700">{{ t('setting.projectSetting') }}</span>
    </template>

    <div class="text-center">
      <!-- theme -->
      <ElDivider>{{ t('setting.theme') }}</ElDivider>
      <ThemeSwitch />

      <!-- layout -->
      <ElDivider>{{ t('setting.layout') }}</ElDivider>
      <LayoutRadioPicker />

      <!-- System Theme -->
      <ElDivider>{{ t('setting.systemTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="systemTheme"
        :schema="[
          '#409eff',
          '#009688',
          '#536dfe',
          '#ff5c93',
          '#ee4f12',
          '#0096c7',
          '#9c27b0',
          '#ff9800'
        ]"
        @change="setSystemTheme"
      />

      <!-- Head Theme -->
      <ElDivider>{{ t('setting.headerTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="headerTheme"
        :schema="[
          '#fff',
          '#151515',
          '#5172dc',
          '#e74c3c',
          '#24292e',
          '#394664',
          '#009688',
          '#383f45'
        ]"
        @change="setHeaderTheme"
      />

      <!-- Menu Theme -->
      <template v-if="layout !== 'top'">
        <ElDivider>{{ t('setting.menuTheme') }}</ElDivider>
        <ColorRadioPicker
          v-model="menuTheme"
          :schema="[
            '#fff',
            '#001529',
            '#212121',
            '#273352',
            '#191b24',
            '#383f45',
            '#001628',
            '#344058'
          ]"
          @change="setMenuTheme"
        />
      </template>
    </div>

    <!-- Interface display -->
    <ElDivider>{{ t('setting.interfaceDisplay') }}</ElDivider>
    <InterfaceDisplay />

    <ElDivider />
    <div>
      <ElButton class="w-full" type="primary" @click="copyConfig">{{ t('setting.copy') }}</ElButton>
    </div>
    <div class="mt-5px">
      <ElButton class="w-full" type="danger" @click="clear">
        {{ t('setting.clearAndReset') }}
      </ElButton>
    </div>
  </ElDrawer>
</template>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-setting;

.#{$prefix-cls} {
  border-radius: 6px 0 0 6px;
  z-index: 1200;/*Fix the issue that elements without z-index would be covered by the table layer. Make sure the z-index value does not exceed 4000. */
}
</style>
