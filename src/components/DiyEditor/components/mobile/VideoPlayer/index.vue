<template>
  <div class="w-full" :style="{ height: `${property.style.height}px` }">
    <el-image class="w-full w-full" :src="property.posterUrl" v-if="property.posterUrl" />
    <video
      v-else
      class="w-full w-full"
      :src="property.videoUrl"
      :poster="property.posterUrl"
      :autoplay="property.autoplay"
      controls
    ></video>
  </div>
</template>
<script setup lang="ts">
import { VideoPlayerProperty } from './config'

/** Video playback */
defineOptions({ name: 'VideoPlayer' })

defineProps<{ property: VideoPlayerProperty }>()
</script>

<style scoped lang="scss">
/* picture */
img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
