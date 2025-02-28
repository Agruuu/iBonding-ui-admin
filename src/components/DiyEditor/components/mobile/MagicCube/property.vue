<template>
  <ComponentContainerProperty v-model="formData.style">
    <!-- form  -->
    <el-form label-width="80px" :model="formData" class="m-t-8px">
      <el-text tag="p"> Cube Settings </el-text>
      <el-text type="info" size="small"> Each Grid Size 187 * 187 </el-text>
      <MagicCubeEditor
        class="m-y-16px"
        v-model="formData.list"
        :rows="4"
        :cols="4"
        @hot-area-selected="handleHotAreaSelected"
      />
      <template v-for="(hotArea, index) in formData.list" :key="index">
        <template v-if="selectedHotAreaIndex === index">
          <el-form-item label="Upload Image" :prop="`list[${index}].imgUrl`">
            <UploadImg v-model="hotArea.imgUrl" height="80px" width="80px" />
          </el-form-item>
          <el-form-item label="Link" :prop="`list[${index}].url`">
            <AppLinkInput v-model="hotArea.url" />
          </el-form-item>
        </template>
      </template>
      <el-form-item label="Top Rounded Corner" prop="borderRadiusTop">
        <el-slider
          v-model="formData.borderRadiusTop"
          :max="100"
          :min="0"
          show-input
          input-size="small"
          :show-input-controls="false"
        />
      </el-form-item>
      <el-form-item label="Bottom Rounded Corner" prop="borderRadiusBottom">
        <el-slider
          v-model="formData.borderRadiusBottom"
          :max="100"
          :min="0"
          show-input
          input-size="small"
          :show-input-controls="false"
        />
      </el-form-item>
      <el-form-item label="Interval" prop="space">
        <el-slider
          v-model="formData.space"
          :max="100"
          :min="0"
          show-input
          input-size="small"
          :show-input-controls="false"
        />
      </el-form-item>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { MagicCubeProperty } from '@/components/DiyEditor/components/mobile/MagicCube/config'

/** Advertising Magic Cube Attribute Panel */
defineOptions({ name: 'MagicCubeProperty' })

const props = defineProps<{ modelValue: MagicCubeProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

// Selected hot zone
const selectedHotAreaIndex = ref(-1)
const handleHotAreaSelected = (_: any, index: number) => {
  selectedHotAreaIndex.value = index
}
</script>

<style scoped lang="scss"></style>
