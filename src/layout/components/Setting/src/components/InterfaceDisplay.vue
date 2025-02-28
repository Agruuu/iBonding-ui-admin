<script lang="ts" setup>
import { setCssVar } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useWatermark } from '@/hooks/web/useWatermark'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'InterfaceDisplay' })

const { t } = useI18n()
const { getPrefixCls } = useDesign()
const { setWatermark } = useWatermark()
const prefixCls = getPrefixCls('interface-display')
const appStore = useAppStore()

const water = ref()

// breadcrumb
const breadcrumb = ref(appStore.getBreadcrumb)

const breadcrumbChange = (show: boolean) => {
  appStore.setBreadcrumb(show)
}

// Breadcrumb icon
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

const breadcrumbIconChange = (show: boolean) => {
  appStore.setBreadcrumbIcon(show)
}

// Folding icon
const hamburger = ref(appStore.getHamburger)

const hamburgerChange = (show: boolean) => {
  appStore.setHamburger(show)
}

// Full screen icon
const screenfull = ref(appStore.getScreenfull)

const screenfullChange = (show: boolean) => {
  appStore.setScreenfull(show)
}

// Size icon
const size = ref(appStore.getSize)

const sizeChange = (show: boolean) => {
  appStore.setSize(show)
}

// Multilingual icons
const locale = ref(appStore.getLocale)

const localeChange = (show: boolean) => {
  appStore.setLocale(show)
}

// Message icon
const message = ref(appStore.getMessage)

const messageChange = (show: boolean) => {
  appStore.setMessage(show)
}

// Tag Page
const tagsView = ref(appStore.getTagsView)

const tagsViewChange = (show: boolean) => {
  // When switching the display of the label bar，Synchronize the switching of the height of the label bar
  setCssVar('--tags-view-height', show ? '35px' : '0px')
  appStore.setTagsView(show)
}

// Tag page immersion
const tagsViewImmerse = ref(appStore.getTagsViewImmerse)

const tagsViewImmerseChange = (immerse: boolean) => {
  appStore.setTagsViewImmerse(immerse)
}

// Tab icon
const tagsViewIcon = ref(appStore.getTagsViewIcon)

const tagsViewIconChange = (show: boolean) => {
  appStore.setTagsViewIcon(show)
}

// logo
const logo = ref(appStore.getLogo)

const logoChange = (show: boolean) => {
  appStore.setLogo(show)
}

// Menu accordion
const uniqueOpened = ref(appStore.getUniqueOpened)

const uniqueOpenedChange = (uniqueOpened: boolean) => {
  appStore.setUniqueOpened(uniqueOpened)
}

// Fixed head
const fixedHeader = ref(appStore.getFixedHeader)

const fixedHeaderChange = (show: boolean) => {
  appStore.setFixedHeader(show)
}

// footer
const footer = ref(appStore.getFooter)

const footerChange = (show: boolean) => {
  appStore.setFooter(show)
}

// Grey mode
const greyMode = ref(appStore.getGreyMode)

const greyModeChange = (show: boolean) => {
  appStore.setGreyMode(show)
}

// Fixed menu
const fixedMenu = ref(appStore.getFixedMenu)

const fixedMenuChange = (show: boolean) => {
  appStore.setFixedMenu(show)
}

// Set watermark
const setWater = () => {
  setWatermark(water.value)
}

const layout = computed(() => appStore.getLayout)

watch(
  () => layout.value,
  (n) => {
    if (n === 'top') {
      appStore.setCollapse(false)
    }
  }
)
</script>

<template>
  <div :class="prefixCls">
    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.breadcrumb') }}</span>
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.breadcrumbIcon') }}</span>
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.hamburgerIcon') }}</span>
      <ElSwitch v-model="hamburger" @change="hamburgerChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.screenfullIcon') }}</span>
      <ElSwitch v-model="screenfull" @change="screenfullChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.sizeIcon') }}</span>
      <ElSwitch v-model="size" @change="sizeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.localeIcon') }}</span>
      <ElSwitch v-model="locale" @change="localeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.messageIcon') }}</span>
      <ElSwitch v-model="message" @change="messageChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.tagsView') }}</span>
      <ElSwitch v-model="tagsView" @change="tagsViewChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.tagsViewImmerse') }}</span>
      <ElSwitch v-model="tagsViewImmerse" @change="tagsViewImmerseChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.tagsViewIcon') }}</span>
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.logo') }}</span>
      <ElSwitch v-model="logo" @change="logoChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.uniqueOpened') }}</span>
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.fixedHeader') }}</span>
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.footer') }}</span>
      <ElSwitch v-model="footer" @change="footerChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.greyMode') }}</span>
      <ElSwitch v-model="greyMode" @change="greyModeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('setting.fixedMenu') }}</span>
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ t('watermark.watermark') }}</span>
      <ElInput v-model="water" class="right-1 w-20" @change="setWater()" />
    </div>
  </div>
</template>
