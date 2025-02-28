<template>
  <el-form label-width="80px" :model="formData" :rules="rules">
    <el-form-item label="Style" prop="styleType">
      <el-radio-group v-model="formData!.styleType">
        <el-radio value="normal">Standard</el-radio>
        <el-tooltip
          content="The immersive header is only supported on WeChat Mini Programs and APPs. It is recommended that the first component on the page be an image display component."
          placement="top"
        >
          <el-radio value="inner">Immersive</el-radio>
        </el-tooltip>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Resident Display" prop="alwaysShow" v-if="formData.styleType === 'inner'">
      <el-radio-group v-model="formData!.alwaysShow">
        <el-radio :value="false">Close</el-radio>
        <el-tooltip content="After the permanent display is turned off,The header widget will fade in when sliding on the page" placement="top">
          <el-radio :value="true">Open</el-radio>
        </el-tooltip>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Background Type" prop="bgType">
      <el-radio-group v-model="formData.bgType">
        <el-radio value="color">Solid Color</el-radio>
        <el-radio value="img">Image</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Background Color" prop="bgColor" v-if="formData.bgType === 'color'">
      <ColorInput v-model="formData.bgColor" />
    </el-form-item>
    <el-form-item label="Background Image" prop="bgImg" v-else>
      <UploadImg v-model="formData.bgImg" :limit="1" width="56px" height="56px" />
    </el-form-item>
    <el-card class="property-group" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span>Content（Mini Program）</span>
          <el-form-item prop="_local.previewMp" class="m-b-0!">
            <el-checkbox
              v-model="formData._local.previewMp"
              @change="formData._local.previewOther = !formData._local.previewMp"
              >Preview</el-checkbox
            >
          </el-form-item>
        </div>
      </template>
      <NavigationBarCellProperty v-model="formData.mpCells" is-mp />
    </el-card>
    <el-card class="property-group" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span>Content（Non Mini Program）</span>
          <el-form-item prop="_local.previewOther" class="m-b-0!">
            <el-checkbox
              v-model="formData._local.previewOther"
              @change="formData._local.previewMp = !formData._local.previewOther"
              >Preview</el-checkbox
            >
          </el-form-item>
        </div>
      </template>
      <NavigationBarCellProperty v-model="formData.otherCells" :is-mp="false" />
    </el-card>
  </el-form>
</template>

<script setup lang="ts">
import { NavigationBarProperty } from './config'
import { useVModel } from '@vueuse/core'
import NavigationBarCellProperty from '@/components/DiyEditor/components/mobile/NavigationBar/components/CellProperty.vue'
// Navigation Bar Properties Panel
defineOptions({ name: 'NavigationBarProperty' })
// Form verification
const rules = {
  name: [{ required: true, message: 'Please enter the page name', trigger: 'blur' }]
}

const props = defineProps<{ modelValue: NavigationBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
if (!formData.value._local) {
  formData.value._local = { previewMp: true, previewOther: false }
}
</script>

<style scoped lang="scss"></style>
