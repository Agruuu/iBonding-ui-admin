<template>
  <div class="relative">
    <table class="cube-table">
      <!-- bottom：Rubik's Cube Matrix -->
      <tbody>
        <tr v-for="(rowCubes, row) in cubes" :key="row">
          <td
            v-for="(cube, col) in rowCubes"
            :key="col"
            :class="['cube', { active: cube.active }]"
            :style="{
              width: `${cubeSize}px`,
              height: `${cubeSize}px`
            }"
            @click="handleCubeClick(row, col)"
            @mouseenter="handleCellHover(row, col)"
          >
            <Icon icon="ep-plus" />
          </td>
        </tr>
      </tbody>
      <!-- top floor：Hot Zone -->
      <div
        v-for="(hotArea, index) in hotAreas"
        :key="index"
        class="hot-area"
        :style="{
          top: `${cubeSize * hotArea.top}px`,
          left: `${cubeSize * hotArea.left}px`,
          height: `${cubeSize * hotArea.height}px`,
          width: `${cubeSize * hotArea.width}px`
        }"
        @click="handleHotAreaSelected(hotArea, index)"
        @mouseover="exitHotAreaSelectMode"
      >
        <!-- Delete button for hot zone in the upper right corner -->
        <div
          v-if="selectedHotAreaIndex === index"
          class="btn-delete"
          @click="handleDeleteHotArea(index)"
        >
          <Icon icon="ep:circle-close-filled" />
        </div>
        {{ `${hotArea.width}×${hotArea.height}` }}
      </div>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import * as vueTypes from 'vue-types'
import { Point, Rect, isContains, isOverlap, createRect } from './util'

// Cube Editor
// It consists of two parts：
// 1. Rubik's Cube Matrix：Located at the bottom level，A two-dimensional table composed of block components，Used to create hot zones
//    Operation method：
//    1.1 Clicking on one of the blocks will enter the hotspot selection mode
//    1.2 When clicking on another block again，End the hot zone selection mode
//    1.3 Create a hot zone in the area between two blocks
//    If both clicks are on the same square，Just create a hot zone with only one grid
// 2. Hot Zone：Located on the top floor，Adopting absolute positioning，Covering the Rubik's Cube Matrix。
defineOptions({ name: 'MagicCubeEditor' })

/**
 * block
 * @property active Is it activated
 */
type Cube = Point & { active: boolean }

// Define attributes
const props = defineProps({
  // Hot Zone List
  modelValue: vueTypes.array<any>().isRequired,
  // Number of rows，default 4 row
  rows: propTypes.number.def(4),
  // Number of columns，default 4 column
  cols: propTypes.number.def(4),
  // Block size，Companypx，default75px
  cubeSize: propTypes.number.def(75)
})

// Rubik's Cube Matrix：All the blocks
const cubes = ref<Cube[][]>([])
// Number of monitoring lines、Change in number of columns
watch(
  () => [props.rows, props.cols],
  () => {
    // Clear the Rubik's Cube
    cubes.value = []
    if (!props.rows || !props.cols) return

    // Initialize Rubik's Cube
    for (let row = 0; row < props.rows; row++) {
      cubes.value[row] = []
      for (let col = 0; col < props.cols; col++) {
        cubes.value[row].push({ x: col, y: row, active: false })
      }
    }
  },
  { immediate: true }
)

// Hot Zone List
const hotAreas = ref<Rect[]>([])
// Initialize hot zone
watch(
  () => props.modelValue,
  () => (hotAreas.value = props.modelValue || []),
  { immediate: true }
)

// Starting block of hot zone
const hotAreaBeginCube = ref<Cube>()
// Has the hot zone selection mode been enabled
const isHotAreaSelectMode = () => !!hotAreaBeginCube.value
/**
 * Processing mouse clicks on blocks
 *
 * @param currentRow Current line number
 * @param currentCol Current column number
 */
const handleCubeClick = (currentRow: number, currentCol: number) => {
  const currentCube = cubes.value[currentRow][currentCol]
  // situation1：Enter the hot zone selection mode
  if (!isHotAreaSelectMode()) {
    hotAreaBeginCube.value = currentCube
    hotAreaBeginCube.value.active = true
    return
  }

  // situation2：End the hot zone selection mode
  hotAreas.value.push(createRect(hotAreaBeginCube.value!, currentCube))
  // End the hot zone selection mode
  exitHotAreaSelectMode()
  // Select the hotspot after creation
  let hotAreaIndex = hotAreas.value.length - 1
  handleHotAreaSelected(hotAreas.value[hotAreaIndex], hotAreaIndex)
  // Send notification of hot zone changes
  emitUpdateModelValue()
}
/**
 * Process mouse passing through blocks
 *
 * @param currentRow Current line number
 * @param currentCol Current column number
 */
const handleCellHover = (currentRow: number, currentCol: number) => {
  // Currently not in hot zone selection mode
  if (!isHotAreaSelectMode()) return

  // The currently selected area
  const currentSelectedArea = createRect(
    hotAreaBeginCube.value!,
    cubes.value[currentRow][currentCol]
  )
  // Hot zones are not allowed to overlap
  for (const hotArea of hotAreas.value) {
    // Check for overlap
    if (isOverlap(hotArea, currentSelectedArea)) {
      // End the hot zone selection mode
      exitHotAreaSelectMode()

      return
    }
  }

  // Activate the blocks inside the selected area
  eachCube((_, __, cube) => {
    cube.active = isContains(currentSelectedArea, cube)
  })
}
/**
 * Handling hot zone deletion
 *
 * @param index Hot Zone Index
 */
const handleDeleteHotArea = (index: number) => {
  hotAreas.value.splice(index, 1)
  // End the hot zone selection mode
  exitHotAreaSelectMode()
  // Send notification of hot zone changes
  emitUpdateModelValue()
}

// Send model updates
const emit = defineEmits(['update:modelValue', 'hotAreaSelected'])
// Send notification of hot zone changes
const emitUpdateModelValue = () => emit('update:modelValue', hotAreas)

// Hot Zone Selection
const selectedHotAreaIndex = ref(0)
const handleHotAreaSelected = (hotArea: Rect, index: number) => {
  selectedHotAreaIndex.value = index
  emit('hotAreaSelected', hotArea, index)
}

/**
 * End the hot zone selection mode
 */
function exitHotAreaSelectMode() {
  // Remove block activation marker
  eachCube((_, __, cube) => {
    if (cube.active) {
      cube.active = false
    }
  })

  // Clear starting point
  hotAreaBeginCube.value = undefined
}

/**
 * Iterative Rubik's Cube Matrix
 * @param callback Callback
 */
const eachCube = (callback: (x: number, y: number, cube: Cube) => void) => {
  for (let x = 0; x < cubes.value.length; x++) {
    for (let y = 0; y < cubes.value[x].length; y++) {
      callback(x, y, cubes.value[x][y])
    }
  }
}
</script>
<style lang="scss" scoped>
.cube-table {
  position: relative;
  border-spacing: 0;
  border-collapse: collapse;

  .cube {
    border: 1px solid var(--el-border-color);
    text-align: center;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    box-sizing: border-box;
    &.active {
      background: var(--el-color-primary-light-9);
    }
  }

  .hot-area {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--el-color-primary);
    background: var(--el-color-primary-light-8);
    color: var(--el-color-primary);
    box-sizing: border-box;
    border-spacing: 0;
    border-collapse: collapse;
    cursor: pointer;

    .btn-delete {
      z-index: 1;
      position: absolute;
      top: -8px;
      right: -8px;
      height: 16px;
      width: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
</style>
