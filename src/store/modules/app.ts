import { defineStore } from 'pinia'
import { store } from '../index'
import { humpToUnderline, setCssVar } from '@/utils'
import { ElMessage } from 'element-plus'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { ElementPlusSize } from '@/types/elementPlus'
import { LayoutType } from '@/types/layout'
import { ThemeTypes } from '@/types/theme'

const { wsCache } = useCache()

interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  search: boolean
  size: boolean
  locale: boolean
  message: boolean
  tagsView: boolean
  tagsViewImmerse: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  userInfo: string
  isDark: boolean
  currentSize: ElementPlusSize
  sizeMap: ElementPlusSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      userInfo: 'userInfo', // Login information storage field-Suggest changing one field for each project，Avoid conflicts with other projects
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // Is it a mobile device
      title: import.meta.env.VITE_APP_TITLE, // title
      pageLoading: false, // Route jump loading

      breadcrumb: true, // crumbs
      breadcrumbIcon: true, // Breadcrumb icon
      collapse: false, // Folding menu
      uniqueOpened: true, // Do you want to keep only one submenu expanded
      hamburger: true, // Folding icon
      screenfull: true, // Full screen icon
      search: true, // Search icon
      size: true, // Size icon
      locale: true, // Multilingual icons
      message: true, // Message icon
      tagsView: true, // Tag Page
      tagsViewImmerse: false, // Tag page immersion
      tagsViewIcon: true, // Display label icon or not
      logo: true, // logo
      fixedHeader: true, // fixed toolheader
      footer: true, // Display Footer
      greyMode: false, // Do you want to start gray mode，For special days of mourning
      fixedMenu: wsCache.get('fixedMenu') || false, // Is the menu fixed

      layout: wsCache.get(CACHE_KEY.LAYOUT) || 'classic', // layoutlayout
      isDark: wsCache.get(CACHE_KEY.IS_DARK) || false, // Is it in dark mode
      currentSize: wsCache.get('default') || 'default', // Component size
      theme: wsCache.get(CACHE_KEY.THEME) || {
        // Theme color
        elColorPrimary: '#409eff',
        // Left menu border color
        leftMenuBorderColor: 'inherit',
        // Left menu background color
        leftMenuBgColor: '#001529',
        // Left menu light background color
        leftMenuBgLightColor: '#0f2438',
        // Select the background color from the left menu
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        // Collapse the selected background color in the left menu
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // Left menu font color
        leftMenuTextColor: '#bfcbd9',
        // Select font color from the left menu
        leftMenuTextActiveColor: '#fff',
        // logoFont color
        logoTitleTextColor: '#fff',
        // logoBorder color
        logoBorderColor: 'inherit',
        // Head background color
        topHeaderBgColor: '#fff',
        // Head font color
        topHeaderTextColor: 'inherit',
        // Head hover color
        topHeaderHoverColor: '#f6f6f6',
        // Head border color
        topToolBorderColor: '#eee'
      }
    }
  },
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getMessage(): boolean {
      return this.message
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewImmerse(): boolean {
      return this.tagsViewImmerse
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getUserInfo(): string {
      return this.userInfo
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ElementPlusSize {
      return this.currentSize
    },
    getSizeMap(): ElementPlusSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setMessage(message: boolean) {
      this.message = message
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewImmerse(tagsViewImmerse: boolean) {
      this.tagsViewImmerse = tagsViewImmerse
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo: boolean) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setFixedMenu(fixedMenu: boolean) {
      wsCache.set('fixedMenu', fixedMenu)
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('Switching to other layouts is not supported in mobile mode')
        return
      }
      this.layout = layout
      wsCache.set(CACHE_KEY.LAYOUT, this.layout)
    },
    setTitle(title: string) {
      this.title = title
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      wsCache.set(CACHE_KEY.IS_DARK, this.isDark)
    },
    setCurrentSize(currentSize: ElementPlusSize) {
      this.currentSize = currentSize
      wsCache.set('currentSize', this.currentSize)
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
      wsCache.set(CACHE_KEY.THEME, this.theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
    },
    setFooter(footer: boolean) {
      this.footer = footer
    }
  },
  persist: false
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
