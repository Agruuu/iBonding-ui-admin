<template>
  <el-form label-width="80px" :model="formData">
    <el-form-item label="Height" prop="height">
      <el-slider v-model="formData.height" :min="1" :max="100" show-input input-size="small" />
    </el-form-item>
    <el-form-item label="Select Style" prop="borderType">
      <el-radio-group v-model="formData!.borderType">
        <el-tooltip
          placement="top"
          v-for="(item, index) in BORDER_TYPES"
          :key="index"
          :content="item.text"
        >
          <el-radio-button :value="item.type">
            <Icon :icon="item.icon" />
          </el-radio-button>
        </el-tooltip>
      </el-radio-group>
    </el-form-item>
    <template v-if="formData.borderType !== 'none'">
      <el-form-item label="Line Width" prop="lineWidth">
        <el-slider v-model="formData.lineWidth" :min="1" :max="30" show-input input-size="small" />
      </el-form-item>
      <el-form-item label="Side Margin" prop="paddingType">
        <el-radio-group v-model="formData!.paddingType">
          <el-tooltip content="Borderless" placement="top">
            <el-radio-button value="none">
              <Icon icon="tabler:box-padding" />
            </el-radio-button>
          </el-tooltip>
          <el-tooltip content="Leave a margin on both sides" placement="top">
            <el-radio-button value="horizontal">
              <Icon icon="vaadin:padding" />
            </el-radio-button>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Colour">
        <!-- Color of dividing line -->
        <ColorInput v-model="formData.lineColor" />
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { DividerProperty } from './config'
import { useVModel } from '@vueuse/core'
// Navigation Bar Properties Panel
defineOptions({ name: 'DividerProperty' })
const props = defineProps<{ modelValue: DividerProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

//Line type
const BORDER_TYPES = [
  {
    icon: 'vaadin:line-h',
    text: 'Solid Line',
    type: 'solid'
  },
  {
    icon: 'tabler:line-dashed',
    text: 'Dashed Line',
    type: 'dashed'
  },
  {
    icon: 'tabler:line-dotted',
    text: 'Dotted Line',
    type: 'dotted'
  },
  {
    icon: 'entypo:progress-empty',
    text: 'None',
    type: 'none'
  }
]
</script>

<style scoped lang="scss"></style>
