<template>
  <ComponentContainerProperty v-model="formData.style">
    <el-text tag="p"> Menu Settings </el-text>
    <el-text type="info" size="small"> Drag the small dot on the left to adjust the order </el-text>

    <!-- form  -->
    <el-form label-width="60px" :model="formData" class="m-t-8px">
      <Draggable v-model="formData.list" :empty-item="EMPTY_MENU_LIST_ITEM_PROPERTY">
        <template #default="{ element }">
          <el-form-item label="Icon" prop="iconUrl">
            <UploadImg v-model="element.iconUrl" height="80px" width="80px">
              <template #tip> Suggested Size：44 * 44 </template>
            </UploadImg>
          </el-form-item>
          <el-form-item label="Title" prop="title">
            <InputWithColor v-model="element.title" v-model:color="element.titleColor" />
          </el-form-item>
          <el-form-item label="Subtitle" prop="subtitle">
            <InputWithColor v-model="element.subtitle" v-model:color="element.subtitleColor" />
          </el-form-item>
          <el-form-item label="Link" prop="url">
            <AppLinkInput v-model="element.url" />
          </el-form-item>
        </template>
      </Draggable>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import {
  EMPTY_MENU_LIST_ITEM_PROPERTY,
  MenuListProperty
} from '@/components/DiyEditor/components/mobile/MenuList/config'

/** List Navigation Properties Panel */
defineOptions({ name: 'MenuListProperty' })

const props = defineProps<{ modelValue: MenuListProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
