<template>
  <div class="h-40px flex items-center justify-center">
    <MagicCubeEditor
      v-model="cellList"
      :cols="cellCount"
      :cube-size="38"
      :rows="1"
      class="m-b-16px"
      @hot-area-selected="handleHotAreaSelected"
    />
    <img v-if="isMp" alt="" class="h-30px w-76px" src="@/assets/imgs/diy/app-nav-bar-mp.png" />
  </div>
  <template v-for="(cell, cellIndex) in cellList" :key="cellIndex">
    <template v-if="selectedHotAreaIndex === cellIndex">
      <el-form-item :prop="`cell[${cellIndex}].type`" label="Type">
        <el-radio-group v-model="cell.type">
          <el-radio value="text">Text</el-radio>
          <el-radio value="image">Image</el-radio>
          <el-radio value="search">Search</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 1. text -->
      <template v-if="cell.type === 'text'">
        <el-form-item :prop="`cell[${cellIndex}].text`" label="Content">
          <el-input v-model="cell!.text" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item :prop="`cell[${cellIndex}].text`" label="Colour">
          <ColorInput v-model="cell!.textColor" />
        </el-form-item>
        <el-form-item :prop="`cell[${cellIndex}].url`" label="Link">
          <AppLinkInput v-model="cell.url" />
        </el-form-item>
      </template>
      <!-- 2. picture -->
      <template v-else-if="cell.type === 'image'">
        <el-form-item :prop="`cell[${cellIndex}].imgUrl`" label="Image">
          <UploadImg v-model="cell.imgUrl" :limit="1" height="56px" width="56px">
            <template #tip>Suggested Size 56*56</template>
          </UploadImg>
        </el-form-item>
        <el-form-item :prop="`cell[${cellIndex}].url`" label="Link">
          <AppLinkInput v-model="cell.url" />
        </el-form-item>
      </template>
      <!-- 3. Search box -->
      <template v-else>
        <el-form-item :prop="`cell[${cellIndex}].placeholder`" label="Prompt Text">
          <el-input v-model="cell.placeholder" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item :prop="`cell[${cellIndex}].borderRadius`" label="Fillet">
          <el-slider
            v-model="cell.borderRadius"
            :max="100"
            :min="0"
            :show-input-controls="false"
            input-size="small"
            show-input
          />
        </el-form-item>
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { NavigationBarCellProperty } from '../config'
import { useVModel } from '@vueuse/core'
// Navigation Bar Properties Panel
defineOptions({ name: 'NavigationBarCellProperty' })

const props = withDefaults(
  defineProps<{
    modelValue: NavigationBarCellProperty[]
    isMp: boolean
  }>(),
  {
    modelValue: () => [],
    isMp: true
  }
)
const emit = defineEmits(['update:modelValue'])
const cellList = useVModel(props, 'modelValue', emit)

// Number of cells: 6 for mini - programs (the capsule buttons on the right take up 2), and 8 for other platforms.
const cellCount = computed(() => (props.isMp ? 6 : 8))

// Selected hot zone
const selectedHotAreaIndex = ref(0)
const handleHotAreaSelected = (cellValue: NavigationBarCellProperty, index: number) => {
  selectedHotAreaIndex.value = index
  if (!cellValue.type) {
    cellValue.type = 'text'
    cellValue.textColor = '#111111'
  }
}
</script>

<style lang="scss" scoped></style>
