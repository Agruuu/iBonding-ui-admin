<template>
  <ComponentContainerProperty v-model="formData.style">
    <!-- form  -->
    <el-form label-width="80px" :model="formData" class="m-t-8px">
      <el-card header="Search Hot Words" class="property-group" shadow="never">
        <Draggable v-model="formData.hotKeywords" :empty-item="''">
          <template #default="{ index }">
            <el-input v-model="formData.hotKeywords[index]" placeholder="Please enter hot words" />
          </template>
        </Draggable>
      </el-card>
      <el-card header="Search Style" class="property-group" shadow="never">
        <el-form-item label="Frame Style">
          <el-radio-group v-model="formData!.borderRadius">
            <el-tooltip content="Square" placement="top">
              <el-radio-button :value="0">
                <Icon icon="tabler:input-search" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip content="Rotundity" placement="top">
              <el-radio-button :value="10">
                <Icon icon="iconoir:input-search" />
              </el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Prompt Text" prop="placeholder">
          <el-input v-model="formData.placeholder" />
        </el-form-item>
        <el-form-item label="Text Position" prop="placeholderPosition">
          <el-radio-group v-model="formData!.placeholderPosition">
            <el-tooltip content="Left Side" placement="top">
              <el-radio-button value="left">
                <Icon icon="ant-design:align-left-outlined" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip content="Centered" placement="top">
              <el-radio-button value="center">
                <Icon icon="ant-design:align-center-outlined" />
              </el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Scan" prop="showScan">
          <el-switch v-model="formData!.showScan" />
        </el-form-item>
        <el-form-item label="Frame Height" prop="height">
          <el-slider v-model="formData!.height" :max="50" :min="28" show-input input-size="small" />
        </el-form-item>
        <el-form-item label="Frame Color" prop="backgroundColor">
          <ColorInput v-model="formData.backgroundColor" />
        </el-form-item>
        <el-form-item class="lef" label="Text Color" prop="textColor">
          <ColorInput v-model="formData.textColor" />
        </el-form-item>
      </el-card>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { SearchProperty } from '@/components/DiyEditor/components/mobile/SearchBar/config'

/** Search Box Properties Panel */
defineOptions({ name: 'SearchProperty' })

const props = defineProps<{ modelValue: SearchProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
