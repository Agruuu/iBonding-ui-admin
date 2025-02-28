<template>
  <Dialog v-model="dialogVisible" title="Set up Hot Zone" width="780" @close="handleClose">
    <div ref="container" class="relative h-full w-750px">
      <el-image :src="imgUrl" class="pointer-events-none h-full w-750px select-none" />
      <div
        v-for="(item, hotZoneIndex) in formData"
        :key="hotZoneIndex"
        class="hot-zone"
        :style="{
          width: `${item.width}px`,
          height: `${item.height}px`,
          top: `${item.top}px`,
          left: `${item.left}px`
        }"
        @mousedown="handleMove(item, $event)"
        @dblclick="handleShowAppLinkDialog(item)"
      >
        <span class="pointer-events-none select-none">{{ item.name || 'Double click to select link' }}</span>
        <Icon icon="ep:close" class="delete" :size="14" @click="handleRemove(item)" />

        <!-- 8 control point -->
        <span
          class="ctrl-dot"
          v-for="(dot, dotIndex) in CONTROL_DOT_LIST"
          :key="dotIndex"
          :style="dot.style"
          @mousedown="handleResize(item, dot, $event)"
        ></span>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleAdd" type="primary" plain>
        <Icon icon="ep:plus" class="mr-5px" />
        Add Hot Zone
      </el-button>
      <el-button @click="handleSubmit" type="primary" plain>
        <Icon icon="ep:check" class="mr-5px" />
        Confirm
      </el-button>
    </template>
  </Dialog>
  <AppLinkSelectDialog ref="appLinkDialogRef" @app-link-change="handleAppLinkChange" />
</template>

<script setup lang="ts">
import { HotZoneItemProperty } from '@/components/DiyEditor/components/mobile/HotZone/config'
import { array, string } from 'vue-types'
import {
  CONTROL_DOT_LIST,
  CONTROL_TYPE_ENUM,
  ControlDot,
  HOT_ZONE_MIN_SIZE,
  useDraggable,
  zoomIn,
  zoomOut
} from './controller'
import { AppLink } from '@/components/AppLinkInput/data'
import { remove } from 'lodash-es'

/** Hot Zone Editing Dialogue Box */
defineOptions({ name: 'HotZoneEditDialog' })

// Define attributes
const props = defineProps({
  modelValue: array<HotZoneItemProperty>(),
  imgUrl: string().def('')
})
const emit = defineEmits(['update:modelValue'])
const formData = ref<HotZoneItemProperty[]>([])

// Is the pop-up window displayed
const dialogVisible = ref(false)
// Open pop-up window
const open = () => {
  // enlarge
  formData.value = zoomIn(props.modelValue)
  dialogVisible.value = true
}
// provide open method，Used to open pop ups
defineExpose({ open })

// Hot zone container
const container = ref<HTMLDivElement>()

// Increase hot zone
const handleAdd = () => {
  formData.value.push({
    width: HOT_ZONE_MIN_SIZE,
    height: HOT_ZONE_MIN_SIZE,
    top: 0,
    left: 0
  } as HotZoneItemProperty)
}
// Delete hotspot
const handleRemove = (hotZone: HotZoneItemProperty) => {
  remove(formData.value, hotZone)
}

// Mobile hotspot
const handleMove = (item: HotZoneItemProperty, e: MouseEvent) => {
  useDraggable(item, e, (left, top, _, __, moveWidth, moveHeight) => {
    setLeft(item, left + moveWidth)
    setTop(item, top + moveHeight)
  })
}

// Adjust the size of the hot zone、position
const handleResize = (item: HotZoneItemProperty, ctrlDot: ControlDot, e: MouseEvent) => {
  useDraggable(item, e, (left, top, width, height, moveWidth, moveHeight) => {
    ctrlDot.types.forEach((type) => {
      switch (type) {
        case CONTROL_TYPE_ENUM.LEFT:
          setLeft(item, left + moveWidth)
          break
        case CONTROL_TYPE_ENUM.TOP:
          setTop(item, top + moveHeight)
          break
        case CONTROL_TYPE_ENUM.WIDTH:
          {
            // When moving up，Height is reduced
            const direction = ctrlDot.types.includes(CONTROL_TYPE_ENUM.LEFT) ? -1 : 1
            setWidth(item, width + moveWidth * direction)
          }
          break
        case CONTROL_TYPE_ENUM.HEIGHT:
          {
            // Left shift time，Width is reduced
            const direction = ctrlDot.types.includes(CONTROL_TYPE_ENUM.TOP) ? -1 : 1
            setHeight(item, height + moveHeight * direction)
          }
          break
      }
    })
  })
}

// set up X axis coordinates
const setLeft = (item: HotZoneItemProperty, left: number) => {
  // Cannot exceed the container
  if (left >= 0 && left <= container.value!.offsetWidth - item.width) {
    item.left = left
  }
}
// set up Y axis coordinates
const setTop = (item: HotZoneItemProperty, top: number) => {
  // Cannot exceed the container
  if (top >= 0 && top <= container.value!.offsetHeight - item.height) {
    item.top = top
  }
}
// Set width
const setWidth = (item: HotZoneItemProperty, width: number) => {
  // Cannot be less than the minimum width && Cannot exceed the right side of the container
  if (width >= HOT_ZONE_MIN_SIZE && item.left + width <= container.value!.offsetWidth) {
    item.width = width
  }
}
// Set height
const setHeight = (item: HotZoneItemProperty, height: number) => {
  // Cannot be less than the minimum height && Cannot exceed the bottom of the container
  if (height >= HOT_ZONE_MIN_SIZE && item.top + height <= container.value!.offsetHeight) {
    item.height = height
  }
}

// Close the processing dialog box
const handleSubmit = () => {
  // It will automatically trigger handleClose
  dialogVisible.value = false
}

// Close the processing dialog box
const handleClose = () => {
  // narrow
  const list = zoomOut(formData.value)
  emit('update:modelValue', list)
}

const activeHotZone = ref<HotZoneItemProperty>()
const appLinkDialogRef = ref()
const handleShowAppLinkDialog = (hotZone: HotZoneItemProperty) => {
  activeHotZone.value = hotZone
  appLinkDialogRef.value.open(hotZone.url)
}
const handleAppLinkChange = (appLink: AppLink) => {
  if (!appLink || !activeHotZone.value) return
  activeHotZone.value.name = appLink.name
  activeHotZone.value.url = appLink.path
}
</script>

<style scoped lang="scss">
.hot-zone {
  position: absolute;
  background: var(--el-color-primary-light-7);
  opacity: 0.8;
  border: 1px solid var(--el-color-primary);
  color: var(--el-color-primary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  z-index: 10;

  /* control point */
  .ctrl-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: inherit;
    background-color: #fff;
    z-index: 11;
  }

  .delete {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px 2px 6px 6px;
    background-color: var(--el-color-primary);
    border-radius: 0 0 0 80%;
    cursor: pointer;
    color: #fff;
    text-align: right;
  }

  &:hover {
    .delete {
      display: block;
    }
  }
}
</style>
