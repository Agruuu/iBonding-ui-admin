<template>
  <el-form label-width="80px" :model="formData">
    <el-card header="Button Config" class="property-group" shadow="never">
      <el-form-item label="Expand Direction" prop="direction">
        <el-radio-group v-model="formData.direction">
          <el-radio value="vertical">Vertical</el-radio>
          <el-radio value="horizontal">Level</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Display Text" prop="showText">
        <el-switch v-model="formData.showText" />
      </el-form-item>
    </el-card>
    <el-card header="Button List" class="property-group" shadow="never">
      <Draggable v-model="formData.list" :empty-item="{ textColor: '#fff' }">
        <template #default="{ element, index }">
          <el-form-item label="Image" :prop="`list[${index}].imgUrl`">
            <UploadImg v-model="element.imgUrl" height="56px" width="56px" />
          </el-form-item>
          <el-form-item label="Text" :prop="`list[${index}].text`">
            <InputWithColor v-model="element.text" v-model:color="element.textColor" />
          </el-form-item>
          <el-form-item label="Link" :prop="`list[${index}].url`">
            <AppLinkInput v-model="element.url" />
          </el-form-item>
        </template>
      </Draggable>
    </el-card>
  </el-form>
</template>

<script setup lang="ts">
import { FloatingActionButtonProperty } from './config'
import { useVModel } from '@vueuse/core'

// Suspended button attribute panel
defineOptions({ name: 'FloatingActionButtonProperty' })

const props = defineProps<{ modelValue: FloatingActionButtonProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
