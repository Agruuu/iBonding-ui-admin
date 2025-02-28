<template>
  <div class="navigation-bar" :style="bgStyle">
    <div class="h-full w-full flex items-center">
      <div v-for="(cell, cellIndex) in cellList" :key="cellIndex" :style="getCellStyle(cell)">
        <span v-if="cell.type === 'text'">{{ cell.text }}</span>
        <img v-else-if="cell.type === 'image'" :src="cell.imgUrl" alt="" class="h-full w-full" />
        <SearchBar v-else :property="getSearchProp(cell)" />
      </div>
    </div>
    <img
      v-if="property._local?.previewMp"
      src="@/assets/imgs/diy/app-nav-bar-mp.png"
      alt=""
      class="h-30px w-86px"
    />
  </div>
</template>
<script setup lang="ts">
import { NavigationBarCellProperty, NavigationBarProperty } from './config'
import SearchBar from '@/components/DiyEditor/components/mobile/SearchBar/index.vue'
import { StyleValue } from 'vue'
import { SearchProperty } from '@/components/DiyEditor/components/mobile/SearchBar/config'

/** Top navigation bar of the page */
defineOptions({ name: 'NavigationBar' })

const props = defineProps<{ property: NavigationBarProperty }>()

// background
const bgStyle = computed(() => {
  const background =
    props.property.bgType === 'img' && props.property.bgImg
      ? `url(${props.property.bgImg}) no-repeat top center / 100% 100%`
      : props.property.bgColor
  return { background }
})
// Cell List
const cellList = computed(() =>
  props.property._local?.previewMp ? props.property.mpCells : props.property.otherCells
)
// Cell width
const cellWidth = computed(() => {
  return props.property._local?.previewMp ? (375 - 80 - 86) / 6 : (375 - 90) / 8
})
// Get cell style
const getCellStyle = (cell: NavigationBarCellProperty) => {
  return {
    width: cell.width * cellWidth.value + (cell.width - 1) * 10 + 'px',
    left: cell.left * cellWidth.value + (cell.left + 1) * 10 + 'px',
    position: 'absolute'
  } as StyleValue
}
// Get search box properties
const getSearchProp = computed(() => (cell: NavigationBarCellProperty) => {
  return {
    height: 30,
    showScan: false,
    placeholder: cell.placeholder,
    borderRadius: cell.borderRadius
  } as SearchProperty
})
</script>
<style lang="scss" scoped>
.navigation-bar {
  display: flex;
  height: 50px;
  background: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;

  /* left */
  .left {
    margin-left: 8px;
  }

  .center {
    font-size: 14px;
    line-height: 35px;
    color: #333;
    text-align: center;
    flex: 1;
  }

  /* right */
  .right {
    margin-right: 8px;
  }
}
</style>
