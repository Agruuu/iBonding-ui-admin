<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-form label-width="80px" :model="formData">
      <el-form-item label="Upload Image" prop="imgUrl">
        <UploadImg
          v-model="formData.imgUrl"
          draggable="false"
          height="80px"
          width="100%"
          class="min-w-80px"
        >
          <template #tip> Suggested Width 750 </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="Link" prop="url">
        <AppLinkInput v-model="formData.url" />
      </el-form-item>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { ImageBarProperty } from './config'
import { useVModel } from '@vueuse/core'

// Image Display Properties Panel
defineOptions({ name: 'ImageBarProperty' })

const props = defineProps<{ modelValue: ImageBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
