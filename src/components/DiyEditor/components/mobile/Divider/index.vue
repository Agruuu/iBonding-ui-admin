<template>
  <div
    class="flex items-center"
    :style="{
      height: property.height + 'px'
    }"
  >
    <div
      class="w-full"
      :style="{
        borderTopStyle: property.borderType,
        borderTopColor: property.lineColor,
        borderTopWidth: `${property.lineWidth}px`,
        margin: property.paddingType === 'none' ? '0' : '0px 16px'
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { DividerProperty } from './config'

/** Top navigation bar of the page */
defineOptions({ name: 'Divider' })

defineProps<{ property: DividerProperty }>()
</script>

<style scoped lang="scss"></style>
