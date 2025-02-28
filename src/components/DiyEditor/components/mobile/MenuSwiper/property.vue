<template>
  <ComponentContainerProperty v-model="formData.style">
    <!-- form  -->
    <el-form label-width="80px" :model="formData" class="m-t-8px">
      <el-form-item label="layout" prop="layout">
        <el-radio-group v-model="formData.layout">
          <el-radio value="iconText">icon + text</el-radio>
          <el-radio value="icon">icon only</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Number of rows" prop="row">
        <el-radio-group v-model="formData.row">
          <el-radio :value="1">1 row</el-radio>
          <el-radio :value="2">2 row</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Number of columns" prop="column">
        <el-radio-group v-model="formData.column">
          <el-radio :value="3">3 column</el-radio>
          <el-radio :value="4">4 column</el-radio>
          <el-radio :value="5">5 column</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-card header="Menu settings" class="property-group" shadow="never">
        <Draggable v-model="formData.list" :empty-item="cloneDeep(EMPTY_MENU_SWIPER_ITEM_PROPERTY)">
          <template #default="{ element }">
            <el-form-item label="Icon" prop="iconUrl">
              <UploadImg v-model="element.iconUrl" height="80px" width="80px">
                <template #tip> Suggested size：98 * 98 </template>
              </UploadImg>
            </el-form-item>
            <el-form-item label="title" prop="title">
              <InputWithColor v-model="element.title" v-model:color="element.titleColor" />
            </el-form-item>
            <el-form-item label="link" prop="url">
              <AppLinkInput v-model="element.url" />
            </el-form-item>
            <el-form-item label="Display corner marker" prop="badge.show">
              <el-switch v-model="element.badge.show" />
            </el-form-item>
            <template v-if="element.badge.show">
              <el-form-item label="Corner label content" prop="badge.text">
                <InputWithColor
                  v-model="element.badge.text"
                  v-model:color="element.badge.textColor"
                />
              </el-form-item>
              <el-form-item label="background color " prop="badge.bgColor">
                <ColorInput v-model="element.badge.bgColor" />
              </el-form-item>
            </template>
          </template>
        </Draggable>
      </el-card>
    </el-form>
  </ComponentContainerProperty>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import {
  EMPTY_MENU_SWIPER_ITEM_PROPERTY,
  MenuSwiperProperty
} from '@/components/DiyEditor/components/mobile/MenuSwiper/config'
import { cloneDeep } from 'lodash-es'

/** Menu Navigation Properties Panel */
defineOptions({ name: 'MenuSwiperProperty' })

const props = defineProps<{ modelValue: MenuSwiperProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss"></style>
