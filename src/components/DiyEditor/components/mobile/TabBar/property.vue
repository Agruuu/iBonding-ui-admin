<template>
  <div class="tab-bar">
    <!-- form  -->
    <el-form :model="formData" label-width="80px">
      <el-form-item label="Theme" prop="theme">
        <el-select v-model="formData!.theme" @change="handleThemeChange">
          <el-option
            v-for="(theme, index) in THEME_LIST"
            :key="index"
            :label="theme.name"
            :value="theme.id"
          >
            <template #default>
              <div class="flex items-center justify-between">
                <Icon :icon="theme.icon" :color="theme.color" />
                <span>{{ theme.name }}</span>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Default Color">
        <ColorInput v-model="formData!.style.color" />
      </el-form-item>
      <el-form-item label="Select Color">
        <ColorInput v-model="formData!.style.activeColor" />
      </el-form-item>
      <el-form-item label="Navigation Background">
        <el-radio-group v-model="formData!.style.bgType">
          <el-radio-button value="color">Solid Color</el-radio-button>
          <el-radio-button value="img">Image</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Choose Color" v-if="formData!.style.bgType === 'color'">
        <ColorInput v-model="formData!.style.bgColor" />
      </el-form-item>
      <el-form-item label="Select Image" v-if="formData!.style.bgType === 'img'">
        <UploadImg v-model="formData!.style.bgImg" width="100%" height="50px" class="min-w-200px">
          <template #tip> Suggested Size 375 * 50 </template>
        </UploadImg>
      </el-form-item>

      <el-text tag="p">Icon Settings</el-text>
      <el-text type="info" size="small"> Drag the small circular dot in the upper left corner to sort it, Suggested icon size 44*44 </el-text>
      <Draggable v-model="formData.items" :limit="5">
        <template #default="{ element }">
          <div class="m-b-8px flex items-center justify-around">
            <div class="flex flex-col items-center justify-between">
              <UploadImg
                v-model="element.iconUrl"
                width="40px"
                height="40px"
                :show-delete="false"
                :show-btn-text="false"
              />
              <el-text size="small">Unchecked</el-text>
            </div>
            <div>
              <UploadImg
                v-model="element.activeIconUrl"
                width="40px"
                height="40px"
                :show-delete="false"
                :show-btn-text="false"
              />
              <el-text>Selected</el-text>
            </div>
          </div>
          <el-form-item prop="text" label="Text" label-width="48px" class="m-b-8px!">
            <el-input v-model="element.text" placeholder="Please enter text" />
          </el-form-item>
          <el-form-item prop="url" label="Link" label-width="48px" class="m-b-0!">
            <AppLinkInput v-model="element.url" />
          </el-form-item>
        </template>
      </Draggable>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { TabBarProperty, component, THEME_LIST } from './config'
import { useVModel } from '@vueuse/core'
// Bottom navigation bar
defineOptions({ name: 'TabBarProperty' })

const props = defineProps<{ modelValue: TabBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

// Update the database values to the attribute bar on the right
component.property.items = formData.value.items

// The desired theme
const handleThemeChange = () => {
  const theme = THEME_LIST.find((theme) => theme.id === formData.value.theme)
  if (theme?.color) {
    formData.value.style.activeColor = theme.color
  }
}
</script>

<style lang="scss" scoped></style>
