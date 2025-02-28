<template>
  <el-form label-width="80px" :model="formData">
    <Draggable v-model="formData.list" :empty-item="{ showType: 'once' }">
      <template #default="{ element, index }">
        <el-form-item label="Image" :prop="`list[${index}].imgUrl`">
          <UploadImg v-model="element.imgUrl" height="56px" width="56px" />
        </el-form-item>
        <el-form-item label="Link" :prop="`list[${index}].url`">
          <AppLinkInput v-model="element.url" />
        </el-form-item>
        <el-form-item label="Display Time" :prop="`list[${index}].showType`">
          <el-radio-group v-model="element.showType">
            <el-tooltip content="Display only once，Do not display when opened next time" placement="bottom">
              <el-radio value="once">Once</el-radio>
            </el-tooltip>
            <el-tooltip content="It will display every time it is opened" placement="bottom">
              <el-radio value="always">Unlimited</el-radio>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
      </template>
    </Draggable>
  </el-form>
</template>

<script setup lang="ts">
import { PopoverProperty } from './config'
import { useVModel } from '@vueuse/core'

// Pop up ad attribute panel
defineOptions({ name: 'PopoverProperty' })

const props = defineProps<{ modelValue: PopoverProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
