<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-form label-width="80px" :model="formData">
      <el-card header="Product List" class="property-group" shadow="never">
        <SpuShowcase v-model="formData.spuIds" />
      </el-card>
      <el-card header="Product Style" class="property-group" shadow="never">
        <el-form-item label="Layout" prop="type">
          <el-radio-group v-model="formData.layoutType">
            <el-tooltip class="item" content="Double Row" placement="bottom">
              <el-radio-button value="twoCol">
                <Icon icon="fluent:text-column-two-24-filled" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip class="item" content="Three Columns" placement="bottom">
              <el-radio-button value="threeCol">
                <Icon icon="fluent:text-column-three-24-filled" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip class="item" content="Horizontal Sliding" placement="bottom">
              <el-radio-button value="horizSwiper">
                <Icon icon="system-uicons:carousel" />
              </el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Name" prop="fields.name.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.name.color" />
            <el-checkbox v-model="formData.fields.name.show" />
          </div>
        </el-form-item>
        <el-form-item label="Price" prop="fields.price.show">
          <div class="flex gap-8px">
            <ColorInput v-model="formData.fields.price.color" />
            <el-checkbox v-model="formData.fields.price.show" />
          </div>
        </el-form-item>
      </el-card>
      <el-card header="Badge" class="property-group" shadow="never">
        <el-form-item label="Badge" prop="badge.show">
          <el-switch v-model="formData.badge.show" />
        </el-form-item>
        <el-form-item label="Badge" prop="badge.imgUrl" v-if="formData.badge.show">
          <UploadImg v-model="formData.badge.imgUrl" height="44px" width="72px">
            <template #tip> Suggested Size：36 * 22 </template>
          </UploadImg>
        </el-form-item>
      </el-card>
      <el-card header="Product Style" class="property-group" shadow="never">
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
      </el-card>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { ProductListProperty } from './config'
import { useVModel } from '@vueuse/core'
import SpuShowcase from '@/views/mall/product/spu/components/SpuShowcase.vue'

// Product Bar Attributes Panel
defineOptions({ name: 'ProductListProperty' })

const props = defineProps<{ modelValue: ProductListProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
