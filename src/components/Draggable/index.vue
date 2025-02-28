<template>
  <el-text type="info" size="small"> Drag the small circular dot in the upper left corner to sort it </el-text>
  <VueDraggable
    :list="formData"
    :force-fallback="true"
    :animation="200"
    handle=".drag-icon"
    class="m-t-8px"
    item-key="index"
  >
    <template #item="{ element, index }">
      <div
        class="mb-4px flex flex-col gap-4px border border-gray-2 border-rounded rounded border-solid p-8px"
      >
        <!-- Operation button area -->
        <div
          class="m--8px m-b-4px flex flex-row items-center justify-between p-8px"
          style="background-color: var(--app-content-bg-color)"
        >
          <el-tooltip content="Drag Sort">
            <Icon
              icon="ic:round-drag-indicator"
              class="drag-icon cursor-move"
              style="color: #8a909c"
            />
          </el-tooltip>
          <el-tooltip content="Delete">
            <Icon
              icon="ep:delete"
              class="cursor-pointer text-red-5"
              v-if="formData.length > 1"
              @click="handleDelete(index)"
            />
          </el-tooltip>
        </div>
        <!-- Content Area -->
        <slot :element="element" :index="index"></slot>
      </div>
    </template>
  </VueDraggable>
  <el-tooltip :disabled="limit < 1" :content="`Add a maximum of ${limit} items`">
    <el-button
      type="primary"
      plain
      class="m-t-4px w-full"
      :disabled="limit > 0 && formData.length >= limit"
      @click="handleAdd"
    >
      <Icon icon="ep:plus" /><span>Add</span>
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
// Drag and drop components
import VueDraggable from 'vuedraggable'
import { useVModel } from '@vueuse/core'
import { any, array } from 'vue-types'
import { propTypes } from '@/utils/propTypes'
import { cloneDeep } from 'lodash-es'

// Drag and drop component encapsulation
defineOptions({ name: 'Draggable' })

// Define attributes
const props = defineProps({
  // Binding value
  modelValue: array<any>().isRequired,
  // Empty element：When clicking the add button，Create elements and add them to the list；Default to empty object
  emptyItem: any<unknown>().def({}),
  // Quantity limit：Default is 0，Indicating no restrictions
  limit: propTypes.number.def(0)
})
// Define events
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

// Process Add
const handleAdd = () => formData.value.push(cloneDeep(props.emptyItem || {}))
// Processing deletion
const handleDelete = (index: number) => formData.value.splice(index, 1)
</script>

<style scoped lang="scss"></style>
