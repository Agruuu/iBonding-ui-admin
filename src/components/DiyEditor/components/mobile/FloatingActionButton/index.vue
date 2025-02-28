<template>
  <div
    :class="[
      'absolute bottom-32px right-[calc(50%-375px/2+32px)] flex z-12 gap-12px items-center',
      {
        'flex-row': property.direction === 'horizontal',
        'flex-col': property.direction === 'vertical'
      }
    ]"
  >
    <template v-if="expanded">
      <div
        v-for="(item, index) in property.list"
        :key="index"
        class="flex flex-col items-center"
        @click="handleActive(index)"
      >
        <el-image :src="item.imgUrl" fit="contain" class="h-27px w-27px">
          <template #error>
            <div class="h-full w-full flex items-center justify-center">
              <Icon icon="ep:picture" :color="item.textColor" />
            </div>
          </template>
        </el-image>
        <span v-if="property.showText" class="mt-4px text-12px" :style="{ color: item.textColor }">
          {{ item.text }}
        </span>
      </div>
    </template>
    <!-- todo: @Agruuu use APP theme color -->
    <el-button type="primary" size="large" circle @click="handleToggleFab">
      <Icon icon="ep:plus" :class="['fab-icon', { active: expanded }]" />
    </el-button>
  </div>
  <!-- Modal background：Display when unfolded，Click to fold -->
  <div v-if="expanded" class="modal-bg" @click="handleToggleFab"></div>
</template>
<script setup lang="ts">
import { FloatingActionButtonProperty } from './config'

/** Suspension button */
defineOptions({ name: 'FloatingActionButton' })
// Define attributes
defineProps<{ property: FloatingActionButtonProperty }>()

// Expand or not
const expanded = ref(false)
// Process unfolding/fold
const handleToggleFab = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped lang="scss">
/* Modal background */
.modal-bg {
  position: absolute;
  left: calc(50% - 375px / 2);
  top: 0;
  z-index: 11;
  width: 375px;
  height: 100%;
  background-color: rgba(#000000, 0.4);
}

.fab-icon {
  transform: rotate(0deg);
  transition: transform 0.3s;

  &.active {
    transform: rotate(135deg);
  }
}
</style>
