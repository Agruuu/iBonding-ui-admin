<template>
  <ComponentContainerProperty v-model="formData.style">
    <!-- form  -->
    <el-form label-width="80px" :model="formData" class="m-t-8px">
      <el-form-item label="Upload Image" prop="imgUrl">
        <UploadImg v-model="formData.imgUrl" height="50px" width="auto" class="min-w-80px">
          <template #tip>
            <el-text type="info" size="small"> Recommended Width 750</el-text>
          </template>
        </UploadImg>
      </el-form-item>
    </el-form>

    <el-button type="primary" plain class="w-full" @click="handleOpenEditDialog">
      Set up Hot Zone
    </el-button>
  </ComponentContainerProperty>
  <!-- Hot Zone Editing Dialogue Box -->
  <HotZoneEditDialog ref="editDialogRef" v-model="formData.list" :img-url="formData.imgUrl" />
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { HotZoneProperty } from '@/components/DiyEditor/components/mobile/HotZone/config'
import HotZoneEditDialog from './components/HotZoneEditDialog/index.vue'

/** Hot Zone Properties Panel */
defineOptions({ name: 'HotZoneProperty' })

const props = defineProps<{ modelValue: HotZoneProperty }>()
const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

// Hot Zone Editing Dialogue Box
const editDialogRef = ref()
// Open the hot zone editing dialog box
const handleOpenEditDialog = () => {
  editDialogRef.value.open()
}
</script>

<style scoped lang="scss">
.hot-zone {
  position: absolute;
  background: #409effbf;
  border: 1px solid var(--el-color-primary);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;

  /* control point */
  .ctrl-dot {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #fff;
  }
}
</style>
