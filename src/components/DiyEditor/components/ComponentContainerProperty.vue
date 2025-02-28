<template>
  <el-tabs stretch>
    <!-- Custom content for each component -->
    <el-tab-pane label="Content" v-if="$slots.default">
      <slot></slot>
    </el-tab-pane>

    <!-- Common content of each component -->
    <el-tab-pane label="Style" lazy>
      <el-card header="Component Style" class="property-group">
        <el-form :model="formData" label-width="80px">
          <el-form-item label="Component Background" prop="bgType">
            <el-radio-group v-model="formData.bgType">
              <el-radio value="color">Solid Color</el-radio>
              <el-radio value="img">Image</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Choose Color" prop="bgColor" v-if="formData.bgType === 'color'">
            <ColorInput v-model="formData.bgColor" />
          </el-form-item>
          <el-form-item label="Upload Image" prop="bgImg" v-else>
            <UploadImg v-model="formData.bgImg" :limit="1">
              <template #tip>Suggested Sidth 750px</template>
            </UploadImg>
          </el-form-item>
          <el-tree :data="treeData" :expand-on-click-node="false" default-expand-all>
            <template #default="{ node, data }">
              <el-form-item
                :label="data.label"
                :prop="data.prop"
                :label-width="node.level === 1 ? '80px' : '62px'"
                class="w-full m-b-0!"
              >
                <el-slider
                  v-model="formData[data.prop]"
                  :max="100"
                  :min="0"
                  show-input
                  input-size="small"
                  :show-input-controls="false"
                  @input="handleSliderChange(data.prop)"
                />
              </el-form-item>
            </template>
          </el-tree>
          <slot name="style" :style="formData"></slot>
        </el-form>
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ComponentStyle } from '@/components/DiyEditor/util'
import { useVModel } from '@vueuse/core'

/**
 * Component Container Properties：Currently on the right side
 * Used for wrapping components，Provide components with background、Margin 、padding 、Border and other styles
 */
defineOptions({ name: 'ComponentContainer' })

const props = defineProps<{ modelValue: ComponentStyle }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

const treeData = [
  {
    label: 'Margin',
    prop: 'margin',
    children: [
      {
        label: 'Top',
        prop: 'marginTop'
      },
      {
        label: 'Right',
        prop: 'marginRight'
      },
      {
        label: 'Bottom',
        prop: 'marginBottom'
      },
      {
        label: 'Left',
        prop: 'marginLeft'
      }
    ]
  },
  {
    label: 'Padding',
    prop: 'padding',
    children: [
      {
        label: 'Top',
        prop: 'paddingTop'
      },
      {
        label: 'Right',
        prop: 'paddingRight'
      },
      {
        label: 'Bottom',
        prop: 'paddingBottom'
      },
      {
        label: 'Left',
        prop: 'paddingLeft'
      }
    ]
  },
  {
    label: 'Border Radius',
    prop: 'borderRadius',
    children: [
      {
        label: 'Top Left',
        prop: 'borderTopLeftRadius'
      },
      {
        label: 'Top Right',
        prop: 'borderTopRightRadius'
      },
      {
        label: 'Bottom Right',
        prop: 'borderBottomRightRadius'
      },
      {
        label: 'Bottom Left',
        prop: 'borderBottomLeftRadius'
      }
    ]
  }
]

const handleSliderChange = (prop: string) => {
  switch (prop) {
    case 'margin':
      formData.value.marginTop = formData.value.margin
      formData.value.marginRight = formData.value.margin
      formData.value.marginBottom = formData.value.margin
      formData.value.marginLeft = formData.value.margin
      break
    case 'padding':
      formData.value.paddingTop = formData.value.padding
      formData.value.paddingRight = formData.value.padding
      formData.value.paddingBottom = formData.value.padding
      formData.value.paddingLeft = formData.value.padding
      break
    case 'borderRadius':
      formData.value.borderTopLeftRadius = formData.value.borderRadius
      formData.value.borderTopRightRadius = formData.value.borderRadius
      formData.value.borderBottomRightRadius = formData.value.borderRadius
      formData.value.borderBottomLeftRadius = formData.value.borderRadius
      break
  }
}
</script>

<style scoped lang="scss">
:deep(.el-slider__runway) {
  margin-right: 16px;
}

:deep(.el-input-number) {
  width: 50px;
}
</style>
