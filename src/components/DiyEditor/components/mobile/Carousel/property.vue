<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-form label-width="80px" :model="formData">
      <el-card header="Style Settings" class="property-group" shadow="never">
        <el-form-item label="Style" prop="type">
          <el-radio-group v-model="formData.type">
            <el-tooltip class="item" content="Default" placement="bottom">
              <el-radio-button value="default">
                <Icon icon="system-uicons:carousel" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip class="item" content="Card" placement="bottom">
              <el-radio-button value="card">
                <Icon icon="ic:round-view-carousel" />
              </el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Indicator" prop="indicator">
          <el-radio-group v-model="formData.indicator">
            <el-radio value="dot">DoT</el-radio>
            <el-radio value="number">Number</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Autoplay" prop="autoplay">
          <el-switch v-model="formData.autoplay" />
        </el-form-item>
        <el-form-item label="Play Interval" prop="interval" v-if="formData.autoplay">
          <el-slider
            v-model="formData.interval"
            :max="10"
            :min="0.5"
            :step="0.5"
            show-input
            input-size="small"
            :show-input-controls="false"
          />
          <el-text type="info">Unit：Second</el-text>
        </el-form-item>
      </el-card>
      <el-card header="Content Settings" class="property-group" shadow="never">
        <Draggable v-model="formData.items" :empty-item="{ type: 'img' }">
          <template #default="{ element }">
            <el-form-item label="Type" prop="type" class="m-b-8px!" label-width="40px">
              <el-radio-group v-model="element.type">
                <el-radio value="img">Image</el-radio>
                <el-radio value="video">Video</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="Image"
              class="m-b-8px!"
              label-width="40px"
              v-if="element.type === 'img'"
            >
              <UploadImg
                v-model="element.imgUrl"
                draggable="false"
                height="80px"
                width="100%"
                class="min-w-80px"
              />
            </el-form-item>
            <template v-else>
              <el-form-item label="Cover" class="m-b-8px!" label-width="40px">
                <UploadImg
                  v-model="element.imgUrl"
                  draggable="false"
                  height="80px"
                  width="100%"
                  class="min-w-80px"
                />
              </el-form-item>
              <el-form-item label="Video" class="m-b-8px!" label-width="40px">
                <UploadFile
                  v-model="element.videoUrl"
                  :file-type="['mp4']"
                  :limit="1"
                  :file-size="100"
                  class="min-w-80px"
                />
              </el-form-item>
            </template>
            <el-form-item label="Link" class="m-b-8px!" label-width="40px">
              <AppLinkInput v-model="element.url" />
            </el-form-item>
          </template>
        </Draggable>
      </el-card>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { CarouselProperty } from './config'
import { useVModel } from '@vueuse/core'

// Carousel attribute panel
defineOptions({ name: 'CarouselProperty' })

const props = defineProps<{ modelValue: CarouselProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
