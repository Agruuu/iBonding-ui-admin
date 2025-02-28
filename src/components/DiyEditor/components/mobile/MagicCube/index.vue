<template>
  <div
    class="relative"
    :style="{ height: `${rowCount * CUBE_SIZE}px`, width: `${4 * CUBE_SIZE}px` }"
  >
    <div
      v-for="(item, index) in property.list"
      :key="index"
      class="absolute"
      :style="{
        width: `${item.width * CUBE_SIZE - property.space * 2}px`,
        height: `${item.height * CUBE_SIZE - property.space * 2}px`,
        margin: `${property.space}px`,
        top: `${item.top * CUBE_SIZE}px`,
        left: `${item.left * CUBE_SIZE}px`
      }"
    >
      <el-image
        class="h-full w-full"
        fit="cover"
        :src="item.imgUrl"
        :style="{
          borderTopLeftRadius: `${property.borderRadiusTop}px`,
          borderTopRightRadius: `${property.borderRadiusTop}px`,
          borderBottomLeftRadius: `${property.borderRadiusBottom}px`,
          borderBottomRightRadius: `${property.borderRadiusBottom}px`
        }"
      >
        <template #error>
          <div class="image-slot">
            <div
              class="flex items-center justify-center"
              :style="{
                width: `${item.width * CUBE_SIZE}px`,
                height: `${item.height * CUBE_SIZE}px`
              }"
            >
              <Icon icon="ep-picture" color="gray" :size="CUBE_SIZE" />
            </div>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagicCubeProperty } from './config'

/** Advertising Magic Cube */
defineOptions({ name: 'MagicCube' })
const props = defineProps<{ property: MagicCubeProperty }>()
// The size of a square
const CUBE_SIZE = 93.75
/**
 * Calculate the number of rows in a block
 * The number of rows is used to calculate the overall height of the Rubik's Cube，There are the following situations：
 * 1. When there is no data available，By default, only one line of height is displayed
 * 2. The blank space at the bottom is not considered as height，For example, only the first row has data，So only display the height of one line
 * 3. Calculate the height of the blank space at the top and middle，For example, there are a total of four lines，Only the last row has data，So also display the height of four rows
 */
const rowCount = computed(() => {
  let count = 0
  if (props.property.list.length > 0) {
    // Maximum line number
    count = Math.max(...props.property.list.map((item) => item.bottom))
  }
  // The line number starts from 0, so add 1.
  return count + 1
})
</script>

<style scoped lang="scss"></style>
