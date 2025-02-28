<template>
  <el-carousel
    :height="`${carouselHeight}px`"
    :autoplay="false"
    arrow="hover"
    indicator-position="outside"
  >
    <el-carousel-item v-for="(page, pageIndex) in pages" :key="pageIndex">
      <div class="flex flex-row flex-wrap">
        <div
          v-for="(item, index) in page"
          :key="index"
          class="relative flex flex-col items-center justify-center"
          :style="{ width: columnWidth, height: `${rowHeight}px` }"
        >
          <!-- Icon + Corner marker -->
          <div class="relative" :class="`h-${ICON_SIZE}px w-${ICON_SIZE}px`">
            <!-- Upper right corner marker -->
            <span
              v-if="item.badge?.show"
              class="absolute right--10px top--10px z-1 h-20px rounded-10px p-x-6px text-center text-12px leading-20px"
              :style="{ color: item.badge.textColor, backgroundColor: item.badge.bgColor }"
            >
              {{ item.badge.text }}
            </span>
            <el-image v-if="item.iconUrl" :src="item.iconUrl" class="h-full w-full" />
          </div>
          <!-- title -->
          <span
            v-if="property.layout === 'iconText'"
            class="text-12px"
            :style="{
              color: item.titleColor,
              height: `${TITLE_HEIGHT}px`,
              lineHeight: `${TITLE_HEIGHT}px`
            }"
          >
            {{ item.title }}
          </span>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import { MenuSwiperProperty, MenuSwiperItemProperty } from './config'
/** Menu navigation */
defineOptions({ name: 'MenuSwiper' })
const props = defineProps<{ property: MenuSwiperProperty }>()
// The height of the title
const TITLE_HEIGHT = 20
// The height of the icon
const ICON_SIZE = 42
// Vertical spacing：The spacing between the top and bottom of a line
const SPACE_Y = 16

// paging
const pages = ref<MenuSwiperItemProperty[][]>([])
// Rotating image height
const carouselHeight = ref(0)
// Hang Gao
const rowHeight = ref(0)
// Column width
const columnWidth = ref('')
watch(
  () => props.property,
  () => {
    // Calculate column width：Percentage of each column
    columnWidth.value = `${100 * (1 / props.property.column)}%`
    // Calculate row height：Icon + written words（When only displaying images, it is0） + Vertical spacing * 2
    rowHeight.value =
      (props.property.layout === 'iconText' ? ICON_SIZE + TITLE_HEIGHT : ICON_SIZE) + SPACE_Y * 2
    // Calculate the height of the carousel：Number of rows * Hang Gao
    carouselHeight.value = props.property.row * rowHeight.value

    // Quantity per page：Number of rows * Number of columns
    const pageSize = props.property.row * props.property.column
    // Clear pagination
    pages.value = []
    // Menu on each page
    let pageItems: MenuSwiperItemProperty[] = []
    for (const item of props.property.list) {
      // This page is full，New Next Page
      if (pageItems.length === pageSize) {
        pageItems = []
      }
      // Add one page
      if (pageItems.length === 0) {
        pages.value.push(pageItems)
      }
      // Add one to this page
      pageItems.push(item)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss">
// Override the indicator style to keep it consistent with the APP.
:root {
  .el-carousel__indicator {
    padding-top: 0;
    padding-bottom: 0;
    .el-carousel__button {
      --el-carousel-indicator-height: 6px;
      --el-carousel-indicator-width: 6px;
      --el-carousel-indicator-out-color: #ff6000;
      border-radius: 6px;
    }
  }
  .el-carousel__indicator.is-active {
    .el-carousel__button {
      --el-carousel-indicator-width: 12px;
    }
  }
}
</style>
