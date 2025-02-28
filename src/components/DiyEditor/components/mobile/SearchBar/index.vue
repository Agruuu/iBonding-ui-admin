<template>
  <div
    class="search-bar"
    :style="{
      color: property.textColor
    }"
  >
    <!-- Search box -->
    <div
      class="inner"
      :style="{
        height: `${property.height}px`,
        background: property.backgroundColor,
        borderRadius: `${property.borderRadius}px`
      }"
    >
      <div
        class="placeholder"
        :style="{
          justifyContent: property.placeholderPosition
        }"
      >
        <Icon icon="ep:search" />
        <span>{{ property.placeholder || 'Search Products' }}</span>
      </div>
      <div class="right">
        <!-- Search for hot keywords -->
        <span v-for="(keyword, index) in property.hotKeywords" :key="index">{{ keyword }}</span>
        <!-- scan -->
        <Icon icon="ant-design:scan-outlined" v-show="property.showScan" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchProperty } from './config'
/** Search box */
defineOptions({ name: 'SearchBar' })
defineProps<{ property: SearchProperty }>()
</script>

<style scoped lang="scss">
.search-bar {
  /* Search box */
  .inner {
    position: relative;
    display: flex;
    min-height: 28px;
    font-size: 14px;
    align-items: center;

    .placeholder {
      display: flex;
      width: 100%;
      padding: 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      align-items: center;
      gap: 2px;
    }

    .right {
      position: absolute;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  }
}
</style>
