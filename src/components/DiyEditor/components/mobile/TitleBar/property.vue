<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-form :model="formData" :rules="rules" label-width="85px">
      <el-card class="property-group" header="Style" shadow="never">
        <el-form-item label="Title Position" prop="textAlign">
          <el-radio-group v-model="formData!.textAlign">
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
      </el-card>
      <el-card class="property-group" header="Main Title" shadow="never">
        <el-form-item label="Text" label-width="40px" prop="title">
          <InputWithColor
            v-model="formData.title"
            v-model:color="formData.titleColor"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Size" label-width="40px" prop="titleSize">
          <el-slider
            v-model="formData.titleSize"
            :max="60"
            :min="10"
            input-size="small"
            show-input
          />
        </el-form-item>
        <el-form-item label="Thickness" label-width="40px" prop="titleWeight">
          <el-slider
            v-model="formData.titleWeight"
            :max="900"
            :min="100"
            :step="100"
            input-size="small"
            show-input
          />
        </el-form-item>
      </el-card>
      <el-card class="property-group" header="Subtitle" shadow="never">
        <el-form-item label="Text" label-width="40px" prop="description">
          <InputWithColor
            v-model="formData.description"
            v-model:color="formData.descriptionColor"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Size" label-width="40px" prop="descriptionSize">
          <el-slider
            v-model="formData.descriptionSize"
            :max="60"
            :min="10"
            input-size="small"
            show-input
          />
        </el-form-item>
        <el-form-item label="Thickness" label-width="40px" prop="descriptionWeight">
          <el-slider
            v-model="formData.descriptionWeight"
            :max="900"
            :min="100"
            :step="100"
            input-size="small"
            show-input
          />
        </el-form-item>
      </el-card>
      <el-card class="property-group" header="View More" shadow="never">
        <el-form-item label="Show" prop="more.show">
          <el-checkbox v-model="formData.more.show" />
        </el-form-item>
        <!-- More buttons Style selection -->
        <template v-if="formData.more.show">
          <el-form-item label="Style" prop="more.type">
            <el-radio-group v-model="formData.more.type">
              <el-radio value="text">Text</el-radio>
              <el-radio value="icon">Icon</el-radio>
              <el-radio value="all">Text+Icon</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="formData.more.type !== 'icon'" label="More Text" prop="more.text">
            <el-input v-model="formData.more.text" />
          </el-form-item>
          <el-form-item label="Link" prop="more.url">
            <AppLinkInput v-model="formData.more.url" />
          </el-form-item>
        </template>
      </el-card>
    </el-form>
  </ComponentContainerProperty>
</template>
<script lang="ts" setup>
import { TitleBarProperty } from './config'
import { useVModel } from '@vueuse/core'
// Navigation Bar Properties Panel
defineOptions({ name: 'TitleBarProperty' })

const props = defineProps<{ modelValue: TitleBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

// Form verification
const rules = {}
</script>

<style lang="scss" scoped></style>
