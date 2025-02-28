<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-form label-width="80px" :model="formData" :rules="rules">
      <el-form-item label="Notice Icon" prop="iconUrl">
        <UploadImg v-model="formData.iconUrl" height="48px">
          <template #tip>Suggested Size：24 * 24</template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="Background Color" prop="backgroundColor">
        <ColorInput v-model="formData.backgroundColor" />
      </el-form-item>
      <el-form-item label="Text Color" prop="Text Color">
        <ColorInput v-model="formData.textColor" />
      </el-form-item>
      <el-card header="Notice Content" class="property-group" shadow="never">
        <Draggable v-model="formData.contents">
          <template #default="{ element }">
            <el-form-item label="Notice" prop="text" label-width="40px">
              <el-input v-model="element.text" placeholder="Please enter the notice" />
            </el-form-item>
            <el-form-item label="Link" prop="url" label-width="40px">
              <AppLinkInput v-model="element.url" />
            </el-form-item>
          </template>
        </Draggable>
      </el-card>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { NoticeBarProperty } from './config'
import { useVModel } from '@vueuse/core'
// Notification Bar Properties Panel
defineOptions({ name: 'NoticeBarProperty' })
// Form verification
const rules = {
  content: [{ required: true, message: 'Please enter the announcement', trigger: 'blur' }]
}

const props = defineProps<{ modelValue: NoticeBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
