<template>
  <el-form label-width="80px" :model="formData" :rules="rules">
    <el-form-item label="Page Description" prop="description">
      <el-input
        type="textarea"
        v-model="formData!.description"
        placeholder="When users share with friends through WeChat，Automatically display page description"
      />
    </el-form-item>
    <el-form-item label="Background Color" prop="backgroundColor">
      <ColorInput v-model="formData!.backgroundColor" />
    </el-form-item>
    <el-form-item label="Background Image" prop="backgroundImage">
      <UploadImg v-model="formData!.backgroundImage" :limit="1">
        <template #tip>Suggested Width 750px</template>
      </UploadImg>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { PageConfigProperty } from './config'
import { useVModel } from '@vueuse/core'
// Navigation Bar Properties Panel
defineOptions({ name: 'PageConfigProperty' })
// Form verification
const rules = {}

const props = defineProps<{ modelValue: PageConfigProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
