<template>
  <Dialog v-model="dialogVisible" title="Select Link" width="65%">
    <div class="h-500px flex gap-8px">
      <!-- Left group list -->
      <el-scrollbar wrap-class="h-full" ref="groupScrollbar" view-class="flex flex-col">
        <el-button
          v-for="(group, groupIndex) in APP_LINK_GROUP_LIST"
          :key="groupIndex"
          :class="[
            'm-r-16px m-l-0px! justify-start! w-90px',
            { active: activeGroup === group.name }
          ]"
          ref="groupBtnRefs"
          :text="activeGroup !== group.name"
          :type="activeGroup === group.name ? 'primary' : 'default'"
          @click="handleGroupSelected(group.name)"
        >
          {{ group.name }}
        </el-button>
      </el-scrollbar>
      <!-- List of links on the right -->
      <el-scrollbar class="h-full flex-1" @scroll="handleScroll" ref="linkScrollbar">
        <div v-for="(group, groupIndex) in APP_LINK_GROUP_LIST" :key="groupIndex">
          <!-- Group Title -->
          <div class="font-bold" ref="groupTitleRefs">{{ group.name }}</div>
          <!-- Link List -->
          <el-tooltip
            v-for="(appLink, appLinkIndex) in group.links"
            :key="appLinkIndex"
            :content="appLink.path"
            placement="bottom"
            :show-after="300"
          >
            <el-button
              class="m-b-8px m-r-8px m-l-0px!"
              :type="isSameLink(appLink.path, activeAppLink.path) ? 'primary' : 'default'"
              @click="handleAppLinkSelected(appLink)"
            >
              {{ appLink.name }}
            </el-button>
          </el-tooltip>
        </div>
      </el-scrollbar>
    </div>
    <!-- Bottom dialog box operation buttons -->
    <template #footer>
      <el-button type="primary" @click="handleSubmit">Confirm</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
    </template>
  </Dialog>
  <Dialog v-model="detailSelectDialog.visible" title="" width="50%">
    <el-form class="min-h-200px">
      <el-form-item
        label="Select Category"
        v-if="detailSelectDialog.type === APP_LINK_TYPE_ENUM.PRODUCT_CATEGORY_LIST"
      >
        <ProductCategorySelect
          v-model="detailSelectDialog.id"
          :parent-id="0"
          @update:model-value="handleProductCategorySelected"
        />
      </el-form-item>
    </el-form>
  </Dialog>
</template>
<script lang="ts" setup>
import { APP_LINK_GROUP_LIST, APP_LINK_TYPE_ENUM, AppLink } from './data'
import { ButtonInstance, ScrollbarInstance } from 'element-plus'
import { split } from 'lodash-es'
import ProductCategorySelect from '@/views/mall/product/category/components/ProductCategorySelect.vue'
import { getUrlNumberValue } from '@/utils'

// APP Link selection popup
defineOptions({ name: 'AppLinkSelectDialog' })
// Selected groups，Select the first one by default
const activeGroup = ref(APP_LINK_GROUP_LIST[0].name)
// Selected ones APP link
const activeAppLink = ref({} as AppLink)

/** Open pop-up window */
const dialogVisible = ref(false)
const open = (link: string) => {
  activeAppLink.value.path = link
  dialogVisible.value = true

  // Scroll to the current link
  const group = APP_LINK_GROUP_LIST.find((group) =>
    group.links.some((linkItem) => {
      const sameLink = isSameLink(linkItem.path, link)
      if (sameLink) {
        activeAppLink.value = { ...linkItem, path: link }
      }
      return sameLink
    })
  )
  if (group) {
    // Reasons for using nextTick: The DOM may not have been generated yet, resulting in a failed scroll.
    nextTick(() => handleGroupSelected(group.name))
  }
}
defineExpose({ open })

// handle APP Link selection
const handleAppLinkSelected = (appLink: AppLink) => {
  if (!isSameLink(appLink.path, activeAppLink.value.path)) {
    activeAppLink.value = appLink
  }
  switch (appLink.type) {
    case APP_LINK_TYPE_ENUM.PRODUCT_CATEGORY_LIST:
      detailSelectDialog.value.visible = true
      detailSelectDialog.value.type = appLink.type
      // Return display
      detailSelectDialog.value.id =
        getUrlNumberValue('id', 'http://127.0.0.1' + activeAppLink.value.path) || undefined
      break
    default:
      break
  }
}

// Process binding value updates
const emit = defineEmits<{
  change: [link: string]
  appLinkChange: [appLink: AppLink]
}>()
const handleSubmit = () => {
  dialogVisible.value = false
  emit('change', activeAppLink.value.path)
  emit('appLinkChange', activeAppLink.value)
}

// Group Title Reference List
const groupTitleRefs = ref<HTMLInputElement[]>([])
/**
 * Process the scrolling of the list of links on the right side
 * @param scrollTop The position of the scrollbar
 */
const handleScroll = ({ scrollTop }: { scrollTop: number }) => {
  const titleEl = groupTitleRefs.value.find((titleEl: HTMLInputElement) => {
    // Get the location information of the title
    const { offsetHeight, offsetTop } = titleEl
    // Determine whether the title is within the visible range
    return scrollTop >= offsetTop && scrollTop < offsetTop + offsetHeight
  })
  // Only need to process once
  if (titleEl && activeGroup.value !== titleEl.textContent) {
    activeGroup.value = titleEl.textContent || ''
    // Synchronize the position of the left scrollbar
    scrollToGroupBtn(activeGroup.value)
  }
}

// Right scroll bar
const linkScrollbar = ref<ScrollbarInstance>()
// Process group selection
const handleGroupSelected = (group: string) => {
  activeGroup.value = group
  const titleRef = groupTitleRefs.value.find((item: HTMLInputElement) => item.textContent === group)
  if (titleRef) {
    // Rolling Group Title
    linkScrollbar.value?.setScrollTop(titleRef.offsetTop)
  }
}

// Group scrollbar
const groupScrollbar = ref<ScrollbarInstance>()
// Group reference list
const groupBtnRefs = ref<ButtonInstance[]>([])
// Auto scroll grouping button，Ensure that the grouping button remains within the visible area
const scrollToGroupBtn = (group: string) => {
  const groupBtn = groupBtnRefs.value
    .map((btn: ButtonInstance) => btn['ref'])
    .find((ref: Node) => ref.textContent === group)
  if (groupBtn) {
    groupScrollbar.value?.setScrollTop(groupBtn.offsetTop)
  }
}

// Is it the same link（Not comparing parameters，Only compare links）
const isSameLink = (link1: string, link2: string) => {
  return split(link1, '?', 1)[0] === split(link2, '?', 1)[0]
}

// Details selection dialog box
const detailSelectDialog = ref<{
  visible: boolean
  id?: number
  type?: APP_LINK_TYPE_ENUM
}>({
  visible: false,
  id: undefined,
  type: undefined
})
// Select processing details
const handleProductCategorySelected = (id: number) => {
  const url = new URL(activeAppLink.value.path, 'http://127.0.0.1')
  // modify id parameter
  url.searchParams.set('id', `${id}`)
  // Exclude Domain Names
  activeAppLink.value.path = `${url.pathname}${url.search}`
  // close dialog boxes
  detailSelectDialog.value.visible = false
  // Reset id
  detailSelectDialog.value.id = undefined
}
</script>
<style lang="scss" scoped></style>
